import { ServiceOne } from "@/components/Services/ServiceOne";
// import ServiceTwo from "@/components/Services/ServiceTwo";
// import ServiceThree from "@/components/Services/ServiceThree";
// import ServiceFoor from "@/components/Services/ServiceFoor";
import Cta from "@/components/Home/CTA";
import Navbar from "@/components/Home/Navbar";
import { Footer } from "@/components/Home/Footer";
import ChatbotPopup from "@/components/Home/Chatbot";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import Features from "@/components/Services/Features";
import Who from "@/components/Services/Who";
import { ServiceTwo } from "@/components/Services/ServiceTwo";
export default function Service() {
  return (
    <>
    <ScrollProgress className="z-[999] fixed w-full top-0 left-0 h-[5px]" />
      <ChatbotPopup />
      <Navbar />
      <ServiceOne />
      <Features />
      {/* <ServiceTwo /> */}
      {/* <ServiceThree /> */}
      {/* <ServiceFoor /> */}
      <ServiceTwo />
      <Who />
      <Cta />
      <Footer />
    </>
  );
}
