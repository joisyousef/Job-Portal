import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Joblisting from "../components/JobListing";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Joblisting />
      <Footer />
    </div>
  );
};

export default Home;
