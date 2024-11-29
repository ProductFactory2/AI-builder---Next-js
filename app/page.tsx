"use client";
import React from "react";
import Header from "@/components/landing-page/Header";
import Hero from "@/components/landing-page/Hero";
import Digital from "@/components/landing-page/Digital";
import Features from "@/components/landing-page/Features";
import Grid from "@/components/landing-page/Grid";
import FourElement from "@/components/landing-page/FourElement";
import Footer from "@/components/landing-page/Footer";
import "@/components/landing-page/App.css";

const page = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Digital />
      <Features />
      <Grid />
      <FourElement />
      <Footer />
    </div>
  );
};

export default page;
