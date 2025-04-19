
import Proof from "@/components/Home/Proof";
// import Hero from "@/components/Home/Hero";
import Cta from "@/components/Home/CTA";
import Brands from "@/components/Home/Brands";
import Faq from "@/components/Home/Faq";
import Features from "@/components/Home/Features";
import { Footer } from "@/components/Home/Footer";
import Stats from "@/components/Home/Stats";
import ChatbotPopup from "@/components/Home/Chatbot";
// import Intro from "@/components/Home/Intro";
import Bento from "@/components/Home/Bento";
import Navbar from "@/components/Home/Navbar";
import { Metadata } from 'next';
import Prices from "@/components/Pricing/Prices";
import BannerFour from "@/components/Home/BannerFour";
 
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
      <BannerFour />
      {/* <div className="w-full relative h-[70vh] flex items-center overflow-hidden bg-gray-50">
        <div className="absolute top-0 right-0 w-3/5 h-full bg-gray-200 rounded-l-[100px] skew-x-[15deg] overflow-hidden translate-x-32">
          <img src="/assets/images/houses/5.jpg" alt="Dream Home" className="w-full h-full object-cover -skew-x-[15deg] -translate-x-16 scale-110" />
        </div>

        <div className="absolute w-3/5 h-auto left-0 bg-white rounded-tr-[100px] rounded-br-[60px] border skew-x-[-20deg] -translate-x-24 z-10 shadow-xl flex items-center my-auto top-0 bottom-0" style={{ maxHeight: '40vh' }}>
          <div className="skew-x-[15deg] pl-72 pr-16 py-10 w-full">
            <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">FINTECH FUSION</p>
            <h1 className="text-5xl font-bold text-gray-800 mb-1 leading-tight">Invest today in</h1>
            <h1 className="text-5xl font-bold mb-6">You <span className="text-orange-500">Dream Home</span></h1>
          </div>
        </div>

         <div className="absolute top-10 left-1/4 w-20 h-10 flex space-x-1 -translate-x-1/2 z-20 opacity-80">
            <div className="w-4 h-full bg-orange-400 skew-x-[-20deg] animate-bounce delay-100"></div>
            <div className="w-4 h-full bg-orange-500 skew-x-[-20deg] animate-bounce delay-200"></div>
            <div className="w-4 h-full bg-orange-600 skew-x-[-20deg] animate-bounce delay-300"></div>
         </div>
         <div className="absolute bottom-10 left-1/4 w-20 h-10 flex space-x-1 -translate-x-1/2 z-0 opacity-80">
            <div className="w-4 h-full bg-orange-400 skew-x-[-20deg] animate-bounce delay-100"></div>
            <div className="w-4 h-full bg-orange-500 skew-x-[-20deg] animate-bounce delay-200"></div>
            <div className="w-4 h-full bg-orange-600 skew-x-[-20deg] animate-bounce delay-300"></div>
         </div>
      </div> */}
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
    </Layout>
  );
}
