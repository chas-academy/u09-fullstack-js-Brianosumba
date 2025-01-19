import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar"; // Ensure NavBar is imported
import Footer from "../components/Footer"; // Ensure Footer is imported
import CircularProgressBar from "../components/CircularProgressBar"; // Import CircularProgressBar component
import Box from "@mui/material/Box"; // Material-UI Box for layout
import Typography from "@mui/material/Typography"; // Material-UI Typography for text

const ExerciseDetail = () => {
  const { exerciseId } = useParams(); // Get exerciseId from the URL parameters
  const [exercise, setExercise] = useState(null); // State for exercise details
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]); // Recommended workouts

  // Progress tracking state
  const [workoutsToday, setWorkoutsToday] = useState(
    () => parseInt(localStorage.getItem("workoutsToday")) || 0
  );
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(
    () => parseInt(localStorage.getItem("workoutsThisWeek")) || 0
  );
  const [workoutsThisMonth, setWorkoutsThisMonth] = useState(
    () => parseInt(localStorage.getItem("workoutsThisMonth")) || 0
  );
  const [strengthProgress, setStrengthProgress] = useState(
    () => parseFloat(localStorage.getItem("strengthProgress")) || 0
  );

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("workoutsToday", workoutsToday);
    localStorage.setItem("workoutsThisWeek", workoutsThisWeek);
    localStorage.setItem("workoutsThisMonth", workoutsThisMonth);
    localStorage.setItem("strengthProgress", strengthProgress);
  }, [workoutsToday, workoutsThisWeek, workoutsThisMonth, strengthProgress]);

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
      try {
        const userId = localStorage.getItem("userId"); // Assume userId is stored in localStorage

        if (!userId) {
          console.error("User ID not found in localStorage. Redirecting...");
          window.location.href = "/login";
          return;
        }

        // Step 1: Fetch recommendations from your backend
        const backendResponse = await axios.get(
          `http://localhost:3000/api/recommendations/${userId}`
        );

        const recommendations = backendResponse.data;
        console.log("Fetched recommendations from backend:", recommendations);

        // Step 2: Fetch exercise details for each recommendation
        const recommendationWithDetails = await Promise.all(
          backendResponse.data.map(async (recommendation, index) => {
            try {
              const exerciseResponse = await axios.get(
                `https://exercisedb.p.rapidapi.com/exercises/exercise/${recommendation.exerciseId}`,
                {
                  headers: {
                    "X-RAPIDAPI-KEY": import.meta.env.VITE_RAPIDAPI_KEY,
                    "X-RAPIDAPI-HOST": "exercisedb.p.rapidapi.com",
                  },
                }
              );

              // Merge recommendations data with exercise details
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

              // Return recommendation with empty exerciseDetails on failure
              return {
                ...recommendation,
                uniqueKey:
                  recommendation.id || `${recommendation.exerciseId}-${index}`,
                exerciseDetails: {
                  name: "Unknown",
                  bodyPart: "Unkown",
                  target: "Unkown",
                  gifUrl: null,
                },
              };
            }
          })
        );

        // Step 3: Update state with recommendations and their details
        setRecommendedWorkouts(recommendationWithDetails);
        console.log(
          "Recommendations with exercise details:",
          recommendationWithDetails
        );
      } catch (error) {
        console.error("Failed to fetch recommended workouts:", error.message);
      }
    };

    fetchRecommendations();
  }, []); // Dependency array: [] ensures it only runs on mount

  // Reset progress functions
  const resetDay = () => setWorkoutsToday(0);
  const resetWeek = () => setWorkoutsThisWeek(0);
  const resetMonth = () => {
    setWorkoutsThisMonth(0);
    setStrengthProgress(0);
  };

  // Reset logic with intervals
  useEffect(() => {
    const resetDaily = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) resetDay();
    }, 300000);

    const resetWeekly = setInterval(() => {
      const now = new Date();
      if (now.getDay() === 1 && now.getHours() === 0 && now.getMinutes() === 0)
        resetWeek();
    }, 300000);

    const resetMonthly = setInterval(() => {
      const now = new Date();
      if (now.getDate() === 1 && now.getHours() === 0 && now.getMinutes() === 0)
        resetMonth();
    }, 300000);

    return () => {
      clearInterval(resetDaily);
      clearInterval(resetWeekly);
      clearInterval(resetMonthly);
    };
  }, []);

  // Handle workout completion
  const handleDoneClick = async () => {
    setWorkoutsToday((prev) => Math.min(prev + 1, 1));
    setWorkoutsThisWeek((prev) => Math.min(prev + 1, 3));
    setWorkoutsThisMonth((prev) => Math.min(prev + 1, 12));
    setStrengthProgress((prev) => Math.min(prev + 100 / 12, 100));

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token) {
        console.error(
          "Token not found in localStorage. Redirecting to login..."
        );
        window.location.href = "/login";
        return;
      }

      if (!userId) {
        console.error("User ID not found in localstorage. Redirecting...");
        window.location.href = "/login";
        return;
      }

      const payload = {
        userId: userId, // Ensure userId is included
        exerciseId: exercise?.id, // Ensure exerciseId is included
        workoutType: exercise?.bodyPart || "N/A", // Optional field
        target: exercise?.target || "N/A", // Optional field
        level: "Beginner", // Example field
      };

      console.log("Payload being sent to backend:", payload);

      const response = await axios.post(
        "http://localhost:3000/api/exercises/complete", // Backend endpoint
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include authorization header
          },
        }
      );

      console.log("Workout completion sent to server:", response.data);
    } catch (error) {
      console.error("Error sending workout completion:", error.message);
    }
  };

  if (!exercise) {
    return <div>Loading...</div>;
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
            onClick={handleDoneClick}
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
            value={workoutsToday}
            max={1}
            color="green"
          />
          <CircularProgressBar
            label="Workouts Completed This Week"
            value={workoutsThisWeek}
            max={3}
            color="orange"
          />
          <CircularProgressBar
            label="Workouts Completed This Month"
            value={workoutsThisMonth}
            max={12}
            color="red"
          />
          <CircularProgressBar
            label="Strength Progress"
            value={strengthProgress}
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
