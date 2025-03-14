import { DoorOpen, PencilRuler, Sparkles } from "lucide-react";
import { SelectedLang } from "@/stores/lang";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const pricingData = {
  fr: {
    title: "Investissez avec confiance, maximisez vos rendements",
    description:
      "Chez TipInvest, nous mettons la puissance des données et de l'IA entre vos mains pour vous aider à prendre des décisions d'investissement intelligentes et rentables.",
    plans: [
      {
        name: "Essentiel",
        icon: DoorOpen,
        price: "$29",
        period: "/mois",
        description: "Parfait pour les investisseurs qui veulent des outils fiables sans complexité.",
        features: [
          "Analyse en temps réel des tendances du marché",
          "Accès aux données financières clés",
          "Tableau de bord intuitif pour suivre vos investissements",
        ],
      },
      {
        name: "Avancé",
        icon: PencilRuler,
        price: "$149",
        period: "/mois",
        description: "Pour les investisseurs expérimentés cherchant à affiner leur stratégie.",
        features: [
          "Toutes les fonctionnalités de l'offre Essentiel",
          "Prédictions IA pour anticiper les tendances",
          "Rapports avancés et tableaux de bord interactifs",
        ],
      },
      {
        name: "Élite",
        icon: Sparkles,
        price: "$599",
        period: "/mois",
        description: "Pensé pour les fonds d’investissement, institutions et traders experts.",
        features: [
          "Tout ce qui est inclus dans Avancé",
          "Stratégies d'investissement sur-mesure propulsées par l’IA",
          "Accès à des données exclusives et analyses approfondies",
        ],
      },
    ],
  },
};

type Lang = 'fr';

export default function Prices() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
  useEffect(() => {
    SelectedLang.subscribe((n) => {
      setUserLang(n as Lang);
    });
  }, []);

  return (
    <section className="py-16">
      <motion.div 
        className="px-4 mx-auto max-w-screen-xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-screen-lg text-center mb-12">
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900">
            {pricingData[userLang].title}
          </h2>
          <p className="text-lg text-gray-600">
            {pricingData[userLang].description}
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {pricingData[userLang].plans.map((plan, index) => (
            <motion.div
              key={index}
              className="relative flex flex-col justify-between p-8 bg-white rounded-3xl border border-gray-200 shadow-md"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <plan.icon size={32} className="text-gray-700" />
              <h3 className="mb-4 mt-4 text-2xl font-bold text-gray-900">
                {plan.name}
              </h3>
              <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
              <div className="flex justify-center items-baseline my-6">
                <span className="text-5xl font-extrabold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
              </div>
              <ul className="mb-6 space-y-3 text-left">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700 text-sm">
                    ✔ {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="text-white bg-gray-900 hover:bg-gray-700 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all"
              >
                Commencer
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
