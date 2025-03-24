import { SelectedLang } from "@/stores/lang";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Lang = "fr" | "us";

export default function Cta() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
  
  useEffect(() => {
    SelectedLang.subscribe((n) => {
      setUserLang(n as Lang);
    });
  }, []);

  const content = {
    fr: {
      title: "Rejoignez Tips Invest dès aujourd hui !",
      text: "Rejoignez Tips Invest et accédez aux meilleurs outils pour optimiser vos investissements immobiliers.",
      button: "Créer un compte gratuitement",
    },
    us: {
      title: "Join Tips Invest today!",
      text: "Join Tips Invest and access the best tools to optimize your real estate investments.",
      button: "Create a free account",
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="w-full flex justify-center mx-auto p-3 sm:p-0"
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-lime-50 w-full lg:w-2/3 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between"
      >
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 md:mb-0 md:mr-6 text-center md:text-left"
        >
          <h1 className="text-xl md:text-2xl font-bold" style={{ fontFamily: "Figtree" }}>
            {content[userLang].title}
          </h1>
          <p className="mt-2">{content[userLang].text}</p>
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full md:w-auto rounded-xl bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        >
          {content[userLang].button}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
