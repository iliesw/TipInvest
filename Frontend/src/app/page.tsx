"use client";
import Proof from "@/components/Home/Proof";
// import Hero from "@/components/Home/Hero";
import Cta from "@/components/Home/CTA";
import Brands from "@/components/Home/Brands";
import Faq from "@/components/Home/Faq";
import Features from "@/components/Home/Features";
import Stats from "@/components/Home/Stats";
// import Intro from "@/components/Home/Intro";
import Bento from "@/components/Home/Bento";
import Prices from "@/components/Pricing/Prices";
import BannerFour from "@/components/Home/BannerFour";
import Navbar from "@/components/Home/Navbar";
import { Footer } from "@/components/Home/Footer";
import ChatbotPopup from "@/components/Home/Chatbot";

import FeaturedProperties from "@/components/Home/FeaturedProperties";
import ImageShowcase from "@/components/Home/ImageShowcase";
import { Vid } from "@/components/Home/Vid";


export default function Home() {
  return (
    <div className="bg-[#fcfcfc]">
        <ChatbotPopup />
        <Navbar />
      <BannerFour />
      {/* <Hero /> */}
      {/* <Intro /> */}
      <Bento  />
      <FeaturedProperties />
      <Stats />
      <ImageShowcase />
      <Proof />
      <Vid />
      <Features />
      <Prices />
      <Brands />
      <Faq />
      <Cta />
                <Footer />
      
    </div>
  );
}
