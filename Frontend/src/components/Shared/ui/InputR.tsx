import { LucideIcon } from "lucide-react";
import { useState } from "react";

export default function InputRange({
  min,
  max,
  title,
  onChange,
  steps = 8,
  small = false,
  Icon = undefined,
  initialValue,
}: {
  min: number;
  Icon?: LucideIcon;
  max: number;
  steps?: number;
  small?: boolean;
  title?: string;
  initialValue?: number;
  onChange: (value: number) => void;
}) {
  // Use initialValue if provided, otherwise default to min
  // Ensure the initialValue is within the min-max range
  const [value, setValue] = useState(
    initialValue !== undefined
      ? Math.min(Math.max(initialValue, min), max)
      : min
  );

  const increment = () => {
    if (value < max) {
      setValue((prev) => Math.min(prev + steps, max));
      onChange(Math.min(value + steps, max));
    }
  };

  const decrement = () => {
    if (value > min) {
      setValue((prev) => Math.max(prev - steps, min));
      onChange(Math.max(value - steps, min));
    }
  };

  return (
    <div
      className={`block ${
        small ? "w-2/3" : "w-full"
      } h-9 relative overflow-hidden rounded-full`}
    >
      <div className="w-full overflow-hidden relative bg-[#00000030] rounded-full h-9 dark:bg-gray-700">
        <div
          className="bg-[#00000050] h-9 rounded-full transition-all duration-200"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center absolute px-0.5 top-0 left-0 w-full text-white h-9">
        <button
          className="bg-white p-3 rounded-full text-black h-8 aspect-square flex items-center justify-center"
          onClick={decrement}
        >
          -
        </button>
        <span className="text-sm bg-white text-black h-8 px-5 rounded-full flex items-center justify-center gap-2 transition-all duration-200">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            {title}
          </p>
          <input 
            type="number" 
            value={value} 
            onChange={(e) => {
              const newValue = Math.min(Math.max(Number(e.target.value), min), max);
              setValue(newValue);
              onChange(newValue);
            }}
            style={{ width: `${max.toString().length + 2}ch` }}
            className="focus:border-none focus:outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
          />
          {Icon && <Icon size={15} />}
        </span>
        <button
          className="bg-white p-3 rounded-full text-black h-8 aspect-square flex items-center justify-center"
          onClick={increment}
        >
          +
        </button>
      </div>
    </div>
  );
}
