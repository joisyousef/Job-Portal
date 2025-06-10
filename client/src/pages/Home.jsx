import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Joblisting from "../components/JobListing";
import AppDownload from "../components/AppDownload";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <Hero />
      <Joblisting />
      <AppDownload />
      <Footer />
      <button onClick={() => navigate("/create-resume")}>
        Add commentMore actions Create Resume
      </button>
    </div>
  );
};

export default Home;
