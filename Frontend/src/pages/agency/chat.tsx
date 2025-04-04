import { useEffect } from "react";
import LayoutC from "./layout";
import ChatInterface from "@/components/Client/ChatInterface";
import { motion } from "framer-motion";

export default function ChatPage() {
  // Set page title
  useEffect(() => {
    document.title = "Real Estate Assistant - TipInvest";
  }, []);

  return (
    <LayoutC>
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

        <ChatInterface />
      </motion.div>
    </LayoutC>
  );
}