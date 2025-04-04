import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle, Building } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function RealEstateChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your real estate assistant. How can I help with your property questions today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(
        () => chatRef.current?.scrollTo(0, chatRef.current.scrollHeight),
        100
      );
    }
  }, [messages, isOpen]);

  const generateAIResponse = async (prompt: string) => {
    const genAI = new GoogleGenerativeAI("AIzaSyCKQzob4du2lWW_10YelhHfpsM45YthEq0");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `
      You are a specialized real estate AI assistant for TipInvest. Your expertise is in helping clients with real estate problems, investment strategies, property evaluation, and market trends. 
      
      Provide accurate, practical advice on:
      - Property investment strategies
      - Real estate market analysis
      - Property valuation considerations
      - Mortgage and financing options
      - Rental property management
      - Legal considerations in real estate
      - Property renovation and development
      
      Keep responses clear, concise, and focused on real estate topics. When appropriate, suggest using TipInvest's simulators or marketplace to explore options further. Avoid giving specific financial advice that would require a licensed professional.
      
      Maintain a professional but friendly tone, and prioritize practical, actionable information that clients can use in their real estate decisions.
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
    setIsTyping(true);

    try {
      const response = await generateAIResponse(input);
      const botResponse = { text: response, sender: "bot" };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      const errorMessage = { 
        text: "I'm having trouble connecting right now. Please try again later.", 
        sender: "bot" 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
            <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <Building className="mr-2" size={18} />
                <span className="font-semibold">Real Estate Assistant</span>
              </div>
              <X 
                className="cursor-pointer hover:bg-blue-700 rounded p-1" 
                onClick={() => setIsOpen(false)} 
              />
            </div>
            <div 
              ref={chatRef} 
              className="p-4 h-64 md:h-80 lg:h-96 overflow-y-auto space-y-3 bg-gray-50"
            >
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg text-sm max-w-[85%] ${
                    msg.sender === "user"
                      ? "bg-blue-100 ml-auto"
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-gray-200 p-3 rounded-lg text-sm max-w-[85%] shadow-sm"
                >
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </motion.div>
              )}
            </div>
            <div className="p-3 border-t flex items-center bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask about real estate..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isTyping}
              />
              <button
                className={`ml-2 p-2 rounded-lg ${isTyping ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                onClick={handleSend}
                disabled={isTyping}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg mt-2 hover:bg-blue-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat assistant"
      >
        <MessageCircle />
      </motion.button>
    </div>
  );
}