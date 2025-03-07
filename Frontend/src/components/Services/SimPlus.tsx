/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SelectedLang } from "@/stores/lang";
import { JSX, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
// import CircularProgress from "@mui/joy/CircularProgress";
import { HouseIcon } from "lucide-react";
type Lang = "fr" | "us";

// function Stat(props: any) {
//   return (
//     <>
//       <div className="stat">
//         <CircularProgress
//           variant="plain"
//           color="neutral"
//           sx={{
//             "--CircularProgress-size": "75px",
//             "--CircularProgress-trackThickness": "8px",
//             "--CircularProgress-progressThickness": "8px",
//           }}
//           className="progress"
//           determinate={true}
//           value={props.value}
//         >
//           <div>
//             <p className="stat-name">{props.name}</p>
//             <p>{props.value}</p>
//           </div>
//         </CircularProgress>
//       </div>
//       <style>{`
//       .stat {
//               padding: 1.5rem;
//               border-radius: 10px;
//               display: flex;
//               flex-direction: column;
//               justify-content: space-between;
//               align-items: center;

//               div{
//                 display: flex;
//                 justify-content: space-between;
//                 flex-direction: column;
//                 align-items: center;
//               }
//               p{
//               font-family: 'Figtree';
//               font-weight: bold;
//               font-size: 1.5rem;
//               }
//               .stat-name{
//                 font-size: .7rem;
//                 text-align: center;
//               }
//               svg {
//                 scale: 1.3;
//                 filter:blur(.4px); 
//               }
//             }
//       `}</style>
//     </>
//   );
// }

interface ServiceOptionItem {
  icon: JSX.Element;
  name: string;
}

function Options(props: { options: ServiceOptionItem[]; }) {
  return (
    <>
      <div className="options">
        {props.options.map((item, index) => (
          <div key={index} className="option-item"> 
          {/* @ts-ignore */}        
            <item.icon size={16}></item.icon>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .options {
          display: flex;
          gap: 5px;
          align-items: center;
          width: 50%;

          .option-item {
            width: fit-content;
            display: flex;
            flex-direction: row;

            align-items: center;
            gap: 0.5em;
            border-radius: 6px;
            padding: 0.3rem 0.6em;

            border: 1px solid #ccc;

            span {
              font-size: 0.8rem;
            }
          }
        }
      `}</style>
    </>
  );
}
interface ServiceOptionProps {
  options: ServiceOptionItem[];
  name: string;
}

const ServiceOption = ({ options, name }: ServiceOptionProps) => (
  <div className="sim-option flex justify-between items-center mb-2">
    <h2>{name}</h2>
    <Options options={options} />
  </div>
);

export default function InvestmentCalculator() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
  useEffect(() => {
    SelectedLang.subscribe((n) => {
      setUserLang(n as Lang);
    });
  }, []);

  const content = {
    fr: {
      title: "Évaluez votre rendement potentiel",
      text: "Que ce soit en construisant un revenu passif grâce à des biens locatifs ou en tirant parti de l'appréciation des propriétés.",
      button: "Savoir plus",
      capital: "Capital à Investir",
      downPayment: "Acompte",
      monthlyPayment: "Paiement Mensuel",
    },
    us: {
      title: "Evaluate your potential return",
      text: "Whether building passive income through rental properties or leveraging property appreciation.",
      button: "Learn more",
      capital: "Capital to Invest",
      downPayment: "Down Payment",
      monthlyPayment: "Monthly Payment",
    },
  };

  const PropertyTypes = [
    {
      name: "Apartment",
      icon: HouseIcon,
    },
    {
      name: "Villa",
      icon: HouseIcon,
    },
    {
      name: "Land",
      icon: HouseIcon,
    },
  ];

  return (
    <>
      <div id="SimPlus" className="w-full ">
        <div>
          <h1>Advanced Finatial Calculator</h1>
          <p className="mb-2">some discription to be ditermined later</p>
          <br />
          {/* @ts-ignore */}        

          <ServiceOption name={"Property Type"} options={PropertyTypes} />
          {/* @ts-ignore */}        

          <ServiceOption name={"SimPlus"} options={PropertyTypes} />
          {/* @ts-ignore */}        

          <ServiceOption name={"SimPlus"} options={PropertyTypes} />
          {/* @ts-ignore */}        

          <ServiceOption name={"SimPlus"} options={PropertyTypes} />
        </div>
        <div className="stat-container"></div>
      </div>
      <style jsx>{`
        #SimPlus {
          border-radius: 30px;
          padding: 40px;
          display: flex;
          border: 1px solid #e0e0e0;
          height: 35rem;
          display: flex;

          h1 {
            font-size: 1.5rem;
            font-family: "Figtree";
            font-weight: bold;
          }

          h2 {
            font-size: 0.9rem;
          }

          p {
            font-size: 0.8rem;
          }

          > div {
            width: 100%;
            height: 100%;
          }

          

          .stat-container {
            width: 80%;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
          }
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 48px;
          height: 48px;
          background: rgb(0, 0, 0);
          cursor: pointer;
          border-radius: 50%;
          transform: translateY(-12px);
          box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.2);
          border-width: 24px;
          border-style: solid;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 24px;
          background: rgb(235, 235, 235);
          border-radius: 16px;
        }
      `}</style>
    </>
  );
}
