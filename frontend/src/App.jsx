import { useState } from "react";
import NavBar from "./components/NavBar";
import HomePage from "./pages/Homepage/HomePage";
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";
import Login from "./pages/Loginpage/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Handle user logout
  const handleLogout = () => {
    setIsAuthenticated(false); // Set to false when the user logs out
    localStorage.removeItem("token"); // Clear the token from local storage
    navigate("/"); // Redirect to homepage after logout
  };

  // Handle user login
  const handleLogin = () => {
    setIsAuthenticated(true); // Update authentication state
    navigate("/userpage"); // Redirect to user page after login
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Login handleLogin={handleLogin} />
      <HomePage />
      <Footer />
    </div>
  );
};

export default App;
