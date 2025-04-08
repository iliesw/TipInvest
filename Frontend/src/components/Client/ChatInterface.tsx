import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your real estate assistant. How can I help with your property questions today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateAIResponse = async (prompt: string) => {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyCKQzob4du2lWW_10YelhHfpsM45YthEq0"
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
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

      Format your responses using Markdown for better readability.
      `,
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Get AI response
      const response = await generateAIResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false); // Ensure typing indicator is always hidden after response
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  // Auto-resize textarea as user types
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-md  overflow-hidden">

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex mb-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] items-end ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full shrink-0 ${
                    message.sender === "user"
                      ? "ml-2 bg-blue-100"
                      : "mr-2 bg-green-100"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User size={16} className="text-blue-600" />
                  ) : (
                    <Bot size={16} className="text-green-600" />
                  )}
                </div>
                <div
                  className={`relative group p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-100 text-blue-900"
                      : "bg-white border shadow-sm"
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    {message.sender === "bot" ? (
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    ) : (
                      <p>{message.text}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="relative h-fit border-t">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about real estate..."
            className="w-full p-5 overflow-hidden focus:outline-none m-0 resize-none h-full"
            rows={1}
            disabled={typing}
          />
          <button
            onClick={handleSend}
            disabled={typing || !input.trim()}
            className={`absolute right-3 bottom-1/2 translate-y-1/2 p-1.5 rounded-md ${
                typing || !input.trim()
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Send size={20} />
          </button>
      </div>
    </div>
  );
}
