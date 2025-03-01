import "../../public/assets/css/fonts.css";
import "../../public/assets/css/globals.css";
import Navbar from "@/components/Home/Navbar";
import { Footer } from "@/components/Home/Footer";
import ContactInfo from "@/components/Contact/ContactInfo";

export default function Contact() {
  return (
    <div>
      <Navbar />
      <ContactInfo />
      <Footer />
    </div>
  );
}
