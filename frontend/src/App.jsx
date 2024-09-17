import React from "react";
import HomePage from "./pages/Homepage/HomePage";
import Footer from "./components/Footer"; // Import Footer component

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HomePage />
      <Footer />
    </div>
  );
};

export default App;
