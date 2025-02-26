import { useState } from "react";

const faqs = [
  {
    question: "Comment Tips Invest révolutionne l’investissement immobilier ?",
    answer:
    "Tips Invest utilise l’IA, la 3D et des outils financiers avancés pour offrir une analyse précise et une visualisation immersive des investissements immobiliers.",
  },
  {
    question: "Quels sont les avantages de l’IA dans l’analyse immobilière ?",
    answer:
    "L’IA permet d’identifier les meilleures opportunités en analysant des milliers de données en temps réel pour optimiser la prise de décision.",
  },
  {
    question: "Comment fonctionne la visualisation 3D des biens ?",
    answer:
    "Grâce à notre technologie 3D avancée, vous pouvez explorer les biens immobiliers de manière immersive et détaillée avant de prendre une décision.",
  },
  {
    question: "Quels outils financiers propose Tips Invest ?",
    answer:
    "Nous mettons à disposition des simulateurs, des analyses de rentabilité et des outils de gestion pour maximiser votre investissement.",
  },
  ];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
  setOpenIndex(openIndex === index ? null : index);
  };

  return (
  <section className="py-12 md:py-24 px-4">
    <div className="mx-auto w-full lg:w-2/3 ">
    <div className="mb-8 md:mb-16 text-center">
      <h6 className="text-lime-600 font-semibold pb-4 md:pb-6">FAQs</h6>
      <h2 className="text-2xl md:text-4xl font-manrope font-bold text-gray-900 leading-8 md:leading-[3.25rem]">
      Questions Fréquemment Posées
      </h2>
    </div>
    <div>
      {faqs.map((faq, index) => (
      <div
        key={index}
        className={`py-6 md:py-8 px-4 md:px-6 border-b border-gray-200 rounded-2xl transition-all duration-500 cursor-pointer hover:bg-lime-50 ${
        openIndex === index ? "bg-lime-50" : ""
        }`}
        onClick={() => toggleFAQ(index)}
      >
        <button className="flex items-center justify-between w-full text-left text-gray-900 leading-6 md:leading-8 font-medium hover:text-lime-600">
        <h5 className="text-base md:text-lg">{faq.question}</h5>
        <svg
          className={`text-gray-500 transition duration-500 transform ${
          openIndex === index ? "rotate-180 text-lime-600" : ""
          }`}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
          d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          ></path>
        </svg>
        </button>
        {openIndex === index && (
        <div className="mt-2 md:mt-4 text-sm md:text-base text-gray-900 leading-5 md:leading-6">
          {faq.answer}
        </div>
        )}
      </div>
      ))}
    </div>
    </div>
  </section>
  );
}
