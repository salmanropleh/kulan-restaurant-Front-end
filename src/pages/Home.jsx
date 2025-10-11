import React from "react";
import Hero from "../components/sections/Hero";
import MenuPreview from "../components/sections/MenuPreview";
import About from "../components/sections/About";
import Testimonials from "../components/sections/Testimonials";
import KulanSpecials from "../components/sections/KulanSpecials"; // Add this import

const Home = () => {
  return (
    <div>
      <Hero />
      <MenuPreview />
      <KulanSpecials /> {/* Add this line */}
      <About />
      <Testimonials />
    </div>
  );
};

export default Home;
