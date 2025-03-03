import { CircleCheck, CirclePlus } from "lucide-react";

const Options = {
  "AI Property Valuation": {
    subtitle: "Get accurate property values",
    levels: [true, true, true],
  },
  "Market Analysis": {
    subtitle: "Analyze market trends",
    levels: [true, true, true],
  },
  "Property Listings": {
    subtitle: "List properties effectively",
    levels: [true, true, true],
  },
  "Virtual Tours": {
    subtitle: "Offer virtual property tours",
    levels: [false, true, true],
  },
  "Customer Insights": {
    subtitle: "Understand your customers",
    levels: [false, false, true],
  },
  "Automated Messaging": {
    subtitle: "Automate your communications",
    levels: [false, false, true],
  },
};

export default function Detail() {
  return (
    <div className="px-4 py-8">
      <div className="w-full sm:w-2/3 mx-auto rounded-2xl bg-white shadow-xl border overflow-hidden" style={{background:"radial-gradient(circle,#00000020 5%,white 5%)",backgroundSize:"2vh 2vh"}}>
        <div className="w-full">
          <div className="grid grid-cols-4 gap-4 p-8 text-sm sm:text-base font-bold text-center">
            <div className="text-left font-semibold"></div>
            <div>Essentiel</div>
            <div>Avancé</div>
            <div>Élite</div>
          </div>
          {Object.entries(Options).map(([key, { subtitle, levels }]) => (
            <div key={key} className="grid grid-cols-4 border-t p-4 sm:p-8 text-sm sm:text-base items-center text-center">
              <div className="text-left">
                <h1 className="font-medium">{key}</h1>
                <p className="text-xs sm:text-sm text-gray-600">{subtitle}</p>
              </div>
              {levels.map((value, index) => (
                <div key={index} className="flex items-center justify-center">
                  {value ? <CircleCheck /> : <div className="opacity-25 rotate-45"><CirclePlus /></div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}