import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RootLayout = () => {
  return (
    <div id="root" className="flex flex-col lg:gap-12.5 md:gap-10 min-h-screen">
      <Navbar />

      <main className="flex-1 lg:pt-46 pt-16 md:pt-26">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
export default RootLayout;
