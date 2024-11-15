import React from "react";
import Banner from "./Home/Banner";
import Contact from "./Home/Contact";
import Features from "./Home/Features ";

import FooterBottom from "./Home/FooterBottom";
import Navbar from "./Home/NavBar";
import Projects from "./Home/Projects";
import Resume from "./Home/Resume";
import Testimonial from "./Home/Testimonial";

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
