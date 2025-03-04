import { DoorOpen, PencilRuler, Sparkles } from "lucide-react";
import { SelectedLang } from "@/stores/lang";
import { useEffect, useState } from "react";

const pricingData = {
  fr: {
    title: "Investissez avec confiance, maximisez vos rendements",
    description:
      "Chez TipInvest, nous mettons la puissance des données et de l'IA entre vos mains pour vous aider à prendre des décisions d'investissement intelligentes et rentables. Que vous soyez un investisseur indépendant, un trader actif ou une institution financière, nous avons l'offre parfaite pour vous.",
    plans: [
      {
        name: "Essentiel",
        icon: DoorOpen,
        price: "$29",
        period: "/month",
        description:
          "Parfait pour les investisseurs qui veulent des outils fiables sans complexité.",
        features: [
          "Analyse en temps réel des tendances du marché",
          "Accès aux données financières clés",
          "Tableau de bord intuitif pour suivre vos investissements",
          "Support standard par email",
          "Mises à jour gratuites",
        ],
      },
      {
        name: "Avancé ",
        price: "$149",
        icon: PencilRuler,
        period: "/month",
        description:
          "Pour les investisseurs expérimentés cherchant à affiner leur stratégie.",
        features: [
          "Toutes les fonctionnalités de l'offre Essentiel",
          "Prédictions IA pour anticiper les tendances",
          "Rapports avancés et tableaux de bord interactifs",
          "Alertes personnalisées pour ne jamais rater une opportunité",
          "Support prioritaire",
        ],
      },
      {
        name: "Élite",
        icon: Sparkles,
        price: "$599",
        period: "/month",
        description:
          "Pensé pour les fonds d’investissement, institutions et traders experts.",
        features: [
          "Tout ce qui est inclus dans Avancé",
          "Stratégies d'investissement sur-mesure propulsées par l’IA",
          "Accès à des données exclusives et analyses approfondies",
          "Intégration directe avec vos outils de trading",
          "Gestionnaire de compte dédié",
        ],
      },
    ],
  },
  us: {
    title: "Invest with confidence, maximize your returns",
    description:
      "At TipInvest, we put the power of data and AI in your hands to help you make smart and profitable investment decisions. Whether you are an independent investor, an active trader, or a financial institution, we have the perfect offer for you.",
    plans: [
      {
        name: "Essential",
        icon: DoorOpen,
        price: "$29",
        period: "/month",
        description:
          "Perfect for investors who want reliable tools without complexity.",
        features: [
          "Real-time market trend analysis",
          "Access to key financial data",
          "Intuitive dashboard to track your investments",
          "Standard email support",
          "Free updates",
        ],
      },
      {
        name: "Advanced",
        price: "$149",
        icon: PencilRuler,
        period: "/month",
        description:
          "For experienced investors looking to refine their strategy.",
        features: [
          "All features of the Essential offer",
          "AI predictions to anticipate trends",
          "Advanced reports and interactive dashboards",
          "Personalized alerts to never miss an opportunity",
          "Priority support",
        ],
      },
      {
        name: "Elite",
        icon: Sparkles,
        price: "$599",
        period: "/month",
        description:
          "Designed for investment funds, institutions, and expert traders.",
        features: [
          "Everything included in Advanced",
          "Custom AI-powered investment strategies",
          "Access to exclusive data and in-depth analyses",
          "Direct integration with your trading tools",
          "Dedicated account manager",
        ],
      },
    ],
  },
};
type Lang = 'fr' | 'us';

export default function Prices() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
            useEffect(() => {
              SelectedLang.subscribe((n) => {
                setUserLang(n as Lang);
              });
            }, []);

  return (
    <section className="py-16">
      <div className="px-4 mx-auto max-w-screen-xl">
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
            <div
              key={index}
              className={`relative flex flex-col justify-between p-8 bg-white rounded-3xl border border-gray-200 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                plan.name === "Élite" || plan.name === "Elite"
                  ? "border-black"
                  : ""
              }`}
            >
              {(plan.name === "Élite" || plan.name === "Elite") && (
                <span className="absolute top-4 right-4 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div>
                <plan.icon />
                <h3 className="mb-4 mt-4 text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  {plan.description}
                </p>
                <div className="flex justify-center items-baseline my-6">
                  <span className="text-5xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                <ul className="mb-6 space-y-3 text-left">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-gray-700 text-sm"
                    >
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="#"
                className="text-white bg-gray-900 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all"
              >
                Commencer
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}