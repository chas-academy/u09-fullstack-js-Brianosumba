import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CircularProgressBar from "../components/CircularProgressBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { io } from "socket.io-client";

const socket = io(BASE_URL, { withCredentials: true });

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const ExerciseDetail = () => {
  const { exerciseId } = useParams(); // Get exerciseId from the URL parameters
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [exercise, setExercise] = useState(null); // State for exercise details
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]); // Recommended workouts
  const [progress, setProgress] = useState({
    workoutsToday: 0,
    workoutsThisWeek: 0,
    workoutsThisMonth: 0,
    strengthProgress: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found! Redirecting to login...");
      window.location.href = "/login";
      return {};
    }

    console.log("Token being sent in headers:", token);

    return {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    };
  };

  //Helper function to check if the token is expired
  const isTokenExpired = (token) => {
    try {
      const payloadBase64 = token.split(".")[1];
      const deacodedPayload = JSON.parse(atob(payloadBase64));
      const currentTime = Math.floor(Date.now() / 1000);

      return deacodedPayload.exp && currentTime > deacodedPayload.exp;
    } catch (error) {
      console.error("Token decoding failed:", error);
      return true;
    }
  };

  useEffect(() => {
    if (!userId || !token || isTokenExpired(token)) {
      console.error("User not authenticated. Redirecting to login...");
      window.location.href = "/login";
      return;
    }
  }, [userId, token]);

  // Fetch Progress from Backend
  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId || !token || isTokenExpired(token)) {
        console.error("User not authenticated. Reirecting to login...");
        window.location.href = "/login";
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/progress/${userId}`, {
          headers: getAuthHeaders(),
        });

        console.log("Progress fetched successfully:", response.data);
        setProgress(response.data);
      } catch (error) {
        console.error("Failed to fetch progress:", error.message);
        if (error.response?.status === 403) {
          console.warn("Redirecting to login due to invalid or expired token");
          window.location.href = "/login";
        }
        alert("Could not load progress. Please try again later");
      }
    };
    fetchProgress();
  }, [userId, token]);

  // Save progress to locally
  useEffect(() => {
    localStorage.setItem("workoutsToday", progress.workoutsToday);
    localStorage.setItem("workoutsThisWeek", progress.workoutsThisWeek);
    localStorage.setItem("workoutsThisMonth", progress.workoutsThisMonth);
    localStorage.setItem("strengthProgress", progress.strengthProgress);
  }, [progress]);

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
      }
    };

    fetchExerciseDetail();
  }, [exerciseId]);

  // Fetch recommended workouts
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId || !token || isTokenExpired(token)) {
        console.error(
          "User not authenticated or token expired. Redirecting to login..."
        );
        window.location.href = "/login";
        return;
      }

      try {
        console.log("Fetching recommendations with headers:", getAuthHeaders());

        // Fetch recommendations from backend
        const backendResponse = await axios.get(
          `${BASE_URL}/recommendations/${userId}`,
          {
            headers: getAuthHeaders(),
          }
        );

        console.log("Backend response:", backendResponse.data);
        const recommendations = backendResponse.data;

        if (!recommendations.length) {
          console.warn("No recommendations found.");
          setLoading(false);
          return;
        }

        // Fetch exercise details for each recommendation
        const recommendationWithDetails = await Promise.all(
          recommendations.map(async (recommendation, index) => {
            try {
              const exerciseResponse = await axios.get(
                `https://exercisedb.p.rapidapi.com/exercises/exercise/${recommendation.exerciseId}`,
                {
                  headers: {
                    "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
                    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
                  },
                }
              );

              return {
                ...recommendation,
                uniqueKey:
                  recommendation.id || `${recommendation.exerciseId}-${index}`,
                exerciseDetails: exerciseResponse.data,
              };
            } catch (error) {
              console.error(
                `Failed to fetch details for exerciseId: ${recommendation.exerciseId}`,
                error
              );

              return {
                ...recommendation,
                uniqueKey:
                  recommendation.id || `${recommendation.exerciseId}-${index}`,
                exerciseDetails: {
                  name: "Unknown",
                  bodyPart: "Unknown",
                  target: "Unknown",
                  gifUrl: null,
                },
              };
            }
          })
        );

        setRecommendedWorkouts(recommendationWithDetails);
      } catch (error) {
        console.error("Failed to fetch recommended workouts:", error.message);

        if (error.response) {
          if (error.response.status === 403) {
            console.warn(
              "Redirecting to login due to invalid or expired token"
            );
            window.location.href = "/login";
          } else if (error.response.status === 404) {
            console.warn("No recommendations found for this user.");
          } else {
            console.error(
              "Server error:",
              error.response.status,
              error.response.data
            );
          }
        }

        setError(
          "Could not load recommended workouts. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, token]);

  // Handle workout completion
  const handleDoneComplete = async () => {
    // Verify that user and exercise details are available
    if (!userId || !token || !exerciseId || isTokenExpired(token)) {
      console.error("Missing user authentication or exercise details.");
      alert("Unable to complete workout. Please try again.");
      window.location.href = "/login";
      return;
    }

    // Update progress locally
    const updatedProgress = {
      workoutsToday: Math.min(progress.workoutsToday + 1, 1),
      workoutsThisWeek: Math.min(progress.workoutsThisWeek + 1, 3),
      workoutsThisMonth: Math.min(progress.workoutsThisMonth + 1, 12),
      strengthProgress: Math.min(progress.strengthProgress + 100 / 12, 100),
    };

    setProgress(updatedProgress);

    try {
      // 2. Send progress update to the backend
      await axios.put(`${BASE_URL}/progress/${userId}`, updatedProgress, {
        headers: getAuthHeaders(),
      });

      console.log("Progress updated successfully.");

      // 3. Send workout completion event to admin (optional but required in your case)
      const completionPayload = {
        userId,
        exerciseId,
        workoutType: exercise?.bodyPart || "N/A",
        target: exercise?.target || "N/A",
        level: "Beginner",
      };

      console.log("Sending POST request to:", `${BASE_URL}/exercises/complete`);
      console.log("Payload:", completionPayload);
      console.log("Headers:", getAuthHeaders());

      const response = await axios.post(
        `${BASE_URL}/exercises/complete`,
        completionPayload,
        {
          headers: getAuthHeaders(),
        }
      );

      console.log("Workout completion sent to server:", response.data);

      // **Emit event to notify the Admin page**
      socket.emit("exerciseCompleted", completionPayload);

      // 4. Provide success feedback to the user
      alert("Workout marked as complete!");
    } catch (error) {
      console.error(
        "Error updating progress or completing workout:",
        error.message
      );
      if (error.response?.status === 403) {
        console.warn("Redirecting to login due to invalid or expired token");
        window.location.href = "/login";
      }
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
