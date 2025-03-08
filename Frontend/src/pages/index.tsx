import "../../public/assets/css/fonts.css";
import "./../globals.css";
import Proof from "@/components/Home/Proof";
import Hero from "@/components/Home/Hero";
import Cta from "@/components/Home/CTA";
import Brands from "@/components/Home/Brands";
import Faq from "@/components/Home/Faq";
import Features from "@/components/Home/Features";
import { Footer } from "@/components/Home/Footer";
import Stats from "@/components/Home/Stats";
// import Sim from "@/components/Home/Sim";
import ChatbotPopup from "@/components/Home/Chatbot";
import Intro from "@/components/Home/Intro";
import Bento from "@/components/Home/Bento";
import Navbar from "@/components/Home/Navbar";

import { Metadata } from 'next';
import Prices from "@/components/Pricing/Prices";
 
export const metadata: Metadata = {
  title: 'TipInvest',
  description: 'Invest wisely with TipInvest',
  
};


export default function Home() {
  return (
    <div className="bg-[#fcfcfc]">
      <ChatbotPopup />
      <Navbar />
      <Hero />
      <Intro />
      <Features />
      <Bento  />
      <Stats />
      <Proof />
      <Prices />
      <Brands />
      <Faq />
      <Cta />
      <Footer />
    </div>
  );
}
