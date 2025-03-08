/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState } from "react";
import { Phone } from "lucide-react";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChange?:any;
};


export default function InputPhone({
  placeholder = "Your Phone Number",
  value = "",
  onChange,
}:InputProps) {
  const [input, setInput] = useState<string>(value);

  return (
    <div
      className="ainput"
    >
      <div style={{ position: "relative" }}>
        <div className="icon">
          <Phone size={16} />
        </div>
        <input
          value={input}
          onChange={(e) => (setInput(e.target.value), onChange(e.target.value))}
          data-empty={input === ""}
        />
        <p>{placeholder}</p>

    
      </div>
      <style jsx>{`
        .ainput {
          display: block;
          position: relative;
          width: 100%;
          max-width: 350px;
          display: grid;
          height: 40px;
          transition: 0.3s ease all;
          p {
            position: absolute;
            top: 50%;
            left: 38px;
            transform: translateY(-50%);
            font-size: 13px;
            color: #000000a8 !important;
            opacity: 1 !important;
            padding: 0 4px;
            pointer-events: none;
            background: none;
            transition: 0.3s ease all;
          }

          .icon {
            position: absolute;
            top: 18px;
            left: 12px;
            transform: translateY(-38%);
            z-index: 2;
          }

          .toggle {
            opacity: 0;
            position: absolute;
            top: 50%;
            right: 12px;
            transform: translateY(-40%);
            z-index: 2;
            cursor: pointer;
          }
          input {
            width: 100%;
            height: 40px;
            border-radius: 5px;
            border: 1px solid rgba(0, 0, 0, 0.15);
            padding: 0 12px;
            padding-left: 36px;
          }
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-background-clip: text;
          }
          input[data-empty="false"] + p,
          input:focus + p {
            top: 0px;
            background: #fff;
            color: rgba(0, 0, 0) !important;
            font-size: 12px;
            left: 12px;
          }
        }
      `}</style>
    </div>
  );
}
