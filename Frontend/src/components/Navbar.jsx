import { useEffect, useRef, useState } from "react";
import Logo from "../assets/Logo-small.svg";
import { FaChevronDown, FaRegUserCircle, FaShoppingCart } from "react-icons/fa";
import { NavLink, useLocation } from "react-router";
import { useSelector } from "react-redux";
import Dropdown from "./Dropdown";
import useAuth from "@/hooks/useAuth";
const Navbar = () => {// vitest
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const navRef = useRef(null);

  const { totalQuantity } = useSelector((state) => state.shoppingCart);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const handleNavClick = (callback) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (callback) callback();
  };

  return (
    <header
      className={`fixed bg-white transition-all duration-300 top-0 left-0 w-full z-50  flex flex-col items-center font-cinzel outline outline-[#1E5BCC] ${isScrolled ? "p-2.5 text-base" : "p-3.5 lg:pt-6.25 lg:pb-2.5 text-[18px]"}`}
      ref={navRef}
      role="banner"
    >
      <nav
        className="w-full max-w-300 flex justify-between items-center"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div>
          <NavLink to="/" onClick={() => handleNavClick(closeAll)}>
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
          <ul
            className="flex gap-2.5 text-[16px] xl:text-[18px] xl:gap-4"
            role="menubar"
          >
            <li className="relative">
              <button
                onClick={() => setIsProductsOpen((prev) => !prev)}
                className="flex items-center gap-1 hover:text-gray-600"
                aria-haspopup="true"
                aria-expanded={isProductsOpen}
                aria-label="Visa produktmeny"
              >
                <span>Produkter</span>
                <span>
                  <FaChevronDown
                    className={`transition-transform ${isProductsOpen ? "rotate-180" : ""}`}
                  />
                </span>
              </button>

              {isProductsOpen && (
                <ul
                  className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded shadow-lg z-10 flex flex-col items-center"
                  role="menu"
                  aria-label="Produktkategorier"
                >
                  <NavLink
                    to="produkt_ris"
                    onClick={() => handleNavClick(closeAll)}
                    role="menuitem"
                  >
                    <li className="px-11 py-2 hover:bg-gray-100 cursor-pointer">
                      Ris
                    </li>
                  </NavLink>
                  <NavLink
                    to="produkt_olivolja"
                    onClick={() => handleNavClick(closeAll)}
                    role="menuitem"
                  >
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Olivolja
                    </li>
                  </NavLink>
                </ul>
              )}
            </li>
            <li role="none">
              <NavLink
                to="om-oss"
                onClick={() => handleNavClick(closeAll)}
                role="menuitem"
              >
                Om oss
              </NavLink>
            </li>
            <li role="none">
              <NavLink
                to="kontakta-oss"
                onClick={() => handleNavClick(closeAll)}
                role="menuitem"
              >
                Kontakta oss
              </NavLink>
            </li>
            <li role="none">
              <a
                href="https://mahmoodrice.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleNavClick(closeAll)}
                role="menuitem"
              >
                Till mahmoodrice.com
              </a>
            </li>

            {isAuthenticated ? (
              <>
                {/* Varukorg */}
                <li role="none">
                  {totalQuantity > 0 && (
                    <div className="relative">
                      <span className="z-10 w-4 h-4 absolute left-3.5 -bottom-2 rounded-full flex items-center justify-center pointer-events-none bg-[#D12323] text-xs text-white">
                        {totalQuantity}
                      </span>
                    </div>
                  )}
                  {/* render Dropdown based on kassa status */}
                  {!isCheckout ? (
                    <Dropdown aria-label="Visa varukorg">
                      <FaShoppingCart className="text-2xl cursor-pointer" />
                    </Dropdown>
                  ) : (
                    // On kassa, show a static cart icon (no dropdown)
                    <FaShoppingCart
                      className="text-2xl"
                      aria-label="Varukorg"
                    />
                  )}
                </li>
                {/* Auth */}
                <li role="none">
                  <NavLink
                    to="/konto"
                    onClick={() => handleNavClick(closeAll)}
                    role="menuitem"
                    aria-label="Konto"
                  >
                    <FaRegUserCircle className="text-2xl" />
                  </NavLink>
                </li>
              </>
            ) : (
              <li role="none">
                <NavLink
                  to="auth/logga-in"
                  onClick={() => handleNavClick(closeAll)}
                  role="menuitem"
                >
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
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label="Meny"
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
                      onClick={() => handleNavClick(closeAll)}
                    />
                  </Dropdown>
                ) : (
                  <FaShoppingCart className="text-2xl" />
                )}
              </li>
              <li>
                <NavLink to="/konto" onClick={() => handleNavClick(closeAll)}>
                  <FaRegUserCircle className="text-2xl" />
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <NavLink
                to="auth/logga-in"
                onClick={() => handleNavClick(closeAll)}
              >
                Logga in
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden w-full max-w-300 mt-4">
          <ul
            className="flex flex-col gap-4 items-center"
            id="mobile-menu"
            role="menu"
            aria-label="Mobil navigationsmeny"
          >
            <li className="flex gap-3.5 items-center relative" role="none">
              <button
                onClick={() => setIsProductsOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={isProductsOpen}
                aria-label="Visa produktmeny"
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
                <ul
                  className="absolute top-full left-1 mt-2 bg-white border border-gray-200 rounded shadow-lg z-10 flex flex-col items-center"
                  role="menu"
                  aria-label="Produktkategorier"
                >
                  <li
                    role="none"
                    className="px-11 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <NavLink
                      to="produkt_ris"
                      role="menuitem"
                      onClick={() => handleNavClick(closeAll)}
                    >
                      Ris
                    </NavLink>
                  </li>
                  <li
                    role="none"
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <NavLink
                      to="produkt_olivolja"
                      role="menuitem"
                      onClick={() => handleNavClick(closeAll)}
                    >
                      Olivolja
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li role="none">
              <NavLink
                to="om-oss"
                onClick={() => handleNavClick(closeAll)}
                role="menuitem"
              >
                Om oss
              </NavLink>
            </li>
            <li role="none">
              <NavLink
                to="kontakta-oss"
                onClick={() => handleNavClick(closeAll)}
                role="menuitem"
              >
                Kontakta oss
              </NavLink>
            </li>
            <li role="none">
              <a
                href="https://mahmoodrice.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleNavClick(closeAll)}
                role="menuitem"
              >
                Till mahmoodrice.com
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
export default Navbar;
