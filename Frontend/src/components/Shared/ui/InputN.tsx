import { useState } from "react";

type InputProps = {
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  icon?: React.ReactNode;
  onChange?: (value: number) => void;
};

export default function InputN({
  placeholder = "Enter text",
  value = "",
  icon,
  onChange
}: InputProps) {
  const [input, setInput] = useState<string>(value);

  return (
    <div className="ainput">
      <div className="flex items-center pl-3 bg-white rounded-lg w-full border overflow-hidden" style={{ position: "relative" }}>
        {icon && <div className="icon">{icon}</div>}
        <input
        className="focus:outline-none"
          type="number"
          max={1000000}
          min={0}
          placeholder={placeholder}
          onChange={(e) => {
            setInput(e.target.value);
            onChange?.(parseFloat(e.target.value) || 0);
          }}
          data-empty={input === ""}
        />
      </div>

      <style jsx>{`
        .ainput {
          display: flex;
          position: relative;
          width: 100%;
          max-width: 350px;
          display: grid;
          height: 40px;
          transition: 0.3s ease all;
          
          p {
            
            
            font-size: 13px;
            color: #000000a8 !important;
            opacity: 1 !important;
            padding: 0 4px;
            pointer-events: none;
            background: none;
            transition: 0.3s ease all;
            white-space: nowrap;
            
          }

          .icon {
            top: 18px;
            left: 12px;
            transform: translateY(-38%);
            z-index: 2;
          }

          input {
            width: 100%;
            height: 40px;
            padding: 0 0px;
          }

          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-background-clip: text;
          }
        }
      `}</style>
    </div>
  );
}
