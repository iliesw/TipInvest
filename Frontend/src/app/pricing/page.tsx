import Prices from "@/components/Pricing/Prices";
import Brands from "@/components/Home/Brands";
import Detail from "@/components/Pricing/Detail";
import Navbar from "@/components/Home/Navbar";
import { Footer } from "@/components/Home/Footer";
import ChatbotPopup from "@/components/Home/Chatbot";
export default function Pricing() {
    return(<>
     <ChatbotPopup />
     <Navbar />
     <Prices />
     <Brands />
     <Detail />
     <Footer />
    </>)
}