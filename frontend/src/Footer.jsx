import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-sky-950 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3  gap-8">
        
        {/* Company Info */}
        <div>
          
                          <h2 
            className="text-1xl  text-Hex3 border-2 border-Hex3 px-3   inline-block text-center leading-tight"
          >
            Ambo<br />construction
          </h2>
        
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-semibold">Contact Us</h3>
          <p className="mt-2 flex items-center"><FaMapMarkerAlt className="mr-2" /> Ambo, Oromia, Ethiopia</p>
          <p className="mt-2 flex items-center"><FaPhone className="mr-2" /> +251 975432323</p>
          <p className="mt-2 flex items-center"><FaEnvelope className="mr-2" /> amboconstruction264@gmail.com</p>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <div className="flex mt-2 space-x-4">
            <a href="#" className="text-gray-400 hover:text-white"><FaFacebook size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FaTwitter size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin size={24} /></a>
          </div>
        </div>
        
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 mt-6 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} AMBO.CTM - All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
