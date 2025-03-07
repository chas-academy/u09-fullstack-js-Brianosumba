import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CircularProgressBar from "../components/CircularProgressBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { io } from "socket.io-client";
import { isTokenExpired } from "../services/authService";
import {
  fetchRecommendations,
  completeExercise,
  fetchCompletedWorkouts,
} from "../services/exerciseService";

const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

const ExerciseDetail = () => {
  const { exerciseId } = useParams(); // Get exerciseId from the URL parameters
  const userId = localStorage.getItem("userId");

  const [exercise, setExercise] = useState(null); // State for exercise details
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]); // Recommended workouts
  const [progress, setProgress] = useState({
    workoutsToday: 0,
    workoutsThisWeek: 0,
    workoutsThisMonth: 0,
    strengthProgress: 0,
  });
  const socketListenerAdded = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!userId || !token || isTokenExpired(token)) {
      console.error("User not authenticated. Redirecting to login...");
      window.location.href = "/login";
      return;
    }
  }, [userId]);

  // Fetch Completed workouts and Update progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const workouts = await fetchCompletedWorkouts(userId);
        console.log("User progress:", workouts);

        const updatedProgress = {
          workoutsToday: Math.min(
            workouts.filter((w) => w.completedToday).length,
            1
          ),
          workoutsThisWeek: Math.min(
            workouts.filter((w) => w.completedThisWeek).length,
            3
          ),
          workoutsThisMonth: Math.min(
            workouts.filter((w) => w.completedThisMonth).length,
            12
          ),
          strengthProgress: Math.min((workouts.length / 12) * 100, 100),
        };

        setProgress(updatedProgress);

        // Save to localStorage
        localStorage.setItem("workoutsToday", updatedProgress.workoutsToday);
        localStorage.setItem(
          "workoutsThisWeek",
          updatedProgress.workoutsThisWeek
        );
        localStorage.setItem(
          "workoutsThisMonth",
          updatedProgress.workoutsThisMonth
        );
        localStorage.setItem(
          "strengthProgress",
          updatedProgress.strengthProgress
        );
      } catch (error) {
        console.error("Failed to fetch progress:", error.message);
        alert("Could not load progress. Please try again later");
      }
    };
    fetchProgress();
  }, [userId]);

  // Fetch exercise details
  useEffect(() => {
    const fetchExerciseDetail = async () => {
      try {
        const response = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/exercise/${exerciseId}`,
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
              "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
          }
        );
        setExercise(response.data);
      } catch (error) {
        console.error("Failed to fetch exercise details:", error);
        setError("Failed to load exercise details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetail();
  }, [exerciseId]);

  //  Fetch recommendations
  useEffect(() => {
    fetchRecommendations(userId, setRecommendedWorkouts);

    const handleRecommendationUpdate = (data) => {
      if (data.userId === userId) {
        fetchRecommendations(userId, setRecommendedWorkouts);
      }
    };

    socket.on("recommendationUpdated", handleRecommendationUpdate);

    return () => {
      socket.off("recommendationUpdated", handleRecommendationUpdate);
    };
  }, [userId]);

  const handleDoneComplete = async () => {
    try {
      const completionData = {
        userId,
        exerciseId,
        workoutType: exercise?.bodyPart || "N/A",
        target: exercise?.target || "N/A",
        level: "Beginner",
        completedAt: new Date().toISOString(),
      };

      await completeExercise(completionData);
      alert("Workout marked as complete!");

      const workouts = await fetchCompletedWorkouts(userId);
      setProgress({
        workoutsToday: Math.min(
          workouts.filter((w) => w.completedToday).length,
          1
        ),
        workoutsThisWeek: Math.min(
          workouts.filter((w) => w.completedThisWeek).length,
          3
        ),
        workoutsThisMonth: Math.min(
          workouts.filter((w) => w.completedThisMonth).length,
          12
        ),
        strengthProgress: Math.min((workouts.length / 12) * 100, 100),
      });

      // Send WebSocket event for **Admin.jsx** to update immediately
      socket.emit("exerciseCompleted", {
        userId,
        exerciseId,
        completedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating progress:", error.message);
      alert("Could not complete workout. Please try again.");
    }
  };

  if (loading || !exercise) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto py-8">
        <Typography variant="h3" component="h1" gutterBottom>
          {exercise.name}
        </Typography>

        {/* Exercise GIF */}
        <Box
          component="img"
          src={exercise.gifUrl}
          alt={exercise.name}
          sx={{
            width: "40%",
            height: "auto",
            objectFit: "cover",
            display: "block",
            mb: 2,
            mx: "auto",
            borderRadius: 2,
            boxShadow: 3,
          }}
        />

        <Typography variant="h6" gutterBottom>
          <strong>Body Part:</strong> {exercise.bodyPart}
        </Typography>
        <Typography variant="h6" gutterBottom>
          <strong>Target:</strong> {exercise.target}
        </Typography>
        <Typography variant="h6" gutterBottom>
          <strong>Equipment:</strong> {exercise.equipment}
        </Typography>

        {/* Done Button */}
        <div className="text-center my-8">
          <button
            onClick={handleDoneComplete}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Done
          </button>
        </div>

        {/* Recommended Workouts */}
        <div className="mt-8 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Recommended Workouts
          </h2>
          {recommendedWorkouts.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedWorkouts.map((workout) => (
                <li
                  key={workout.uniqueKey}
                  className="flex flex-col items-center bg-white rounded-lg shadow-md p-6"
                >
                  {/* Image */}
                  {workout.exerciseDetails?.gifUrl && (
                    <img
                      src={workout.exerciseDetails.gifUrl}
                      alt={workout.exerciseDetails.name}
                      className="w-full max-w-sm rounded-md shadow-lg mb-4 transition-transform transform hover:scale-105"
                    />
                  )}
                  {/* Details */}
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-800">
                      <strong>Exercise Name:</strong>{" "}
                      {workout.exerciseDetails?.name || "N/A"}
                    </p>
                    <p className="text-gray-600 mt-1">
                      <strong>Body Part:</strong>{" "}
                      {workout.exerciseDetails?.bodyPart || "N/A"}
                    </p>
                    <p className="text-gray-600 mt-1">
                      <strong>Target:</strong>{" "}
                      {workout.exerciseDetails?.target || "N/A"}
                    </p>
                    <p className="text-gray-600 mt-1">
                      <strong>Notes:</strong>{" "}
                      {workout.notes || "No additional notes."}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">
              No recommended workouts found.
            </p>
          )}
        </div>

        {/* Progress Bars */}
        <div className="mt-8 space-y-4">
          <CircularProgressBar
            label="Workouts Completed Today"
            value={progress.workoutsToday}
            max={1}
            color="green"
          />
          <CircularProgressBar
            label="Workouts Completed This Week"
            value={progress.workoutsThisWeek}
            max={3}
            color="orange"
          />
          <CircularProgressBar
            label="Workouts Completed This Month"
            value={progress.workoutsThisMonth}
            max={12}
            color="red"
          />
          <CircularProgressBar
            label="Strength Progress"
            value={progress.strengthProgress}
            max={100}
            color="blue"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExerciseDetail;
