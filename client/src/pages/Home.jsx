import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Joblisting from "../components/JobListing";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Joblisting />
    </div>
  );
};

export default Home;
