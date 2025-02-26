import { useState } from "react";

export default function InvestmentCalculator() {
  const [investment, setInvestment] = useState(20000);
  const downPayment = (investment * 0.2).toFixed(0);
  const monthlyPayment = (investment * 0.012).toFixed(0);

  return (
    <>
      <div className="flex flex-col lg:flex-row bg-white mt-4 p-10 max-w-7xl mx-auto border-gray-200 border rounded-[10px_10px_30px_30px]">
        <div className="w-full lg:w-1/2 pr-0 lg:pr-10 flex flex-col justify-between max-h-full">
          <div>
            <h2 className="text-4xl font-bold text-black">
              Évaluez votre rendement potentiel
            </h2>
            <p className="text-gray-700 mt-4">
              Que ce soit en construisant un revenu passif grâce à des biens
              locatifs ou en tirant parti de l&apos;appréciation des propriétés.
            </p>
          </div>
          <button className="mt-6 w-full lg:w-1/2 rounded-xl bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
            Savoir plus
          </button>
        </div>
        <div className="w-full lg:w-1/2 bg-white rounded-xl flex flex-col gap-2 mt-6 lg:mt-0">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium flex items-center justify-between">
              Capital à Investir
              <span className="block text-right text-black font-semibold">
                € {investment}
              </span>
            </label>
            <input
              type="range"
              min="5000"
              max="50000"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full mt-6 appearance-none h-6 bg-gray-200 rounded-full"
              style={{
                WebkitAppearance: "none",
                appearance: "none",
              }}
            />
            <style jsx>{`
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
    </>
  );
}
