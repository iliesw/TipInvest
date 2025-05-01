"use client";
import { SelectedLang } from "@/stores/lang";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import FeaturedPropertiesPlain from "../Home/FeaturedPropertiesPlain";
type Lang = "fr" | "us";

const Content = {
  fr: [
    {
      title: "Accès aux Meilleures Opportunités Immobilières",
      subtitle: "🤖 Tirez parti de l’IA pour investir intelligemment",
      description:
        "Notre marketplace centralise des opportunités triées sur le volet : résidentiel, commercial, locatif. Grâce à un moteur de recherche avancé et un système de matching intelligent, trouvez les biens les plus rentables, adaptés à vos préférences et à votre budget. Accédez également à un marché international incluant la Tunisie, le Moyen-Orient, et des offres off-market exclusives.",
        image: "/assets/images/display/imageM.png",

    },
    {
      title: "Sécurisation et Digitalisation des Transactions",
      subtitle: "🔒 Blockchain, contrats intelligents et accompagnement juridique",
      description:
        "TipsInvest garantit des transactions sécurisées via la blockchain et des smart contracts. Profitez d’un accompagnement fiscal et juridique pour des démarches simplifiées. Les paiements sont digitalisés (crypto, virement, financement) et des prêts adaptés à votre projet sont disponibles via nos partenaires.",
      image: "/assets/images/display/imageM.png",

    },
    {
      title: "Une Expérience Immobilière Immersive et Interactive",
      subtitle: "🕶 Visitez, simulez, projetez-vous avant d'investir",
      description:
        "Découvrez des visites virtuelles en 3D et en réalité augmentée. Explorez les biens comme si vous y étiez, modifiez l’aménagement à votre goût. Utilisez nos simulateurs pour évaluer la rentabilité, estimer les coûts cachés, et prendre des décisions d’investissement basées sur des données précises.",
      image: "/assets/images/display/imageM.png",

    },
    {
      title: "Gestion Intelligente et Optimisation du Patrimoine Immobilier",
      subtitle: "📈 Maximisez vos revenus et simplifiez la gestion locative",
      description:
        "Avec un tableau de bord personnalisé, suivez la valeur de vos biens, vos loyers et recevez des alertes stratégiques. Automatisez la gestion locative (mise en location, loyers, maintenance) et bénéficiez de conseils pour optimiser votre fiscalité et diversifier votre patrimoine.",
      image: "/assets/images/display/imageM.png",

    },
  ],
  us: [
    {
      title: "Access to the Best Real Estate Opportunities",
      subtitle: "🤖 Leverage AI to invest smartly",
      description:
        "Our marketplace curates investment opportunities in residential, commercial, and rental properties with strong profitability potential. Use our advanced search engine and AI matching system to find the best properties based on your preferences. Get exclusive access to off-market deals in Tunisia, the Middle East, and beyond.",
      image: "opportunites-immobilieres.svg",
    },
    {
      title: "Secured and Digitized Transactions",
      subtitle: "🔒 Blockchain, smart contracts, and legal support",
      description:
        "TipsInvest ensures secure transactions using blockchain and smart contracts. Legal and fiscal experts guide you through a smooth process. Digital payment options and access to tailored real estate loans are available through our financial partners.",
      image: "transactions-securisees.svg",
    },
    {
      title: "Immersive and Interactive Real Estate Experience",
      subtitle: "🕶 Visit virtually and simulate investments in real time",
      description:
        "Take immersive 3D virtual tours and use augmented reality to visualize changes. Simulate returns, hidden costs, and profitability before investing, ensuring data-driven decisions and better outcomes.",
      image: "experience-immersive.svg",
    },
    {
      title: "Smart Management and Real Estate Optimization",
      subtitle: "📈 Maximize income and automate property operations",
      description:
        "Use a personalized dashboard to track asset value, rental income, and returns. Automate rental tasks (listing, tenants, payments) and get recommendations for resale or tax optimization, powered by strategic analytics.",
      image: "gestion-patrimoine.svg",
    },
  ],
};



export function ServiceTwo() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
  useEffect(() => {
    SelectedLang.subscribe((n) => {
      setUserLang(n as Lang);
    });
  }, []);



  return (
    <div className="w-full flex flex-col sm:w-2/3 mx-auto gap-10 px-2 md:px-0">
      <div className="flex items-center rounded-3xl flex-col py-16 md:py-32 relative overflow-hidden my-8 px-4 md:px-16">
      <h1 className="text-3xl sm:text-5xl md:text-7xl mb-4 relative text-center">La Marketplace Immobilière Réinventée</h1>
      <p className="text-center w-full sm:w-2/3 relative text-sm md:text-base">Chez TipsInvest, nous avons créé une marketplace intelligente et innovante qui simplifie
      l’investissement immobilier grâce à des technologies avancées et une approche centrée sur l’utilisateur. Notre objectif est de rendre l’investissement accessible, sécurisé et optimisé pour tous, qu’il s’agisse d’investisseurs débutants ou expérimentés.</p>
      </div>
      <FeaturedPropertiesPlain ></FeaturedPropertiesPlain>
    
      {Content[userLang].map((item, index) => {
        return (
          <div key={index} className="flex w-full h-full flex-col md:flex-row gap-6 md:gap-20 bg-white rounded-3xl p-4 md:p-0 items-center">
            <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'bg-emerald-400' : 'bg-orange-600'} rounded-3xl relative border overflow-hidden min-h-[220px] md:min-h-[400px] mb-4 md:mb-0 order-1 ${index % 2 === 1 ? 'md:order-2' : ''}`}> 
              <img src={item.image} className="rounded-xl border shadow-2xl h-[180px] md:h-[calc(100%_-_80px)] w-full md:w-auto object-cover object-left-top absolute top-5 left-5 sm:left-10 sm:top-10  " alt="" />
            </div>
            <div className={`w-full md:w-1/2 py-8 md:py-32 flex flex-col items-center md:items-start order-2 ${index % 2 === 1 ? 'md:order-1' : ''}`}> 
              <p className="bg-white border w-fit text-xs md:text-sm px-3 py-1 rounded-full mb-2">{item.subtitle}</p>
              <h1 className="text-2xl md:text-4xl my-2 md:my-4 text-center md:text-left">{item.title}</h1>
              <p className="text-xs md:text-sm text-center md:text-left">{item.description}</p>
              <a className="flex mt-5 items-center gap-1 text-sm md:text-base" href="">Learn More <ArrowUpRight /></a>
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default ServiceTwo;