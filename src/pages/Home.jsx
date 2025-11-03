import React from "react";
import Hero from "../components/sections/Hero/Hero";
import MenuPreview from "../components/sections/MenuPreview/MenuPreview";
import About from "../components/sections/About/About";
import Testimonials from "../components/sections/Testimonials/Testimonials";
import KulanSpecials from "../components/sections/KulanSpecials/KulanSpecials"; // Add this import

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
