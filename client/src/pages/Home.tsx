import AppPromoBanner from "../components/home/AppPromoBanner";
import Feature from "../components/home/Feature";
import Hero from "../components/home/Hero";
import HomeCategories from "../components/home/HomeCategories";
import Newsletter from "../components/home/Newsletter";
import PopularCategories from "../components/home/PopularCategories";

const Home = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Hero />
      <Feature />
      <HomeCategories />
      <PopularCategories />
      <AppPromoBanner />
      <Newsletter />
    </div>
  );
};

export default Home;
