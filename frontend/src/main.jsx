import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import UserPage from "./pages/Userpage/UserPage";

// Define the router with your routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // This will render your App component
  },
  {
    path: "/userpage",
    element: <UserPage />,
  },
]);

// Ensure you call .render() correctly on the root element
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
