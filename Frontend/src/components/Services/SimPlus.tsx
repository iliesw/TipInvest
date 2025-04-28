"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SelectedLang } from "@/stores/lang";
import {
  JSX,
  useEffect,
  useState,
} from "react";
import CircularProgress from "@mui/joy/CircularProgress";
import {
  Building,
  DollarSign,
  HouseIcon,
  LandPlot,
  Wallet,
} from "lucide-react";
import { Chart } from "./Chart";
type Lang = "fr" | "us";

function Stat(props: any) {
  return (
    <>
      <div className="stat">
        <CircularProgress
          variant="plain"
          color="primary"
          sx={{
            "--CircularProgress-size": "75px",
            "--CircularProgress-trackThickness": "8px",
            "--CircularProgress-progressThickness": "8px",
          }}
          className="progress "
          determinate={true}
          value={props.value}
        >
          <div>
            <p className="stat-name">{props.name}</p>
            <p>{props.value}%</p>
          </div>
        </CircularProgress>
      </div>
      <style>{`
      .stat {
              padding: 1.5rem;
              border-radius: 10px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;

              div{
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                align-items: center;
              }
              p{
              font-family: 'Figtree';
              font-weight: bold;
              color:black;
              font-size: 1.5rem;
              }
              .stat-name{
                font-size: .7rem;
                text-align: center;
              }
              svg {
                scale: 1.3;
                filter:saturate(0) contrast(10)
              }
            }
      `}</style>
    </>
  );
}

interface ServiceOptionItem {
  icon: JSX.Element;
  name: string;
}

function Options(props: { options: ServiceOptionItem[] }) {
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
          width: fit-content;

          .option-item {
            width: fit-content;
            display: flex;
            flex-direction: row;

            align-items: center;
            gap: 0.5em;
            border-radius: 60px;
            padding: 0.3rem 0.6em;
            border: 1px solid #ccc;
            transition: 0.2s ease;
            cursor: pointer;

            &:hover {
              background: #eee;
            }

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

  const PropertyTypes:object[] = [
    {
      name: "Apartment",
      icon: Building,
    },
    {
      name: "Villa",
      icon: HouseIcon,
    },
    {
      name: "Land",
      icon: LandPlot,
    },
  ];

  const InvestmentTypes = [
    {
      name: "Rental",
      icon: Wallet,
    },
    {
      name: "Selling",
      icon: DollarSign,
    },
  ];

  function remap(
    value: number,
    low1: number,
    high1: number,
    low2: number,
    high2: number,
  ) {
    return low2 + ((value - low1) * (high2 - low2)) / (high1 - low1);
  }

  const [InvestAmmount, setInvestAmmount] = useState(202300);

  return (
    <>
      <div id="SimPlus" className="w-full py-16 flex-col sm:flex-row gap-4">
        <div className="flex flex-col justify-between ">
          <h1>Calculatrice financière avancée</h1>

          <br />
          {/* @ts-ignore */}
          <ServiceOption name={"Propriété"} options={PropertyTypes} />
          {/* @ts-ignore */}

          <ServiceOption name={"Investissement"} options={InvestmentTypes} />
          <br />
          <div className="flex justify-between w-full">
            <h1>Capital a investir</h1> <h1>{InvestAmmount} $</h1>
          </div>
          <input
            className="w-full my-6"
            type="range"
            min="1000"
            max="500000"
            step="100"
            onChange={(e) => setInvestAmmount(parseInt(e.target.value))}
          />
          <div className="flex justify-between w-full">
            <h1>Apport initial</h1> <h1>{InvestAmmount * 0.13} $</h1>
          </div>
          <div className="flex justify-between w-full">
            <h1>Payement mensuel</h1>{" "}
            <h1>{Math.floor(InvestAmmount * 0.13 * 0.03)} $</h1>
          </div>
          <div className="flex justify-between w-full">
            <h1>Durée</h1>{" "}
            <h1>
              {Math.floor(remap(InvestAmmount, 1000, 500000, 6, 180))} Mois
            </h1>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row">
            <Stat name={"Invest"} value={84} />
            <Stat name={"Cost"} value={60} />
            <Stat name={"ROI"} value={76} />
            <Stat name={"Risk"} value={23} />
          </div>
          <Chart />
        </div>
      </div>
      <style jsx>{`
        #SimPlus {
          border-radius: 20px;
          padding: 40px;
          display: flex;
          border: 1px solid #e0e0e0;
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
          background: rgb(0, 0, 0) !important;
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
