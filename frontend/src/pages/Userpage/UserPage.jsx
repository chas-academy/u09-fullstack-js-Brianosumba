import NavBar from "../../components/NavBar";
import SearchField from "../../components/SearchField";
import HeroBannerCarousel from "../../components/HeroBannerCarousel";
import ExerciseCardList from "../../components/ExerciseCardList";
import Footer from "../../components/Footer";

const UserPage = () => {
  return (
    <>
      <div className="bg-white min-h-screen">
        <NavBar />
        <HeroBannerCarousel />
        <SearchField />
        <ExerciseCardList />
        <Footer />
      </div>
    </>
  );
};

export default UserPage;
