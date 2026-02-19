import { useEffect, useRef, useState } from "react";
import Logo from "../assets/Logo-small.svg";
import { FaChevronDown, FaRegUserCircle, FaShoppingCart } from "react-icons/fa";
import { NavLink, useLocation } from "react-router";
import { useSelector } from "react-redux";
import Dropdown from "./Dropdown";
import useAuth from "@/hooks/useAuth";
const Navbar = () => {
  // Fixa så att när man klickar på länk den börjar i starten av sidan sedan semantik osv sedan vitest

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const { totalQuantity } = useSelector((state) => state.shoppingCart);

  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);

  const location = useLocation(); // Get current location
  const isCheckout = location.pathname.includes("kassa"); // Check if on kassa page
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMenuOpen(false);
        setIsProductsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsProductsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsProductsOpen(false);
  };

  return (
    <nav
      className={`fixed bg-white transition-all duration-300 top-0 left-0 w-full z-50  flex flex-col items-center font-cinzel outline outline-[#1E5BCC] ${isScrolled ? "p-2.5 text-base" : "p-3.5 lg:pt-6.25 lg:pb-2.5 text-[18px]"}`}
      ref={navRef}
    >
      <main className="w-full max-w-300 flex justify-between items-center">
        <div>
          <NavLink to="/" onClick={closeAll}>
            <img
              src={Logo}
              alt="Asaad Food logo"
              width="80"
              height="80"
              loading="eager"
              fetchPriority="high"
              className={`transition-all duration-300 ${isScrolled ? "w-28.5 h-auto lg:w-auto lg:h-15" : "w-28.5 h-auto lg:w-auto lg:h-20 p-1"} `}
            />
          </NavLink>
        </div>
        {/* Desktop Nav */}
        <div className="hidden lg:flex lg:relative">
          <ul className="flex gap-2.5 text-[16px] xl:text-[18px] xl:gap-4">
            <li className="relative">
              <button
                onClick={() => setIsProductsOpen((prev) => !prev)}
                className="flex items-center gap-1 hover:text-gray-600"
              >
                <span>Produkter</span>
                <span>
                  <FaChevronDown
                    className={`transition-transform ${isProductsOpen ? "rotate-180" : ""}`}
                  />
                </span>
              </button>

              {isProductsOpen && (
                <ul className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded shadow-lg z-10 flex flex-col items-center">
                  <NavLink to="produkt_ris" onClick={closeAll}>
                    <li className="px-11 py-2 hover:bg-gray-100 cursor-pointer">
                      Ris
                    </li>
                  </NavLink>
                  <NavLink to="produkt_olivolja" onClick={closeAll}>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Olivolja
                    </li>
                  </NavLink>
                </ul>
              )}
            </li>
            <li>
              <NavLink to="om-oss" onClick={closeAll}>
                Om oss
              </NavLink>
            </li>
            <li>
              <NavLink to="kontakta-oss" onClick={closeAll}>
                Kontakta oss
              </NavLink>
            </li>
            <li>
              <a
                href="https://mahmoodrice.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeAll}
              >
                Till mahmoodrice.com
              </a>
            </li>
            {isAuthenticated ? (
              <>
                {/* Varukorg */}
                <li>
                  {totalQuantity > 0 && (
                    <div className="relative">
                      <div className="z-10 w-4 h-4 absolute left-3.5 -bottom-2 rounded-full flex items-center justify-center pointer-events-none bg-[#D12323] text-xs text-white">
                        {totalQuantity}
                      </div>
                    </div>
                  )}
                  {/* render Dropdown based on kassa status */}
                  {!isCheckout ? (
                    <Dropdown>
                      <FaShoppingCart className="text-2xl cursor-pointer" />
                    </Dropdown>
                  ) : (
                    // On kassa, show a static cart icon (no dropdown)
                    <FaShoppingCart className="text-2xl" />
                  )}
                </li>
                {/* Auth */}
                <li>
                  <NavLink to="/konto" onClick={closeAll}>
                    <FaRegUserCircle className="text-2xl" />
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <NavLink to="auth/logga-in" onClick={closeAll}>
                  Logga in
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex gap-1 outline outline-[#1E5BCC] rounded-full p-1 cursor-pointer"
          >
            <span className="text-[16px]">Meny</span>
            {/* Hamburger icon */}
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block w-5 h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? "rotate-45 translate-y-0.5" : "-translate-y-1"}`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-black transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-0.5" : "translate-y-1"}`}
              ></span>
            </div>
          </button>
        </div>
        <ul className="flex gap-3 lg:hidden text-[16px]">
          {isAuthenticated ? (
            <>
              <li>
                {totalQuantity > 0 && (
                  <div className="relative">
                    <div className="z-10 w-4 h-4 absolute left-3.5 -bottom-2 rounded-full flex items-center justify-center pointer-events-none bg-[#D12323] text-xs text-white">
                      {totalQuantity}
                    </div>
                  </div>
                )}
                {!isCheckout ? (
                  <Dropdown>
                    <FaShoppingCart
                      className="text-2xl cursor-pointer"
                      onClick={closeAll}
                    />
                  </Dropdown>
                ) : (
                  <FaShoppingCart className="text-2xl" />
                )}
              </li>
              <li>
                <NavLink to="/konto" onClick={closeAll}>
                  <FaRegUserCircle className="text-2xl" />
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="auth/logga-in" onClick={closeAll}>
                Logga in
              </NavLink>
            </li>
          )}
        </ul>
      </main>
      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden w-full max-w-300 mt-4">
          <ul className="flex flex-col gap-4 items-center">
            <li className="flex gap-3.5 items-center relative">
              <button
                onClick={() => setIsProductsOpen((prev) => !prev)}
                className="flex gap-3.5 items-center cursor-pointer"
              >
                <span>Produkter</span>
                <span>
                  <FaChevronDown
                    className={`transition-transform ${isProductsOpen ? "rotate-180" : ""}`}
                  />
                </span>
              </button>
              {isProductsOpen && (
                <ul className="absolute top-full left-1 mt-2 bg-white border border-gray-200 rounded shadow-lg z-10 flex flex-col items-center">
                  <li className="px-11 py-2 hover:bg-gray-100 cursor-pointer">
                    <NavLink to="produkt_ris" onClick={closeAll}>
                      Ris
                    </NavLink>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <NavLink to="produkt_olivolja" onClick={closeAll}>
                      Olivolja
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <NavLink to="om-oss" onClick={closeAll}>
                Om oss
              </NavLink>
            </li>
            <li>
              <NavLink to="kontakta-oss" onClick={closeAll}>
                Kontakta oss
              </NavLink>
            </li>
            <li>
              <a
                href="https://mahmoodrice.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeAll}
              >
                Till mahmoodrice.com
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
