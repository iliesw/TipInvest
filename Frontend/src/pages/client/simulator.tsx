import LayoutC from "./layout";
import InvestorSim from "@/components/Simulators/Investor";

export default function Simulator() {
  return (
    <LayoutC>
      {/* {isInvestor == 0 ? (
        <div className="h-full flex items-center w-full flex-col justify-center">
          <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-3">
            <div
              onClick={() => {
                setIsInvestor(1);
              }}
              className="rounded-lg cursor-pointer hover:bg-gray-200 transition w-64 bg-gray-100 relative overflow-hidden sm:aspect-square flex flex-col items-start p-6 justify-between border"
            >
              <div className="absolute top-0 left-0 w-full h-full"></div>
              <div className="flex relative w-full z-10 justify-end">
                <ArrowRight></ArrowRight>
              </div>
              <div className="z-10 relative">
                <h1 className="text-3xl">Investor</h1>
                <p className="text-gray-500 text-sm ">Analyze market trends</p>
              </div>
            </div>
            <div
              onClick={() => {
                setIsInvestor(2);
              }}
              className="rounded-lg cursor-pointer hover:bg-gray-200 transition w-64 bg-gray-100 relative overflow-hidden sm:aspect-square flex flex-col items-start p-6 justify-between border"
            >
              <div className="absolute top-0 left-0 w-full h-full"></div>
              <div className="flex relative w-full z-10 justify-end">
                <ArrowRight></ArrowRight>
              </div>
              <div className="z-10 relative">
                <h1 className="text-3xl">Buyer</h1>
                <p className="text-gray-500 text-sm ">
                  Practice negotiation scenarios
                </p>
              </div>
            </div>
          </div>
          <p className="flex items-center text-sm mt-5">
            Give us your Feedback ?{" "}
            <a className="ml-2 cursor-pointer flex text-cyan-400 text-nowrap">
              Contact us
            </a>
          </p>
        </div>
      ) : (
        isInvestor == 1? <InvestorSim OnBack={()=>{setIsInvestor(0)}}/>:<BuyerSim OnBack={()=>{setIsInvestor(0)}}/>
      )} */}
      <InvestorSim />
    </LayoutC>
  );
}
