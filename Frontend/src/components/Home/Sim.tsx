import { useState } from "react";
import styled from "styled-components";

const Myinput = styled.input`
    appearance: none;
    width: 100%;
    height: 24px;
    background: #e8eff0;
    outline: none;
    border-radius: 50px;
    margin-top: 24px;
    margin-bottom: 24px;
    position: relative;
  

  &::-webkit-slider-thumb {
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

  &::-webkit-slider-runnable-track {
    height: 24px;
    background: var(
        --token-0c4a7810-dbb7-4735-ac98-cf66fd324474,
        rgb(235, 235, 235)
      )
    border-radius: 16px;
  }
`;

export default function InvestmentCalculator() {
  const [investment, setInvestment] = useState(20000);
  const downPayment = (investment * 0.2).toFixed(0);
  const monthlyPayment = (investment * 0.012).toFixed(0);

  return (
    <div className="flex bg-[#fff] mt-4 p-10 max-w-7xl mx-auto border-gray-200 border" style={{borderRadius:"10px 10px 30px 30px"}}>
      <div className="w-1/2 pr-10 flex flex-col justify-between max-h-full">
      <div>

        <h2 className="text-4xl font-bold text-black">
          Évaluez votre rendement potentiel
        </h2>
        <p className="text-gray-700 mt-4">
          Que ce soit en construisant un revenu passif grâce à des biens
          locatifs ou en tirant parti de l&apos;appréciation des propriétés.
        </p>
      </div>
        <button className="mt-6 w-1/2 rounded-xl bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Savoir plus</button>
      </div>
      <div className="w-1/2 bg-white  rounded-xl">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium flex items-center justify-between">
            Capital à Investir
            <span className="block text-right text-black font-semibold">
            € {investment}
          </span>
          </label>
          <Myinput
            type="range"
            min="5000"
            max="500000"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full mt-2"
          />
          
        </div>
        <div className="mb-4 flex w-full items-center justify-between">
          <label className="block text-gray-700 font-medium">Acompte</label>
          <span className="block text-3xl font-bold text-black">
            € {downPayment}
          </span>
        </div>
        <div className="flex w-full items-center justify-between">
          <label className="block text-gray-700 font-medium">
            Paiement Mensuel
          </label>
          <span className="block text-xl font-semibold text-black">
            € {monthlyPayment}
          </span>
        </div>
      </div>
    </div>
  );
}
