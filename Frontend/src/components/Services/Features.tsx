"use client";
import { SelectedLang } from "@/stores/lang";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
type Lang = "fr" | "us";

function FF() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
  useEffect(() => {
    SelectedLang.subscribe((n) => {
      setUserLang(n as Lang);
    });
  }, []);

  const features = {
    fr: [
      {
        icon: (
          <svg
            /* Bar Chart Icon */ xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        ),
        title: "Analyse Intelligente 🤖",
        desc: "Exploitez la puissance de l'IA pour des prévisions précises et des opportunités optimisées.",
      },
      {
        icon: (
          <svg
            /* Lock Icon */ xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        ),
        title: "Outils Financiers Avancés 📊",
        desc: "Prenez des décisions stratégiques grâce à des simulations et des analyses détaillées.",
      },
      {
        icon: (
          <svg
            /* Check Icon */ xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        ),
        title: "Opportunités Simplifiées ✅",
        desc: "Un accès direct et fluide aux meilleures opportunités d'investissement.",
      },
      {
        icon: (
          <svg
            /* Shield Check Icon */ xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3l7.5 4.5v6.75c0 3.75-4.5 7.5-7.5 9-3-1.5-7.5-5.25-7.5-9V7.5L12 3z"
            />
          </svg>
        ),
        title: "Sécurité Numérique 🔐",
        desc: "Un environnement sécurisé, 100% digitalisé, pour investir en toute sérénité.",
      },
      {
        icon: (
          <svg
            /* Lightning Icon */ xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L7.5 14.25h6l-1.5 6.75L16.5 9.75h-6l1.5-5.25z"
            />
          </svg>
        ),
        title: "Décisions Rapides ⚡",
        desc: "Prenez des décisions éclairées et efficaces grâce à notre technologie.",
      },
      {
        icon: (
          <svg
            /* User Group Icon */ xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 6.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM2.25 21v-1.5A4.5 4.5 0 016.75 15h10.5a4.5 4.5 0 014.5 4.5V21"
            />
          </svg>
        ),
        title: "Accompagnement Sur Mesure 👥",
        desc: "Un suivi personnalisé à chaque étape de votre investissement.",
      },
    ],
    us: [
      {
        icon: (
          <svg
            /* Bar Chart Icon */ xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="..." />
          </svg>
        ),
        title: "Intelligent Analysis 🤖",
        desc: "Harness the power of AI for accurate forecasts and optimized opportunities.",
      },
      {
        icon: (
          <svg
            /* Lock Icon */ xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="..." />
          </svg>
        ),
        title: "Advanced Financial Tools 📊",
        desc: "Make strategic decisions with detailed simulations and analyses.",
      },
      {
        icon: (
          <svg
            /* Check Icon */ xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="..." />
          </svg>
        ),
        title: "Simplified Access ✅",
        desc: "Get easy access to the best investment opportunities.",
      },
      {
        icon: (
          <svg
            /* Shield Check Icon */ xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="..." />
          </svg>
        ),
        title: "Secure Environment 🔐",
        desc: "A fully digital, secure ecosystem for peace of mind.",
      },
      {
        icon: (
          <svg
            /* Lightning Icon */ xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="..." />
          </svg>
        ),
        title: "Faster Decisions ⚡",
        desc: "Make quick, optimized choices with our smart systems.",
      },
      {
        icon: (
          <svg
            /* User Group Icon */ xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="..." />
          </svg>
        ),
        title: "Tailored Support 👥",
        desc: "Personalized assistance at every step of your investment journey.",
      },
    ],
  };

  return (
    <motion.section
      className="py-14"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="w-full sm:w-2/3 mx-auto my-20 text-gray-600">
        <div className="max-w-7xl space-y-3">
          <motion.p
            className="text-gray-800 text-center text-3xl font-semibold sm:text-4xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {userLang === "fr"
              ? "Pourquoi Choisir TipsInvest"
              : "Why Choose TipsInvest"}
          </motion.p>
        </div>
        <div className="mt-12">
          <ul className="grid grid-cols-1 px-2 md:grid-cols-3 gap-3">
            {features[userLang].map((item, idx) => (
              <div
                key={idx}
                className={`space-y-3 shadow-xl items-center relative overflow-hidden w-full border group bg-white mb-4  h-full  rounded-xl  p-12`}
              >
                <BorderBeam
                  className="group-hover:opacity-100 opacity-30"
                  duration={8}
                  size={100}
                />

                <div className="justify-center flex flex-col w-full items-center">
                  <h4 className="text-xl mb-3 text-gray-800 font-semibold">
                    {item.title}
                  </h4>
                  <p className="text-sm w-full text-center">{item.desc}</p>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}

export default FF;
