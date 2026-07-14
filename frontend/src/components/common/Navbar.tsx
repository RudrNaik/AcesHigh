// src/components/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import icon from "../../assets/aces_high_logo.svg";

interface NavbarProps {
  isHyperlegible: boolean;
  onToggleFont: () => void;
}

const Navbar = ({ isHyperlegible, onToggleFont }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  /**
   * UseEffect to close the desktop settings panel on outside clicks.
   */
  useEffect(() => {
    if (!settingsOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [settingsOpen]);

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
      <div className="flex items-center justify-between relative w-full">
        <div className="flex items-center">
          <img src={icon} alt="Logo" className="h-20 pl-5 py-2" />

          {/* Normal Navigation Links for desktop, hides when less than md in size. */}
          <ul className="hidden md:flex space-x-6 pl-5 py-8  ">
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
        </div>

        {/* Desktop settings hamburger — appears at md and up. Holds user preferences
            (font now; themes later). Hidden on mobile where the navigation hamburger is used. */}
        <div ref={settingsRef} className="hidden md:flex items-center pr-4">
          <div className="relative">
            <button
              onClick={() => setSettingsOpen((v) => !v)}
              className="border border-cyan-100 p-2 text-cyan-100 transition hover:bg-cyan-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              aria-controls="settings-nav"
              aria-expanded={settingsOpen}
              aria-label="Toggle settings"
            >
              <svg
                className={`${settingsOpen ? "hidden" : "block"} h-4 w-4`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              <svg
                className={`${settingsOpen ? "block" : "hidden"} h-4 w-4`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div
              id="settings-nav"
              className={`absolute right-0 top-full overflow-hidden transition-all duration-300 ${
                settingsOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="px-2 pb-2 space-y-1 bg-black/80 border border-cyan-100 shadow-md text-xs">
                <li>
                  <button
                    type="button"
                    onClick={onToggleFont}
                    className="border border-cyan-100 px-3 py-2 text-xs min-w-50 mt-2 text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
                  >
                    [{isHyperlegible ? "ON" : "OFF"}] Hyperlegible Font
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

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
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300   ${
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
              onClick={() => setHamburgerOpen(false)}
            >
              [↳] Characters
            </Link>
          </li>
          <li>
            <Link
              to="/equipment"
              className="block px-2 py-2 hover:border-cyan-400/90 border-l-4 border-cyan-100/0"
              onClick={() => setHamburgerOpen(false)}
            >
              [↳] Equipment
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                onToggleFont();
                setHamburgerOpen(false);
              }}
              className="block w-full text-left px-2 py-2 hover:border-cyan-400/90 border-l-4 border-cyan-100/0"
            >
              [{isHyperlegible ? "x" : " "}] Hyperlegible Font
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
