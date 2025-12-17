import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdSpa } from "react-icons/md";

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-800 px-5 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center text-white font-bold text-lg"
        >
          <span
            aria-hidden
            className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 mr-2"
          >
            <MdSpa size={18} />
          </span>
          <span></span>
        </Link>

        {/* Toggle button (for mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white lg:hidden focus:outline-none"
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Nav links area (you can add links here later) */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } w-full lg:w-auto lg:flex lg:items-center`}
          id="navbarNav"
        >
          {/* Example links — you can add your own */}
          {/* 
          <ul className="flex flex-col lg:flex-row gap-3 lg:gap-6 mt-3 lg:mt-0 text-white">
            <li><Link to="/about" className="hover:text-green-300">About</Link></li>
            <li><Link to="/contact" className="hover:text-green-300">Contact</Link></li>
          </ul>
          */}
        </div>
      </div>
    </nav>
  );
}
