import { SelectedLang } from "@/stores/lang";
import { useEffect, useState } from "react";

const statsContent = {
  fr: {
    partnerMessage: "Votre partenaire pour réussir",
    mainHeading: "Déjà plus de 500 investisseurs conquis !",
    description: "Notre plateforme est conçue pour connecter les utilisateurs à leurs biens idéaux rapidement, offrant une expérience fluide et engageante. Pour les investisseurs, nous offrons une forte croissance, des ventes plus rapides et un retour sur investissement croissant, faisant de notre plateforme une opportunité idéale sur le marché immobilier.",
    stats: [
      {
        value: "50+",
        description: "Biens listés – Un large éventail de maisons, appartements et espaces commerciaux."
      },
      {
        value: "150%",
        description: "Croissance annuelle – Démontrant la popularité croissante de la plateforme et l'augmentation de sa part de marché."
      },
      {
        value: "30%",
        description: "Augmentation du ROI – Les investisseurs bénéficient de rendements plus élevés grâce à nos analyses de données et transactions rapides."
      }
    ]
  },
  us: {
    partnerMessage: "Your partner for success",
    mainHeading: "Over 500 investors already convinced!",
    description: "Our platform is designed to connect users to their ideal properties quickly, offering a smooth and engaging experience. For investors, we offer strong growth, faster sales, and increasing ROI, making our platform an ideal opportunity in the real estate market.",
    stats: [
      {
        value: "50+",
        description: "Listed properties – A wide range of houses, apartments, and commercial spaces."
      },
      {
        value: "150%",
        description: "Annual growth – Demonstrating the growing popularity of the platform and its increasing market share."
      },
      {
        value: "30%",
        description: "ROI increase – Investors benefit from higher returns through our data analysis and fast transactions."
      }
    ]
  }
};

const Stats = () => {
  const [userLang, setUserLang] = useState<string>(SelectedLang.get());
      useEffect(() => {
        SelectedLang.subscribe((n) => {
          setUserLang(n);
        });
      }, []);
  return (
    <div className="w-full flex justify-center px-4">
      <div className="bg-white block w-full lg:w-2/3  my-[150px] rounded-[20px] outline-2 outline-dashed outline-[rgba(0,0,0,0.153)] p-[55px] box-border">
        <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[80px] pt-[15px] items-center">
          <div className="w-full lg:w-[150%]">
            <span className="bg-[rgb(247,255,233)] px-[20px] py-[10px] rounded-[50px] text-[15px] font-rubik text-black">
              {statsContent[userLang].partnerMessage}
            </span>
            <h1 className="font-figtree text-[32px] font-extrabold w-full text-start mt-[20px]">
              {statsContent[userLang].mainHeading}
            </h1>
          </div>
          <p className="w-full lg:w-[120%] h-full text-start opacity-50 font-versel text-[14px]">
            {statsContent[userLang].description}
          </p>
        </div>
        <div className="my-[30px] mb-[40px] w-full h-[1px] bg-gradient-to-r from-[rgba(0,0,0,0.253)] to-white bg-[length:5px]"></div>
        <div className="flex flex-col md:flex-row gap-[40px]">
          {statsContent[userLang].stats.map((stat, index) => (
            <div key={index} className="w-full flex flex-col gap-[20px] items-center">
              <h1 className="text-[65px] font-figtree m-0">{stat.value}</h1>
              <p className="text-center m-0 font-versel opacity-50 text-[14px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
