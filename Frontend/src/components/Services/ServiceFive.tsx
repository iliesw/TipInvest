
"use client";
import { SelectedLang } from "@/stores/lang";
import { useEffect, useState } from "react";
type Lang = "fr" | "us";
export default function Features() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
  useEffect(() => {
    SelectedLang.subscribe((n) => {
      setUserLang(n as Lang);
    });
  }, []);
  const features = {
    fr: {
      x: "Sécurisation des Transactions",
      title: "Notre Accompagnement Juridique",
      button: "En savoir plus",
      l: [
        {
          title: "Due diligence immobilière",
          description: "Vérification des documents légaux avant l’achat.",
          imgSrc: "/assets/images/docs.jpg", // Replace with actual path
        },
        {
          title: "Blockchain et digitalisation",
          description: "Garantir transparence et sécurité des transactions.",
          imgSrc: "/assets/images/chain.jpg", // Replace with actual path
        },
        {
          title: "Sécurisation des contrats",
          description:
            "Accompagnement dans la rédaction et la sécurisation des contrats immobiliers.",
          imgSrc: "/assets/images/contract.jpg", // Replace with actual path
        },
      ],
    },
    us: {
      x: "Transaction Security",
      title: "Our Legal Support",
      button: "LearnMore",
      l: [
        {
          title: "Real Estate Due Diligence",
          description: "Verification of legal documents before purchase.",
          imgSrc: "/assets/images/docs.jpg", // Replace with actual path
        },
        {
          title: "Blockchain and Digitalization",
          description: "Ensuring transparency and security in transactions.",
          imgSrc: "/assets/images/chain.jpg", // Replace with actual path
        },
        {
          title: "Contract Security",
          description:
            "Assistance in drafting and securing real estate contracts.",
          imgSrc: "/assets/images/contract.jpg", // Replace with actual path
        },
      ],
    },
  };

  return (
    <section className="py-16 text-center w-full px-0 mx-auto sm:w-2/3">
      <h3 className="text-lime-600 font-semibold">{features[userLang].x}</h3>
      <h2 className="text-3xl font-bold text-gray-900 mt-2">
        {features[userLang].title}
      </h2>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-0">
        {features[userLang].l.map((feature, index) => (
          <div key={index} className=" rounded-2xl flex flex-col items-start">
            <img
              src={feature.imgSrc}
              alt={feature.title}
              className="mx-auto h-[250px] min-h-50 w-full object-cover rounded-xl"
            />
            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              {feature.title}
            </h3>
            <p className="text-gray-600 mt-2 w-fit text-start">
              {feature.description}
            </p>
            <a
              href="#"
              className="text-lime-600 font-semibold mt-4 inline-flex items-center"
            >
              {features[userLang].button} <span className="ml-2">→</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
