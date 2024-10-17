import NavBar from "../../components/NavBar";
import SearchField from "../../components/SearchField";
import HeroBannerCarousel from "../../components/HeroBannerCarousel";
import ExerciseCardList from "../../components/ExerciseCardList";
import Footer from "../../components/Footer";
import useAuthStore from "../Store/store";

const UserPage = () => {
  // Access Zustand store state
  const { isAuthenticated, logout } = useAuthStore();
  return (
    <>
      <div className="bg-gray-300 min-h-screen">
        <NavBar isAuthenticated={isAuthenticated} logout={logout} />
        <HeroBannerCarousel />
        <SearchField />
        <ExerciseCardList />
        <Footer />
      </div>
    </>
  );
};

export default UserPage;
