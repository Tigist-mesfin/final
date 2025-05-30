import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import img from "./assets/mission.png";
import img1 from "./assets/vision.png";
import AOS from "aos";
import "aos/dist/aos.css"; 

const AboutUs = () => {

  useEffect(() => {
    AOS.init({
        duration: 1000,
        once: false, 
    });
  }, []);

  return (
    <div className=" mb-8 mt-24 px-4 sm:px-6 lg:px-8  ">
      {/* Box Container */}
      <div className="bg-white shadow-lg rounded-lg lg:mx-12 p-6 sm:p-8 border border-gray-200">
        <h3 className="text-2xl font-bold font-serif text-center text-black mb-4">About Us</h3>

        <p className="text-gray-700 text-left   text-sm sm:text-lg mb-12">
          Ambo Construction is a leading construction company dedicated to delivering high-quality, sustainable, 
          and innovative building solutions. With over 20 years of experience in the industry, we specialize in 
          residential, commercial, and industrial projects, ensuring excellence at every stage of construction.At
           Ambo Construction, we specialize exclusively in building private villas that reflect elegance, comfort,
            and individuality. As a trusted name in residential construction, we take pride in turning your vision 
            of a perfect home into a tangible, lasting reality.Our commitment is to deliver not just buildings, but 
            homes that inspire pride, provide lasting value, and enhance your quality of life.
        </p>
        <h4 className="text-lg text-center font-bold text-gray-800 ">Our Values</h4>

<div className="bg-white  p-6  mx-auto max-w-3xl mb-14">
  <ul className="list-disc list-inside text-gray-700 text-left space-y-2 text-sm sm:text-base sm:ml-36">
    <li><span className="font-semibold">Quality:</span> We never compromise on the quality of our work.</li>
    <li><span className="font-semibold">Integrity:</span> We operate with honesty and transparency.</li>
    <li><span className="font-semibold">Sustainability:</span> We are committed to eco-friendly practices.</li>
    <li><span className="font-semibold">Innovation:</span> We embrace new technologies and methods.</li>
    <li><span className="font-semibold">Client-Centric:</span> Your satisfaction is our top priority.</li>
  </ul>
</div>

        
        

        {/* Flexbox container for Vision and Mission */}
        <div  className="flex flex-col sm:flex-row sm:space-x-8 mb-8">
          {/* Our Vision Box */}
          <div className="flex-1 mb-8 sm:mb-0 border bg-gradient-to-r hover:shadow-Hex1 bg-clip-text text-transparent p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 duration-300">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 font-serif">Our Vision</h2>
            <img
              src={img1}
              alt="Our Vision"
              className="w-16 h-auto mb-2 mt-4 mx-auto"
              data-aos="zoom-in"
            />
            <p className="text-base  text-gray-600 leading-relaxed">
            We envision becoming Ethiopia's most trusted name in private residential construction by consistently
             delivering exceptional villas tailored to individual tastes and standards. Through innovation, integrity, 
             and skilled execution, we strive to shape communities where every home is a landmark.</p>
             
          </div>
       
          {/* Stay with Us Box */}
          <div className="flex-1 border bg-gradient-to-r bg-clip-text text-transparent  hover:shadow-Hex1 p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 duration-300">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 font-serif">Our Mission</h2>
            <img
              src={img}
              alt="Stay with Us"
              className="w-16 h-auto mb-2 mt-4 mx-auto"
              data-aos="zoom-in"
            />
            <p className="text-base  text-gray-600 leading-relaxed">
            Our mission is to build timeless, high-quality private villas that offer comfort, privacy, 
            and sophistication. We focus on understanding each client's unique lifestyle and vision, ensuring
             every detail — from layout to finishing — aligns with their expectations. At Ambo Construction,
              your home is more than a project — it's a partnership built on trust and excellence. </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
