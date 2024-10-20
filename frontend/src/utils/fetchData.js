// Define your exercise options for the API request
export const exerciseOptions = {
  method: "GET",
  headers: {
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY, // Use import.meta.env for Vite
  },
};

// Fetch data from the API and handle errors gracefully
export const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);

    // Check if the response is not ok (status code not in the range of 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse JSON from the response
    return data; // Return the data
  } catch (error) {
    console.error("Error fetching data:", error); // Log any errors
    return null; // Return null or handle it accordingly
  }
};
