import { SelectedLang } from "@/stores/lang";
import { File, Box, Gauge } from "lucide-react";
import { useEffect, useState } from "react";
type Lang = "fr" | "us";

const Content = {
  fr: {
    small: "Marché immobilier",
    title: "Marketplace d’investissement immobilier",
    description:
      "TipInvest simplifie l'investissement immobilier avec des analyses, une assistance experte et des outils IA avancés",
    featured: [
      {
        icon: File,
        title: "Fiches détaillées des biens immobiliers",
        description: "Localisation, caractéristiques et prix.",
      },
      {
        icon: Box,
        title: "Visualisation immersive 3D et visites virtuelles",
        description: "Pour explorer les biens à distance.",
      },
      {
        icon: Gauge,
        title: "Comparateur de biens immobiliers",
        description: "Évaluer les meilleures opportunités.",
      },
    ],
  },
  us: {
    small: "Real Estate Market",
    title: "Real Estate Investment Marketplace",
    description:
      "TipInvest simplifies real estate investing with market analysis, expert guidance, and AI-driven tools.",
    featured: [
      {
        icon: File,
        title: "Fiches détaillées des biens immobiliers",
        description: "Localisation, caractéristiques et prix.",
      },
      {
        icon: Box,
        title: "Visualisation immersive 3D et visites virtuelles",
        description: "Pour explorer les biens à distance.",
      },
      {
        icon: Gauge,
        title: "Comparateur de biens immobiliers",
        description: "Évaluer les meilleures opportunités.",
      },
    ],
  },
};

export function ServiceThree() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
  useEffect(() => {
    SelectedLang.subscribe((n) => {
      setUserLang(n as Lang);
    });
  }, []);
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-16">
      <div className="mx-auto w-full p-6 sm:w-2/3 bg-white text-bleck rounded-2xl ">
        <div className="mx-auto flex max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="lg:pr-8 lg:pt-2 w-full">
            <div className="w-full sm:w-1/2">
              <h2 className=" font-semibold text-white bg-lime-400 text-sm w-fit rounded-full px-4 py-1 mb-5">
                {Content[userLang].small}
              </h2>
              <p className="mt-0 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl mb-4">
                {Content[userLang].title}
              </p>
              <p className="mt-0 leading text-sm">
                {Content[userLang].description}
              </p>
              <div className="flex flex-col items-start justify-start gap-y-4 mt-10 ">
                {Content[userLang].featured.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-start items-center gap-5 "
                    style={{
                    //   filter: index == 0 ? "none" : "blur(1px)",
                      opacity: index == 0 ? "1" : "0.5",

                      fontSize: index == 0 ? "22px" : "14px",
                    }}
                  >
                    <item.icon size={18}></item.icon>
                    <p>{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-12 bg-black rounded-lg text-white w-fit px-4 py-1">
              Visit Market Place ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceThree;
