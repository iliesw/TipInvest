import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Bonjour ! Comment puis-je vous aider ?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(
        () => chatRef.current?.scrollTo(0, chatRef.current.scrollHeight),
        100
      );
    }
  }, [messages, isOpen]);

  const Ai = async (prompt: string) => {
    const genAI = new GoogleGenerativeAI("AIzaSyCKQzob4du2lWW_10YelhHfpsM45YthEq0");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `
      You are the AI assistant for TipInvest, an investment platform that helps users discover and evaluate investment opportunities. Your goal is to provide accurate, relevant, and professional responses while maintaining a friendly tone. You can answer questions about TipInvest’s services, assist with navigation, provide insights on investment strategies without giving financial advice, and help troubleshoot technical issues. Keep responses clear and concise, avoid financial recommendations, and direct users to support when needed. Encourage engagement by suggesting actions within the platform.

      `,
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response (Replace this with Gemini AI response)
    setTimeout(async () => {
      const response = await Ai(input);
      const botResponse = { text: response, sender: "bot" };
      setMessages((prev) => [...prev, botResponse]);
    }, 0);
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end w-[80vw] max-w-md md:max-w-lg lg:max-w-xl z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="bg-lime-600 text-white px-4 py-3 flex justify-between items-center">
              <span className="font-semibold">AI Assistant</span>
              <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
            <div ref={chatRef} className="p-4 h-64 md:h-80 lg:h-96 overflow-y-auto space-y-3">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-lime-100 self-end"
                      : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
            </div>
            <div className="p-3 border-t flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
                placeholder="Écrivez un message..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="ml-2 bg-lime-600 text-white p-2 rounded-lg hover:bg-lime-700"
                onClick={handleSend}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="bg-lime-600 text-white p-4 rounded-full shadow-lg mt-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle />
      </motion.button>
    </div>
  );
}
