import { Outlet } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
// import Providers from "@/components/Providers"
import { checkAuth } from "@/store/auth/authSlice"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"


const RootLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    // <Providers>
      <div id="root" className="flex flex-col lg:gap-12.5 md:gap-10 min-h-screen">
        <Navbar />
        
        <main className="flex-1 lg:pt-46 pt-16 md:pt-26">
          <Outlet />
        </main>

        <Footer />
      </div>
    // </Providers>
  )
}
export default RootLayout