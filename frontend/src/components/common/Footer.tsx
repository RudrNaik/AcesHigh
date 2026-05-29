import { Link } from "react-router-dom";
import icon from "../../assets/aces_high_logo_wordmark.svg"


const Footer = () => {
    return (
        <footer className="relative z-10 scroll-anchor-none bg-black text-cyan-100 py-4 font-mono">
            <div className="max-w-screen mx-auto text-center">

                {/* Logo */}
                <img
                    src={icon}
                    alt="Aces High Logo"
                    className="mx-auto mb-6"
                    style={{ height: "200px" }}
                />

                {/* Navigation Links */}
                <div className="flex flex-wrap justify-center gap-4 mb-6 uppercase text-sm">
                    <Link to="/" className="hover:underline">MAIN MENU</Link>
                    <a href="https://docs.google.com/document/d/1NH2TJWfAlQ5-e2CO07gO1Ws8VHIUYpnsuSKNOeARu60" className="hover:underline" target="_blank" rel="noopener noreferrer">Rulebook</a>
                    <Link to="/about" className="hover:underline">ABOUT</Link>
                </div>

                {/* Legal Fluff Text */}
                <p className="text-xs text-gray-300 px-4 leading-relaxed">
                    © 2026 Aces High TTRPG. All rights reserved. Dates and content subject to change via balancing.
                    <br />
                    ACES HIGH, the ACES HIGH logo, are among the trademarks of respective parties 
                    <br />
                    Website developed by Spiny (AKA Spingus, Spinach)
                </p>
            </div>
        </footer>
    );
};

export default Footer;
