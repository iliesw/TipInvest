import { SelectedLang } from "@/stores/lang";
import { AtomIcon, LandPlot, Video } from "lucide-react";
import { useState, useEffect } from "react";

type Lang = "fr" | "us";

const Content = {
  fr: {
    small: "Investissement intelligent",
    title: "Accès à une plateforme complète pour les investisseurs",
    description:
      "TipInvest offre une assistance à distance avec des experts immobiliers, des études d’optimisation des espaces pour maximiser la valorisation des biens, ainsi qu’une IA avancée incluant un chatbot pour guider les investisseurs et un audit financier personnalisé pour une prise de décision éclairée.",
    cards: [
      {
        icon: AtomIcon,
        title: "IA avancée",
        description:
          "Notre intelligence artificielle assiste les investisseurs dans leur processus d'achat ou de gestion, en leur fournissant des informations précises et personnalisées pour une prise de décision éclairée.",
        color:
          "url(https://framerusercontent.com/images/kMPEhuTqhi7S9YE77jC3f1aA88.png)",
      },
      {
        icon: LandPlot,
        title: "Audit financier",
        description:
          "Notre audit financier personnalisé analyse les coûts et les revenus de vos biens pour vous fournir des recommandations précises et personnalisées pour optimiser votre investissement.",
        color:
          "url(https://framerusercontent.com/images/6YQHAZiHiMUrSUFa60g5IoNjo.png)",
      },
      {
        icon: Video,
        title: "Consultation à distance",
        description:
          "Notre équipe d'experts immobiliers est disponible pour vous accompagner dans votre processus d'investissement, en vous fournissant des conseils et une assistance personnalisés.",
        color:
          "url(https://framerusercontent.com/images/wonFLcFVLOxIhMOPNRtr4i84jfA.png)",
      },
    ],
  },
  us: {
    small: "Smart investment",
    title: "Access to a comprehensive platform for investors",
    description:
      "TipInvest provides remote assistance with real estate experts, space optimization studies to maximize property value, and advanced AI, including a chatbot to guide investors and a personalized financial audit for informed decision-making.",
    cards: [
      {
        icon: AtomIcon,
        title: "AI Powered",
        description:
          "Our artificial intelligence helps investors in their buying or managing process by providing them with accurate and personalized information for an informed decision.",
        color: "#fff00020",
      },
      {
        icon: LandPlot,
        title: "Financial Audit",
        description:
          "Our customized financial audit analyzes the costs and revenues of your properties to provide you with precise and personalized recommendations to optimize your investment.",
        color: "#fff00020",
      },
      {
        icon: Video,
        title: "Remote Consultation",
        description:
          "Our team of real estate experts is available to accompany you in your investment process, providing you with customized advice and assistance.",
        color: "#fff00020",
      },
    ],
  },
};

export function ServiceOne() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
  useEffect(() => {
    SelectedLang.subscribe((n) => {
      setUserLang(n as Lang);
    });
  }, []);

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1)% 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden bg-white py-24 sm:py-16">
      <div className="mx-auto w-full sm:w-2/3 p-8 lg:p-12 xl:p-20">
        <div className="mx-auto flex max-w-2xl lg:max-w-screen-lg lg:mx-0">
          <div className="lg:pr-8 lg:pt-4 w-full">
            <div className="lg:max-w-lg">
              <h2 className="font-semibold text-white bg-lime-400 text-sm w-fit rounded-full px-4 py-1 mb-5">
                {Content[userLang].small}
              </h2>
              <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl xl:text-6xl mb-8">
                {Content[userLang].title}
              </p>
              <p className="mt-6 leading text-sm lg:leading-snug xl:leading-loose">
                {Content[userLang].description}
              </p>
            </div>
          </div>
          <div className="w-full h-full aspect-square bg-black rounded-xl shadow-xl hidden sm:block"></div>
        </div>
        <div className="mt-32 flex gap-2">
          {Content[userLang].cards.map((card, index) => (
            <div
              key={index}
              className={`flex flex-col text-white h-[380px] justify-between px-5 py-4 rounded-xl border relative overflow-hidden transition-all duration-500 ${index === currentStep ? "w-full" : "hidden md:flex lg:w-1/2 xl:w-1/3"}`}
            >
              <div
                className="w-full h-full absolute top-0 left-0 z-0 opacity-60"
                style={{ background: card.color, backgroundSize: "cover",backgroundRepeat:"no-repeat" }}
              ></div>
              <div
                className="w-full h-full absolute top-0 left-0 z-1 opacity-50"
                style={{
                  background: "linear-gradient(0deg,#000,#fff)",
                  backgroundSize: "cover",
                }}
              ></div>

              <card.icon className="z-1 relative" size={28}></card.icon>
              <p className="relative z-1 text font-bold transition-all duration-300" style={{
                opacity: index === currentStep ? "100%" : "30%",
                fontSize: index === currentStep ? "18px" : "10px",
              }}>{card.description}</p>
              <h3 className="mt-2 text-white relative z-1 text-lg font-bold">
                {card.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServiceOne;