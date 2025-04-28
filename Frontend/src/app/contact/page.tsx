import ContactInfo from "@/components/Contact/ContactInfo";
import Navbar from "@/components/Home/Navbar";
import { Footer } from "@/components/Home/Footer";
import ChatbotPopup from "@/components/Home/Chatbot";
export default function Contact() {
  return (
    <div>
      <ChatbotPopup />
      <Navbar />
      <ContactInfo />
      <Footer />
    </div>
  );
}