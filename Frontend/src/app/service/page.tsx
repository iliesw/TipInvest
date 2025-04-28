import { ServiceOne } from "@/components/Services/ServiceOne";
import ServiceTwo from "@/components/Services/ServiceTwo";
import ServiceThree from "@/components/Services/ServiceThree";
import ServiceFoor from "@/components/Services/ServiceFoor";
import ServiceFive from "@/components/Services/ServiceFive";
import Cta from "@/components/Home/CTA";
import Navbar from "@/components/Home/Navbar";
import { Footer } from "@/components/Home/Footer";
import ChatbotPopup from "@/components/Home/Chatbot";
export default function Service() {
  return (
    <>
      <ChatbotPopup />
      <Navbar />
      <ServiceOne />
      <ServiceTwo />
      <ServiceThree />
      <ServiceFoor />
      <ServiceFive />
      <Cta />
      <Footer />
    </>
  );
}
