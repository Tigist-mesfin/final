
import React from 'react';
import { Star } from "lucide-react";
import { Link } from 'react-router-dom';
import imag1 from "./assets/ctm.webp";
import imag3 from "./assets/image.png";
import villaImg from './assets/OIP.png';
import villaImg1 from './assets/house2.jpeg';
import house5Img from './assets/house5.jpg';
import hillsideImg from './assets/house5.jpg';
import gardenHouseImg from './assets/house12.jpg';
import executiveVillaImg from './assets/house5.jpg';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

import { InfiniteMovingCards } from './components/InfiniteMovingCards';

const testimonials = [
  {
    quote:
      "Ambo Construction delivered our project ahead of schedule with outstanding quality. Their team maintained clear communication throughout the entire process. We highly recommend them for any commercial construction work.",
    name: "Tihitina Yohanness",
    title: "Operations Manager, GreenField Logistics",
   
  },
  {
    quote:
      "From design to completion, Ambo Construction provided top-notch service. The site was managed professionally, and the end result was exactly what we envisioned. Reliable and professional.",
    name: "Tigist Mesfin",
    title: "CEO, Sunrise Tech Hub",
  },
  {
    quote:
      "The team at Ambo Construction exceeded our expectations. Their workmanship, transparency, and safety standards were impressive. Our residential complex is now a benchmark in the area.",
    name: "Tsion Bisrat ",
    title: "Managing Director, Harmony Living Ltd",
  },
 
  {
    quote:
      "As a homeowner, I was nervous about building from scratch, but Ambo Construction made the process smooth and stress-free. I’m now living in my dream home, thanks to their amazing team.",
    name: "Meron Debebe",
    title: "Private Client, Addis Ababa",
  },
];

const completedProjects = [
 
    {
      id: 1,
      title: "Luxury Villa",
      description: "A custom-designed luxury villa with a spacious garden.",
      image: villaImg,
    },
    {
      id: 2,
      title: "Modern Family Home",
      description: "A contemporary 4-bedroom house designed for comfort and functionality.",
      image: house5Img,
    },
    
    {
      id: 3,
      title: "Garden Courtyard House",
      description: "A charming one-story home centered around a private courtyard and garden.",
      image: gardenHouseImg,
    },
    {
      id: 4,
      title: "Luxury Villa",
      description: "A custom-designed luxury villa with a  spacious garden.",
      image: villaImg1,
    },
   
  ];
  

const Hero = () => {

  useEffect(() => {
    AOS.init({
        duration: 1000, // Animation duration (in ms)
        once: false, 
    });
}, []);

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-start"
        style={{
          backgroundImage: `url(${imag1})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 text-left text-white px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Building Dream Homes,<br />One Residential House at a Time
          </h1>
          <p className="text-xl mb-6 max-w-xl">
            We specialize in crafting high-quality residential homes that meet the unique needs of families and individuals. Our expertise ensures that every house we build is not only a structure but a place to call home.
          </p>

          {/* Buttons */}
          <div className="flex space-x-6">
            <Link
              to="/contact"
              className="bg-Hex5 text-black px-6 py-3 border-2 border-Hex44 text-sm sm:text-lg font-semibold hover:bg-Hex5 tracking-widest sm:uppercase transform hover:scale-105 transition duration-200 rounded-full"
            >
              Contact Us
            </Link>
            <a
              href="#completed-projects"
              className="bg-transparent border-2 border-white text-white px-5 py-3 rounded-md text-lg font-semibold hover:bg-Hex2 hover:text-black transition duration-300"
            >
              Our Achievements
            </a>
          </div>
        </div>
      </div>

      {/* Services We Offer Section */}
      <section  id="services" className="pt-8 bg-white w-full mt-0 sm:mt-6">
      <div className="container mx-auto px-6">
        <h2   className="text-3xl font-bold text-center text-gray-800 mt-3  sm:mb-12 font-serif"> Services   </h2>
        
        
        {/* Row 1 */}
        <div   className=" grid   lg:grid-cols-1 items-center gap-4  mb-4">
          <div  className="flex-1">
            
            <p className="text-black sm:pl-12 text-xl text-center ml-7 mr-7 mb-16  sm:pr-5">
            Our company offers a complete range of construction services dedicated exclusively to private 
            residential homes. We provide full-service solutions including custom home design, new home construction, 
            home extensions, renovations, and remodeling. From laying strong foundations to delivering fine interior 
            finishes, we manage every step with skilled craftsmanship and premium materials. Our services also include
             site preparation, architectural planning support, project management, and quality inspections to ensure 
             every home meets the highest standards. Whether building a new house from scratch or upgrading an existing 
             one, we are committed to turning every homeowner's vision into a lasting reality.
            </p>
          </div>
          
        
    
        {/* Row 2 */}
        <div   className="flex flex-col ml-32 mr-32 lg:flex-row-reverse items-center gap-6 mb-20">
          <div  className="flex-1  hidden md:block ">
          <img
              src={imag3}
              alt="Service 2"
              className=" w-full max-w-md mx-auto h-auto object-cover rounded sm:mb-12"
            />
          </div>
         
        </div>
        </div>
        {/* Row 3 */}
      
      
    
    
    
    
        
      </div>
    </section>
    
    
      {/* Why Choose Us Section */}
      <div className="bg-gray-100 py-16 mb-14">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-2xl font-bold text-gray-800 text-center mb-14">
      Why Choose Us?
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      {[
        { title: "Experience & Expertise", description: "Years of experience in the construction industry." },
        { title: "Quality Assurance", description: "Commitment to high-quality standards and materials." },
        { title: "On-Time Project Delivery", description: "Reliable and efficient work with timely completion." },
        { title: "Customer Satisfaction", description: "Proven track record of happy clients." },
      ].map((reason, index) => (
        <div
          key={index}
          className="group bg-white p-12 rounded-3xl border border-gray-200 shadow-sm  hover:shadow-2xl hover:-translate-y-2 transform transition duration-300"
        >
          <div className="mb-4">
            <div className="w-14 h-14 bg-white border border-black text-black rounded-full flex items-center justify-center text-2xl font-bold group-hover:bg-black group-hover:text-white transition duration-300">
            <Star size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-Hex5 mb-3 group-hover:text-sky-800 transition">
            {reason.title}
          </h3>
          <p className="text-gray-500">{reason.description}</p>
        </div>
      ))}
    </div>
  </div>
</div>

{/* Testimony */}
<div>
  <h2 className='text-3xl font-bold text-gray-800 text-center mb-14'>Testimony</h2>
<div className="h-[30rem] rounded-md flex flex-col antialiased bg-Hex1  dark:bg-dark dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
    </div>






      {/* Completed Projects Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16" id="completed-projects">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
      Completed Projects
    </h2>
    <div className="grid grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-2 md:gap-16">
      {completedProjects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-[1.02] hover:shadow-xl transition duration-300"
        >
          <div className="relative group">
            <img
              src={project.image}
              alt={project.title}
              className=" w-full h-96 object-cover transition duration-300 group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-sky-800 mb-2">
              {project.title}
            </h3>
            <p className="text-Hex44">{project.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

    </div>
  );
};

export default Hero;
