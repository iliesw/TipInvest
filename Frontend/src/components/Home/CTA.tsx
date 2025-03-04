import { SelectedLang } from "@/stores/lang";
import { useEffect, useState } from "react";
type Lang = 'fr' | 'us';

export default function Cta() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
          useEffect(() => {
            SelectedLang.subscribe((n) => {
              setUserLang(n as Lang);
            });
          }, []);

  const content = {
    fr: {
      title: "Rejoignez Tips Invest dès aujourd’hui !",
      text: "Rejoignez Tips Invest et accédez aux meilleurs outils pour optimiser vos investissements immobiliers.",
      button: "Créer un compte gratuitement",
    },
    us: {
      title: "Join Tips Invest today!",
      text: "Join Tips Invest and access the best tools to optimize your real estate investments.",
      button: "Create a free account",
    },
  };
  return (
    <div className="w-full flex justify-center mx-auto ">
      <div className=" bg-lime-50 w-full lg:w-2/3 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-6 text-center md:text-left">
          <h1
            className="text-xl md:text-2xl font-bold"
            style={{ fontFamily: "Figtree" }}
          >
            {content[userLang].title}
          </h1>
          <p className="mt-2">
          {content[userLang].text}
          </p>
        </div>
        <button className="w-full md:w-auto rounded-xl bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
        {content[userLang].button}
        </button>
      </div>
    </div>
  );
}
