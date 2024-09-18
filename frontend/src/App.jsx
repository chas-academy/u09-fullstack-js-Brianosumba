import HomePage from "./pages/Homepage/HomePage";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HomePage />
      <Footer />
    </div>
  );
};

export default App;
