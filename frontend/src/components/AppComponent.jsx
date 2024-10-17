import NavBar from "./NavBar";
import HomePage from "../pages/Homepage/HomePage";
import Footer from "./Footer";

const AppComponent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <HomePage />
      <Footer />
    </div>
  );
};

export default AppComponent;
