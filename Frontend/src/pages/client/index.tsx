import LayoutC from "./layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, SquareTerminal, Store, LifeBuoy } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import "../../../public/assets/css/fonts.css";
import "../../../public/assets/css/globals.css";
export default function ClientView() {
  const [userName, setUserName] = useState("Client");

  useEffect(() => {
    // Fetch user data when component mounts
    const token = localStorage.getItem("TOKENAUTH");
    if (token) {
      fetch("http://localhost:3001/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.name) {
            setUserName(data.name.split(" ")[0]); // Get first name only
          }
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }
  }, []);

  const features = [
    {
      title: "Property Simulator",
      description:
        "Analyze potential investments and calculate ROI with our advanced simulator",
      icon: <SquareTerminal className="h-5 w-5" />,
      link: "/client/simulator",
      color: "white",
    },
    {
      title: "Marketplace",
      description:
        "Browse exclusive property listings and investment opportunities",
      icon: <Store className="h-5 w-5" />,
      link: "/client/market",
      color: "white",
    },
    {
      title: "Support",
      description:
        "Get help from our expert team for any questions or concerns",
      icon: <LifeBuoy className="h-5 w-5" />,
      link: "#",
      color: "white",
    },
  ];

  return (
    <LayoutC>
      <motion.div 
        className="w-full space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Banner */}
        <motion.div 
          className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 p-8 text-white shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
            <p className="mt-2 max-w-2xl text-blue-50">
              Discover new investment opportunities and manage your real estate
              portfolio with TipInvest&apos;s powerful tools.
            </p>
            <Button className="mt-4 bg-white text-blue-600 hover:bg-blue-50">
              Explore Opportunities
            </Button>
          </motion.div>
          <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-blue-400 opacity-50"></div>
          <div className="absolute -top-4 -right-16 h-40 w-40 rounded-full bg-cyan-300 opacity-30"></div>
        </motion.div>

        {/* Feature Guide Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.h2 
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >Get Started</motion.h2>
          <motion.p 
            className="text-gray-500 mt-0 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Follow these steps to make the most of your TipInvest experience
          </motion.p>

          <motion.div 
            className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <Card
                  className={`overflow-hidden transition-all p-6 pb-4 hover:shadow-md ${feature.color}`}
                >
                  <CardHeader className="pb-2 flex flex-col justify-between">
                    <div className="mb-2 text-black">{feature.icon}</div>
                  </CardHeader>
                  <div className="flex justify-end flex-col mt-5">
                    <CardTitle className="text-2xl  font-[Milk]">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-[14px] text-nowrap text-ellipsis overflow-hidden">{feature.description}</CardDescription>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.h2 
            className="text-2xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >Recent Market Updates</motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center gap-4 rounded-lg"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <div className="rounded-full bg-blue-100 p-2">
                      <Home className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">New Properties Available</h3>
                      <p className="text-sm text-gray-500">
                        15 new properties added to the marketplace this week
                      </p>
                    </div>
                    <Button variant="outline" className="ml-auto">
                      View
                    </Button>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-4 rounded-lg"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <div className="rounded-full bg-green-100 p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Market Trends Report</h3>
                      <p className="text-sm text-gray-500">
                        Latest analysis of real estate market trends now available
                      </p>
                    </div>
                    <Button variant="outline" className="ml-auto">
                      Download
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </LayoutC>
  );
}
