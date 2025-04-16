
import Proof from "@/components/Home/Proof";
import Hero from "@/components/Home/Hero";
import Cta from "@/components/Home/CTA";
import Brands from "@/components/Home/Brands";
import Faq from "@/components/Home/Faq";
import Features from "@/components/Home/Features";
import { Footer } from "@/components/Home/Footer";
import Stats from "@/components/Home/Stats";
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

import Layout from '../components/layout';
import FeaturedProperties from "@/components/Home/FeaturedProperties";
import ImageShowcase from "@/components/Home/ImageShowcase";
import { Vid } from "@/components/Home/Vid";


export default function Home() {
  return (
    <Layout>
    <div className="bg-[#fcfcfc]">
      <ChatbotPopup />
      <Navbar />
      <Hero />
      <Intro />
      {/* <div className="relative h-0">

      <div className="bg-gradient-to-b absolute mt-3 from-[#008e2650] to-transparent w-full rounded-bl-lg  h-[100vh]"></div>
      </div> */}
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
    </Layout>
  );
}
