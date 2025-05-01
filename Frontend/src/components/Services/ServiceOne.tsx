"use client";
import { SelectedLang } from "@/stores/lang";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
type Lang = "fr" | "us";

const Content = {
  fr: [
    {
      title: "Analyse et Recommandations Personnalisées",
      subtitle: "🤖 Tirez parti de l’IA pour investir intelligemment",
      description:
        "Intelligence Artificielle : Notre algorithme analyse en temps réel les tendances du marché et vous recommande les meilleures opportunités d’investissement en fonction de votre profil et de vos objectifs. Simulations financières avancées : Prévoyez la rentabilité, optimisez votre fiscalité et prenez des décisions stratégiques basées sur des données fiables.",
      image: "/assets/images/display/imageI.png",
    },
    {
      title: "Sécurisation et Transparence des Transactions",
      subtitle: "🔒 Technologie blockchain et expertise juridique",
      description:
        "Blockchain & Smart Contracts : Vos transactions sont traçables et infalsifiables, garantissant une sécurité totale et une confiance absolue. Accompagnement juridique : Nos experts veillent à la conformité de vos achats, réduisant les risques légaux et administratifs.",
        image: "/assets/images/display/imageM.png",
    },
    {
      title: "Expérience Immobilière Digitale et Immersive",
      subtitle: "🏡 Visitez, gérez, investissez sans vous déplacer",
      description:
        "Visites Virtuelles en 3D & Réalité Augmentée : Visualisez les biens à distance, explorez chaque détail et prenez une décision sans vous déplacer. Outils de gestion immobilière : Suivez en temps réel vos investissements, vos revenus locatifs et la valorisation de votre patrimoine.",
        image: "/assets/images/display/imageM.png",
    },
    {
      title: "Accompagnement et Gestion sur Mesure",
      subtitle: "👨‍💼 Experts à votre service, solutions optimisées",
      description:
        "Conseillers spécialisés : Profitez de l’expertise de nos consultants en investissement, en fiscalité et en droit immobilier pour un accompagnement personnalisé. Gestion locative et patrimoniale : Maximisez vos revenus grâce à nos solutions de gestion optimisée et automatisée.",
        image: "/assets/images/display/imageM.png",
    },
  ],
  us: [
    {
      title: "Personalized Analysis and Recommendations",
      subtitle: "🤖 Leverage AI to invest smartly",
      description:
        "Artificial Intelligence: Our algorithm analyzes market trends in real-time and recommends the best investment opportunities based on your profile and goals. Advanced Financial Simulations: Forecast profitability, optimize your taxes, and make strategic decisions based on reliable data.",
        image: "/assets/images/display/imageM.png",
    },
    {
      title: "Secure and Transparent Transactions",
      subtitle: "🔒 Blockchain technology and legal expertise",
      description:
        "Blockchain & Smart Contracts: Your transactions are traceable and tamper-proof, ensuring total security and absolute trust. Legal Support: Our experts ensure the compliance of your purchases, reducing legal and administrative risks.",
        image: "/assets/images/display/imageM.png",
    },
    {
      title: "Immersive Digital Real Estate Experience",
      subtitle: "🏡 Visit, manage, and invest remotely",
      description:
        "3D Virtual Tours & Augmented Reality: View properties remotely, explore every detail, and make decisions without traveling. Real Estate Management Tools: Monitor your investments, rental income, and property value in real-time.",
        image: "/assets/images/display/imageM.png",
    },
    {
      title: "Tailored Support and Management",
      subtitle: "👨‍💼 Experts at your service, optimized solutions",
      description:
        "Specialized Advisors: Benefit from the expertise of our consultants in investment, taxation, and real estate law for personalized support. Rental and Wealth Management: Maximize your income with our optimized and automated management solutions.",
        image: "/assets/images/display/imageM.png",
    },
  ],
};


export function ServiceOne() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
  useEffect(() => {
    SelectedLang.subscribe((n) => {
      setUserLang(n as Lang);
    });
  }, []);



  return (
    <div className="w-full flex flex-col sm:w-2/3 mx-auto gap-10 px-2 md:px-0">
      <div className="flex items-center bg-slate-100 rounded-3xl flex-col py-24 md:py-48 relative overflow-hidden px-16 my-8">
      <iframe src='https://my.spline.design/abstractgradientbackground-4Lt6hhnI2S0ki8npctRZauO3/' className="absolute top-0 left-0 sm:scale-[1.258] scale-[1.70]  hue-rotate-[270deg] pointer-events-none" width='100%' height='100%'></iframe>
      <h1 className="text-3xl sm:text-5xl md:text-7xl mb-4 relative text-center">Nos Services</h1>
      <p className="text-center w-full sm:w-2/3 relative text-sm md:text-base">Chez TipsInvest, nous vous offrons une expérience complète et optimisée pour votre investissement immobilier. Grâce à l’intégration des dernières innovations technologiques, nous simplifions chaque étape du processus pour vous garantir sécurité, transparence et rentabilité.</p>
      </div>
    
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

export default ServiceOne;