/* eslint-disable @next/next/no-img-element */
import Sim from "./Sim";

export default function Example() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto px-4 lg:max-w-7xl w-full lg:px-0 lg:w-2/3">
        <p className="mx-auto mt-6 text-center text-3xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
          Fonctionnalités Clés de TipInvest
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:mt-16 lg:flex-row">
          <div className="relative w-full lg:w-3/5 bg-white rounded-xl">
            <div className="relative flex h-full flex-col overflow-hidden">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 text-center lg:text-left leading-tight" style={{ fontFamily: "Figtree", fontSize: "36px", fontWeight: "1000" }}>
                  Investissement facilité
                </p>
                <p className="text-gray-700 mt-4 text-center lg:text-left">
                  Accès à un marché collaboratif avec des opportunités à haute valeur ajoutée.
                </p>
              </div>
              <div className="relative min-h-[20rem] w-full grow mx-auto lg:max-w-none">
                <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden shadow-2xl bg-white" style={{ borderRadius: "45px 45px 0 0", border: "8px solid black", borderBottom: "none" }}>
                  <div style={{ width: "25%", height: "20px", background: "black", position: "absolute", top: "10px", left: "50%", transform: "translate(-50%,0)", borderRadius: "100px" }}></div>
                  <img
                    className="w-full h-full object-cover object-top"
                    src="/assets/images/Market.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px ring-1 shadow-sm ring-black/5" style={{ borderRadius: "10px 10px 10px 10px" }}></div>
          </div>

          <div className="relative w-full lg:w-5/5">
            <div className="relative flex h-full flex-col rounded-xl bg-white overflow-hidden ">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 text-center leading-tight lg:text-left" style={{ fontFamily: "Figtree", fontSize: "36px", fontWeight: "1000" }}>
                  Visualisation immersive 3D
                </p>
                <p className="text-gray-700 mt-4 text-center lg:text-left">
                  Visites virtuelles et modélisation des biens.
                </p>
              </div>
              <div className="relative min-h-[20rem] w-full grow ">
                <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden">
                  <img
                    className="w-full h-full object-cover object-center"
                    src="/assets/images/3D.png"
                    alt=""
                    style={{ transform: "scale(1)", position: "relative", left: "-50px", bottom: "50px" }}
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px ring-1 shadow-sm ring-black/5" style={{ borderRadius: "10px 10px 10px 10px" }}></div>
          </div>
        </div>
        {/* The Sim component */}
        <Sim />
      </div>
    </div>
  );
}
