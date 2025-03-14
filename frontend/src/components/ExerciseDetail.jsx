import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CircularProgressBar from "../components/CircularProgressBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { isTokenExpired } from "../services/authService";
import {
  fetchRecommendations,
  completeExercise,
  fetchCompletedWorkouts,
  HEADERS,
  connectWebsocket,
  socket,
} from "../services/exerciseService";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userIdRef = useRef(userId);

  useEffect(() => {
    connectWebsocket();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!userId || !token || isTokenExpired(token)) {
      console.error("User not authenticated. Redirecting to login...");
      window.location.href = "/login";
      return;
    }
  }, [userId]);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const loadRecommendations = async () => {
        const newRecommendations = await fetchRecommendations(userId);
        console.log("Updated recommended workouts:", newRecommendations);
        setRecommendedWorkouts(newRecommendations);
      };
      loadRecommendations();
    }
  }, [userId]);

  useEffect(() => {
    const handleRecommendationUpdate = async (data) => {
      console.log("WebSocket event received for recommendation update:", data);

      if (String(data.userId) === String(userIdRef.current)) {
        const newRecommendations = await fetchRecommendations(
          userIdRef.current
        );
        setRecommendedWorkouts((prev) => {
          const merged = [...prev, ...newRecommendations];

          const uniqueRecommendations = merged.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.exerciseId === item.exerciseId)
          );
          return uniqueRecommendations;
        });
      }
    };

    socket.on("recommendationUpdated", handleRecommendationUpdate);

    return () => {
      socket.off("recommendationUpdated", handleRecommendationUpdate);
    };
  }, []);

  // Fetch exercise details
  useEffect(() => {
    const fetchExerciseDetail = async () => {
      try {
        const response = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/exercise/${exerciseId}`,
          { headers: HEADERS }
        );

        const exerciseData = response.data || {};

        setExercise({
          name: exerciseData.name || "unkown Exercise",
          bodyPart: exerciseData.bodyPart || "N/A",
          target: exerciseData.target || "N/A",
          equipment: exerciseData.equipment || "N/A",
          gifUrl: exerciseData.gifUrl || "",
        });
      } catch (error) {
        setError("Failed to load exercise details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetail();
  }, [exerciseId]);

  // Fetch completed workouts progress
  const fetchProgress = async () => {
    try {
      if (!userId) return;

      const workouts = await fetchCompletedWorkouts(userId);
      const today = Date.now();
      const oneWeekAgo = today - 7 * 24 * 60 * 60 * 1000;
      const oneMonthAgo = today - 30 * 24 * 60 * 60 * 1000;

      // ✅ Ensure correct userId matching
      const userWorkouts = workouts.filter(
        (w) => String(w.userId) === String(userId)
      );

      // ✅ Correct timestamp comparison
      const updatedProgress = userWorkouts.reduce(
        (acc, workout) => {
          const completedAt = new Date(workout.completedAt).getTime(); // ✅ Convert to timestamp

          if (completedAt >= today) acc.workoutsToday++;
          if (completedAt >= oneWeekAgo) acc.workoutsThisWeek++;
          if (completedAt >= oneMonthAgo) acc.workoutsThisMonth++;

          return acc;
        },
        { workoutsToday: 0, workoutsThisWeek: 0, workoutsThisMonth: 0 }
      );

      // ✅ More readable `strengthProgress` calculation
      updatedProgress.strengthProgress = Math.min(
        (userWorkouts.length / 12) * 100,
        100
      );

      setProgress(updatedProgress);
    } catch (error) {
      console.error("Failed to fetch progress:", error.message);
    }
  };

  // //  Fetch recommendations
  // useEffect(() => {
  //   if (userId) {
  //     fetchRecommendations(userId, (newRecommendations) => {
  //       console.log("Updated recommended workouts:", newRecommendations);
  //       setRecommendedWorkouts([...newRecommendations]); // Force re-render
  //     });
  //   }
  // }, [userId]);

  //Mark Exercise as Completed
  const handleDoneComplete = async () => {
    if (!userId || !exerciseId || !exercise) {
      alert("Invalid data! Ensure all required fields are available.");
      return;
    }

    const completionData = {
      userId,
      exerciseId,
      workoutType: exercise?.bodyPart || "N/A",
      target: exercise?.target || "N/A",
      level: "Beginner",
      completedAt: new Date().toISOString(),
    };

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      console.log("Sending completion request:", completionData);
      await completeExercise(completionData);

      console.log("Fetching updated progress...");
      await fetchProgress(); // ✅ Now updates progress immediately!

      alert("Workout marked as complete!");
      socket.emit("exerciseCompleted", completionData);
    } catch (error) {
      console.error("Error completing exercise:", error.message);
      alert("Could not complete workout. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            id="done-button"
            onClick={handleDoneComplete}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Done"}
          </button>
        </div>

        {/* Recommended Workouts */}
        <div className="mt-8 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Recommended Workouts
          </h2>
          {recommendedWorkouts.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedWorkouts.map((workout, index) => (
                <li
                  key={workout._id || workout.exerciseId || index}
                  className="flex flex-col items-center bg-white rounded-lg shadow-md p-6"
                >
                  {/* Image */}
                  {console.log("workout data", workout)}
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
                      {workout.exerciseDetails?.name ||
                        "Exercise details unavailable"}
                    </p>
                    <p className="text-gray-600 mt-1">
                      <strong>Body Part:</strong>{" "}
                      {workout.exerciseDetails?.bodyPart ||
                        "Exercise details unavailable"}
                    </p>
                    <p className="text-gray-600 mt-1">
                      <strong>Target:</strong>{" "}
                      {workout.exerciseDetails?.target ||
                        "Exercise details unavailable"}
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
