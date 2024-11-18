import React from "react";
import Banner from "./Homes/Banner";
import Contact from "./Homes/Contact";
import Features from "./Homes/Features ";

import FooterBottom from "./Homes/FooterBottom";
import Navbar from "./Homes/NavBar";
import Projects from "./Homes/Projects";
import Resume from "./Homes/Resume";
import Testimonial from "./Homes/Testimonial";

function Kumar() {
  return (
    <div className="w-full h-auto bg-bodyColor text-lightText px-4">
      <Navbar />
      <div className="max-w-screen-xl mx-auto">
        <Banner />
        <Features />
        <Projects />
        <Resume />
        <Testimonial />
        <Contact />

        <FooterBottom />
      </div>
    </div>
  );
}

export default Kumar;
