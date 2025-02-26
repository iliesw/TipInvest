import Proof from "@/components/Home/Proof";
import "../../public/assets/css/fonts.css";
import "../../public/assets/css/globals.css";
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

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <Intro />
      <Features />
      <Bento />
      <Brands />
      <Stats />
      <ChatbotPopup />
      <Proof />
      <Faq />
      <Cta />
      <Footer />
    </div>
  );
}
