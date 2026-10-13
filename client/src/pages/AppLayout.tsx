import { Outlet } from "react-router-dom";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartSitebar from "../components/CartSitebar";

const AppLayout = () => {
  return (
    <>
      <Banner />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartSitebar />
    </>
  );
};

export default AppLayout;
