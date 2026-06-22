// src/components/Navbar.jsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import icon from "../../assets/aces_high_logo.svg";

const Navbar = ({}) => {
  const [scrolled, setScrolled] = useState(false);
  const [, setDropdownOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const dropdownRef: any = useRef(false);

  /**
   * UseEffect to handle clicking outside of the dropdown's box while on mobile.
   */
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * UseEffect to handle the navbar becoming transparent when scrolling down.
   */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 text-white
        ${scrolled ? "bg-black/80 shadow-md border-b border-cyan-100" : "bg-black/20 shadow-md"}
      `}
    >
      <div className="flex items-center relative w-full font-mono">
        <img src={icon} alt="Logo" className="h-20 pl-5 py-2" />

        {/* Normal Navigation Links for desktop, hides when less than md in size. */}
        <ul className="hidden md:flex space-x-6 pl-5 py-8 font-mono">
          <li>
            <Link
              to="/"
              className="border border-cyan-100 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
            >
              [↳] Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="border border-cyan-100 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
            >
              [↳] About
            </Link>
          </li>
          <li>
            <Link
              to="/charactermanager"
              className="border border-cyan-100 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
            >
              [↳] Characters
            </Link>
          </li>
          <li>
            <Link
              to="/equipment"
              className="border border-cyan-100 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
            >
              [↳] Equipment
            </Link>
          </li>
        </ul>

        {/*Hamburger... only appears when smaller than Md*/}
        <button
          onClick={() => setHamburgerOpen((v) => !v)}
          className="md:hidden absolute right-16 top-1/2 -translate-y-1/2 p-2 rounded-sm hover:bg-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
          aria-controls="mobile-nav"
          aria-expanded={hamburgerOpen}
          aria-label="Toggle navigation"
        >
          {/* icon swap */}
          <svg
            className={`${hamburgerOpen ? "hidden" : "block"} h-6 w-6`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          <svg
            className={`${hamburgerOpen ? "block" : "hidden"} h-6 w-6`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 font-mono ${
          hamburgerOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="px-3 pb-3 space-y-1 bg-black/60 border-t border-white/10">
          <li>
            <Link
              to="/"
              className="block px-2 py-2 hover:border-cyan-400/90 border-l-4 border-cyan-100/0"
              onClick={() => setHamburgerOpen(false)}
            >
              [↳] Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="block px-2 py-2 hover:border-cyan-400/90 border-l-4 border-cyan-100/0"
              onClick={() => setHamburgerOpen(false)}
            >
              [↳] About
            </Link>
          </li>
          <li>
            <Link
              to="/charactermanager"
              className="block px-2 py-2 hover:border-cyan-400/90 border-l-4 border-cyan-100/0"
            >
              [↳] Characters
            </Link>
          </li>
          <li>
            <Link
              to="/equipment"
              className="block px-2 py-2 hover:border-cyan-400/90 border-l-4 border-cyan-100/0"
            >
              [↳] Equipment
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
