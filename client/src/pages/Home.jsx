import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Joblisting from "../components/JobListing";
import Footer from "../components/Footer";
import AppDownload from "../components/AppDownload";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Joblisting />
      <AppDownload />
      <Footer />
    </div>
  );
};

export default Home;
