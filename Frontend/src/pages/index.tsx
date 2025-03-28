
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
// import Add from "@/components/Shared/Add";
 
export const metadata: Metadata = {
  title: 'TipInvest',
  description: 'Invest wisely with TipInvest',
  
};

import Layout from '../components/layout';


export default function Home() {
  return (
    <Layout>
    <div className="bg-[#fcfcfc]">
      <ChatbotPopup />
      {/* <Add /> */}
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
    </Layout>
  );
}
