import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar"; // Ensure to import your NavBar
import Footer from "./footer"; // Ensure to import your Footer
import CircularProgressBar from "./CircularProgressBar"; // Import your CircularProgressBar component
import Box from "@mui/material/Box"; // Import MUI Box
import Typography from "@mui/material/Typography"; // Import MUI Typography

const ExerciseDetail = () => {
  const { exerciseId } = useParams(); // Get the exerciseId from the URL parameters
  const [exercise, setExercise] = useState(null); // State to hold the exercise details

  // State Initialization with localStorage
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

  //Save progress
  useEffect(() => {
    localStorage.setItem("workoutsToday", workoutsToday);
    localStorage.setItem("workoutsThisWeek", workoutsThisWeek);
    localStorage.setItem("workoutsThisMonth", workoutsThisMonth);
    localStorage.setItem("strengthProgress", strengthProgress);
  }, [workoutsToday, workoutsThisWeek, workoutsThisMonth, strengthProgress]);

  // Reset functions
  const resetDay = () => {
    setWorkoutsToday(0);
    localStorage.setItem("workoutsToday", 0);
  };

  const resetWeek = () => {
    setWorkoutsThisWeek(0);
    localStorage.setItem("workoutsThisWeek", 0);
  };

  const resetMonth = () => {
    setWorkoutsThisMonth(0);
    setStrengthProgress(0);
    localStorage.setItem("workoutsThisMonth", 0);
    localStorage.setItem("strengthProgress", 0);
  };

  // Reset logic
  useEffect(() => {
    const resetDaily = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetDay();
      }
    }, 300000);

    const resetWeekly = setInterval(() => {
      const now = new Date();
      if (
        now.getDay() === 1 &&
        now.getHours() === 0 &&
        now.getMinutes() === 0
      ) {
        resetWeek();
      }
    }, 300000);

    const resetMonthly = setInterval(() => {
      const now = new Date();
      if (
        now.getDate() === 1 &&
        now.getHours() === 0 &&
        now.getMinutes() === 0
      ) {
        resetMonth();
      }
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

    if (strengthProgress < 100) {
      const newStrength = Math.min(strengthProgress + 100 / 12, 100);
      setStrengthProgress(newStrength);
    }

    console.log("Done clicked!");
    //Send data to server
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/exercises/complete",
        {
          exerciseId: exercise.Id,
          workoutType: exercise.bodyPart,
          target: exercise.target,
          level: "Beginner",
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

        console.log(response.data);
        setExercise(response.data); // Set the exercise details
      } catch (error) {
        console.error("Failed to fetch exercise details:", error);
      }
    };

    fetchExerciseDetail();
  }, [exerciseId]);

  if (!exercise) {
    return <div>Loading...</div>; // Show loading while fetching exercise details
  }

  return (
    <div className=" min-h-screen">
      <NavBar />
      <div className="container mx-auto py-8">
        <Typography variant="h3" component="h1" className="mb-4" gutterBottom>
          {exercise.name}
        </Typography>

        {/* Box for GIF using Material-UI Box */}
        <Box
          component="img"
          src={exercise.gifUrl}
          alt={exercise.name}
          sx={{
            width: "40%", // Set a fixed width for the GIF
            height: "auto", // Set a fixed height for the GIF
            objectFit: "cover", // Maintain aspect ratio of GIF
            display: "block",
            mb: 2, // Add margin below the image
            mx: "auto", // Center the image
            borderRadius: 2, // Add some border radius for aesthetics
            boxShadow: 3, // Add shadow for better visibility
          }}
        />

        <Typography variant="h6" className="mb-2 font-semibold text-green-600">
          Body Part: {exercise.bodyPart}
        </Typography>
        <Typography variant="h6" className="mb-2 font-semibold text-blue-500">
          Target: {exercise.target}
        </Typography>
        <Typography variant="h6" className="mb-2 font-semibold text-orange-500">
          Equipment: {exercise.equipment}
        </Typography>
        <Typography variant="h6" className="mb-2 font-semibold text-slate-500">
          Instructions: {exercise.instructions}
        </Typography>

        <div className="text-center my-8">
          <button
            onClick={handleDoneClick}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Done
          </button>
        </div>

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
            label="Strength Growth"
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
