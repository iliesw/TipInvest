import { Box, Building, Home, LandPlot, LucideIcon } from "lucide-react";
import { useState } from "react";

export default function InputO({
  onChange,
  title = "Property Type",
  Icon = Box,
}: {
  Icon?: LucideIcon;
  onChange: (value: number) => void;
  title?: string;
}) {
  const Collection = [
    { name: "House", icon: Home },
    { name: "Apartment", icon: Building },
    { name: "Land", icon: LandPlot },
  ];
  const [selected, setSelected] = useState(0);

  return (
    <div className={`block w-full relative overflow-hidden rounded-full`}>
      <div className="w-full overflow-hidden relative bg-[#00000030] rounded-full h-9 dark:bg-gray-700"></div>
      <div className="flex justify-between items-center absolute p-0.5 top-0 left-0 w-full text-white ">
        <span className="text-sm bg-white text-black h-8 px-3 rounded-full flex items-center justify-center gap-2 transition-all duration-200">
          <Icon size={15} className="text-gray-500" />
          <p className="text-xs text-gray-500 flex items-center gap-1">
            {title}
          </p>
        </span>
        <div className="flex gap-1 bg-white rounded-full">
          {Collection.map((item, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  setSelected(index);
                  onChange(index);
                }}
                className={`${
                  selected == index
                    ? "text-black"
                    : "text-black opacity-50"
                } gap-2 h-8 px-3 rounded-full flex items-center justify-center text-sm transition hover:blur-none hover:opacity-100 duration-200`}
              >
                <item.icon size={14} />
                <p className={selected == index ? "block" : "hidden"}>
                  {item.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
