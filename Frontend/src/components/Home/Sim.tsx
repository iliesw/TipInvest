import { SelectedLang } from "@/stores/lang";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Lang = 'fr' | 'us';

export default function InvestmentCalculator() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
  useEffect(() => {
    SelectedLang.subscribe((n) => {
      setUserLang(n as Lang);
    });
  }, []);

  const content = {
    fr: {
      title: "Évaluez votre rendement potentiel",
      text: "Que ce soit en construisant un revenu passif grâce à des biens locatifs ou en tirant parti de l'appréciation des propriétés.",
      button: "Savoir plus",
      capital: "Capital à Investir",
      downPayment: "Acompte",
      monthlyPayment: "Paiement Mensuel",
    },
    us: {
      title: "Evaluate your potential return",
      text: "Whether building passive income through rental properties or leveraging property appreciation.",
      button: "Learn more",
      capital: "Capital to Invest",
      downPayment: "Down Payment",
      monthlyPayment: "Monthly Payment",
    },
  };

  const [investment, setInvestment] = useState(20000);
  const downPayment = (investment * 0.2).toFixed(0);
  const monthlyPayment = (investment * 0.012).toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="flex flex-col lg:flex-row bg-white mt-4 p-10 w-full mx-auto border-gray-200 border rounded-[10px_10px_30px_30px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full lg:w-2/3 pr-0 lg:pr-10 flex flex-col justify-between"
      >
        <div>
          <h2 className="text-4xl font-bold text-black">{content[userLang].title}</h2>
          <p className="text-gray-700 mt-4">{content[userLang].text}</p>
        </div>
        <button className="mt-6 w-full lg:w-1/2 rounded-xl bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-700">
          {content[userLang].button}
        </button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full lg:w-1/2 bg-white rounded-xl flex flex-col gap-2 mt-6 lg:mt-0"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium flex items-center justify-between">
            {content[userLang].capital}
            <span className="block text-right text-black font-semibold">€ {investment}</span>
          </label>
          <input
            type="range"
            min="5000"
            max="50000"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full mt-6 appearance-none h-6 bg-gray-200 rounded-full"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-4 flex w-full items-center justify-between"
        >
          <label className="block text-gray-700 font-medium">{content[userLang].downPayment}</label>
          <span className="block text-3xl font-bold text-black">€ {downPayment}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex w-full items-center justify-between"
        >
          <label className="block text-gray-700 font-medium">{content[userLang].monthlyPayment}</label>
          <span className="block text-xl font-semibold text-black">€ {monthlyPayment}</span>
        </motion.div>
      </motion.div>
      <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 48px;
                height: 48px;
                background: rgb(0, 0, 0);
                cursor: pointer;
                border-radius: 50%;
                transform: translateY(-12px);
                box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.2);
                border-width: 24px;
                border-style: solid;
              }
              input[type="range"]::-webkit-slider-runnable-track {
                height: 24px;
                background: rgb(235, 235, 235);
                border-radius: 16px;
              }
            `}</style>
    </motion.div>
  );
}
