import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { Box, Typography, Grid } from "@mui/material"; // Import MUI components

const Exercisepage = () => {
  const { exerciseName } = useParams(); // Get the exerciseName from URL parameters
  const [exercises, setExercises] = useState([]); // State to hold exercises
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${exerciseName}`,
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
              "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
          }
        );
        console.log(response.data);
        setExercises(response.data); // Set the exercises for the selected body part
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    };

    fetchExercises();
  }, [exerciseName]);

  const handleExerciseClick = (exerciseId) => {
    navigate(`/exercise-detail/${exerciseId}`); // Navigate to the detailed exercise page
  };

  return (
    <Box p={4}>
      <Typography
        variant="h3"
        fontWeight="bold"
        mb={4}
        textAlign="center"
        sx={{ textTransform: "capitalize" }}
      >
        {exerciseName} Exercises
      </Typography>

      {/* Use a Grid container to create two-column layout */}
      <Grid container spacing={4}>
        {exercises.map((exercise) => (
          <Grid
            item
            xs={12} // Full width on small screens
            sm={6} // Two columns on medium and larger screens
            key={exercise.id} // Ensure each exercise has a unique key
          >
            <Box
              sx={{
                display: "flex", // Vertical layout within each exercise card
                flexDirection: "column", // Stack elements vertically
                alignItems: "center", // Center the content horizontally
                justifyContent: "center", // Center the content vertically
                borderRadius: 2,
                boxShadow: 3,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)", // Slight hover effect
                },
              }}
              onClick={() => handleExerciseClick(exercise.id)} // Handle exercise click
            >
              {/* Exercise GIF */}
              <Box
                component="img"
                src={exercise.gifUrl}
                alt={exercise.name}
                sx={{
                  width: "200px", // Set a fixed width for the GIF
                  height: "200px", // Set a fixed height for the GIF
                  objectFit: "cover", // Maintain aspect ratio of GIF
                  display: "block",
                  mb: 2, // Add margin below the image
                }}
              />
              {/* Exercise Details (Name and Target) */}
              <Box textAlign="center" p={2}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {exercise.name}
                </Typography>
                <Typography variant="body1" sx={{ color: "blue" }}>
                  Target: {exercise.target}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Define prop types for the Exercisepage component
Exercisepage.propTypes = {
  exerciseName: PropTypes.string.isRequired,
};

export default Exercisepage;
