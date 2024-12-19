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
          console.error("User ID not found in localStorage");
          return;
        }
        S;
        const response = await axios.get(
          `http://localhost:3000/api/exercises/recommendations/${userId}`
        );
        setRecommendedWorkouts(response.data);
      } catch (error) {
        console.error("Failed to fetch recommended workouts:", error);
      }
    };

    fetchRecommendations();
  }, []);

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
      await axios.post(
        "http://localhost:3000/api/exercises/complete",
        {
          exerciseId: exercise.id,
          workoutType: exercise.bodyPart,
          target: exercise.target,
          level: "Beginner", // Example level
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Workout completion sent to server.");
    } catch (error) {
      console.error("Error sending workout completion:", error);
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
        <div className="mt-8">
          <Typography variant="h5" component="h2" gutterBottom>
            Recommended Workouts
          </Typography>
          <ul>
            {recommendedWorkouts.map((workout) => (
              <li key={workout.exerciseId}>
                <Typography>{workout.notes}</Typography>
              </li>
            ))}
          </ul>
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
