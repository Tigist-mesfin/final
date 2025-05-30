import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for menu toggle

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-sky-800 shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
                <Link 
  className="text-1xl  text-Hex3 border-2 border-Hex3 px-3   inline-block text-center leading-tight"
>
  Ambo<br />construction
</Link>

          {/* Mobile Menu Toggle Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex space-x-4">
            <Link to="/" className="text-white hover:text-Hex3 px-3 py-2 rounded-md font-medium">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-Hex3 px-3 py-2 rounded-md font-medium">
              About Us
            </Link>
            <Link to="/contact" className="text-white hover:text-Hex3 px-3 py-2 rounded-md font-medium">
              Contacts
            </Link>
            <Link to="/login" className="bg-Hex3 text-black w-32 text-center mx-14 py-2 rounded-md font-medium hover:bg-Hex4 ">
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div className="fixed inset-0  z-40" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-16 w-60 right-4  bg-white shadow-md p-4   rounded-md z-50">
          <Link to="/" className="block text-gray-700 hover:text-blue-600 py-2"onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/about" className="block text-gray-700 hover:text-blue-600 py-2"onClick={() => setIsOpen(false)}>
            About Us
          </Link>
          <Link to="/contact" className="block text-gray-700 hover:text-blue-600 py-2"onClick={() => setIsOpen(false)}>
            Contacts
          </Link>
          <Link to="/login" className="block text-black font-bold  py-2 "onClick={() => setIsOpen(false)}>
            Login
          </Link>
        </div>
        
      )}
      
    </nav>
  );
};

export default NavBar;
