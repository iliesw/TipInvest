/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState } from "react";
import { Mail, KeyRound, User, Check, Eye, EyeOff } from "lucide-react";

type ValidatorFunction = (value: string) => boolean;

type ValidatorsType = {
  [key: string]: ValidatorFunction;
};

const Validators: ValidatorsType = {
  email: (value) => {
    const settings = {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      minLength: 5,
      maxLength: 50,
      required: true,
    };

    if (!value && settings.required) return false;
    if (value.length < settings.minLength) return false;
    if (value.length > settings.maxLength) return false;
    return settings.pattern.test(value);
  },

  password: (value) => {
    const settings = {
      minLength: 8,
      maxLength: 32,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecial: true,
      required: true,
    };

    if (!value && settings.required) return false;
    if (value.length < settings.minLength) return false;
    if (value.length > settings.maxLength) return false;
    if (settings.requireUppercase && !/[A-Z]/.test(value)) return false;
    if (settings.requireLowercase && !/[a-z]/.test(value)) return false;
    if (settings.requireNumbers && !/[0-9]/.test(value)) return false;
    if (settings.requireSpecial && !/[!@#$%^&*]/.test(value)) return false;
    return true;
  },

  username: (value) => {
    const settings = {
      minLength: 3,
      maxLength: 20,
      allowSpaces: false,
      allowSpecial: false,
      pattern: /^[a-zA-Z0-9_-]*$/,
      required: true,
    };

    if (!value && settings.required) return false;
    if (value.length < settings.minLength) return false;
    if (value.length > settings.maxLength) return false;
    if (!settings.allowSpaces && /\s/.test(value)) return false;
    if (!settings.allowSpecial && !settings.pattern.test(value)) return false;
    return true;
  },
};

type InputProps = {
  name?: string;
  type?: "email" | "password" | "username";
  placeholder?: string;
  passwordStrength?: boolean;
  value?: string;
  // @ts-ignore
  onChange?: any;
};

export default function Input({
  type = "password",
  placeholder = "Your Password",
  passwordStrength = true,
  value = "",
  onChange
}: InputProps) {
  const [input, setInput] = useState<string>(value);
  const [hidden, setHidden] = useState<boolean>(true);
  const [touched] = useState<boolean>(false);
  const validator = Validators[type] || (() => true);
  const valid = touched ? validator(input) : true;
  const strengthLvl =
    input.length > 0
      ? [/[A-Z]/.test(input), /[0-9]/.test(input), input.length >= 8].filter(
          Boolean
        ).length
      : 0;

  
  return (
    <div
      className={`ainput ${type === "password" ? "password" : ""}`}
      data-valid={valid}
      data-strength={passwordStrength}
    >
      <div style={{ position: "relative" }}>
        <div className="icon">
          {type === "email" && <Mail size={16} />}
          {type === "password" && <KeyRound size={16} />}
          {type === "username" && <User size={16} />}
        </div>
        <input
          type={type === "password" ? (hidden ? "password" : "text") : type}
          value={input}
          onChange={(e) => (setInput(e.target.value),onChange(e.target.value))}
          data-empty={input === ""}
        />
        <p>{placeholder}</p>

        {type === "password" && (
          <div
            className="toggle"
            onClick={() => {
              setHidden(!hidden);
            }}
          >
            {hidden ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
        )}
      </div>
        {passwordStrength && type === "password" ? (
          <div className={passwordStrength ? "passwordStrength dive" : "dive"}>
            <article>
              <progress value={strengthLvl > 0 ? 10 : 0} max="10"></progress>
              <progress value={strengthLvl > 1 ? 10 : 0} max="10"></progress>
              <progress value={strengthLvl > 2 ? 10 : 0} max="10"></progress>
            </article>
            <div className="rules">
              <div className="r" data-done={strengthLvl > 0 ? 10 : 0}>
                <span className="i">
                  <Check size={12} />
                </span>
                At least one upper letter
              </div>
              <div className="r" data-done={strengthLvl > 1 ? 10 : 0}>
                <span className="i">
                  <Check size={12} />
                </span>
                At least one number
              </div>
              <div className="r" data-done={strengthLvl > 2 ? 10 : 0}>
                <span className="i">
                  <Check size={12} />
                </span>
                At least 8 letters
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}

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

        .dive {
          width: 100%;
          opacity: 0;
          overflow: hidden;

          .rules {
            margin-top: 10px;
            height: fit-content;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 5px;

            .r {
              font-size: 13px;
              display: flex;
              gap: 7px;
              .i {
                display: flex;
                color: #fff;
                justify-content: center;
                align-items: center;
                width: 15px;
                height: 15px;
                border-radius: 100%;
                background: rgb(203, 203, 203);
                transition: 0.3s ease all;
              }

              &[data-done="10"] {
                .i {
                  background: rgb(6, 169, 0);
                }
              }
            }
          }
          article {
            display: flex;
            width: 100%;
            gap: 5px;
            height: 8px;
            flex-direction: row;
            margin-top:5px;
            
            progress {
              width: 100%;
              height: 8px;
              border-radius:50px;
              background: #f1f1f1;
              overflow:hidden;
              margin-top: 0;
            }

            progress:nth-child(1)::-webkit-progress-value {
              transition: 0.3s ease all;
              background: linear-gradient(
                90deg,
                rgb(255, 77, 0),
                rgb(255, 123, 0)
              );
            }

            progress:nth-child(2)::-webkit-progress-value {
              transition: 0.3s ease all;
              background: linear-gradient(
                90deg,
                rgb(255, 123, 0),
                rgb(224, 255, 47)
              );
            }
            progress:nth-child(3)::-webkit-progress-value {
              transition: 0.3s ease all;
              background: linear-gradient(
                90deg,
                rgb(224, 255, 47),
                rgb(0, 201, 57)
              );
            }
          }
        }
        .password[data-strength="true"]:has(input:focus),
        .password[data-strength="true"][valid="false"]:has(input[empty="false"]) {
          height: 135px;
          opacity: 1;
          
          .toggle {
            opacity: 1;
          }

          .dive {
            opacity: 1;
          }
        }

        .password:not([data-strength="true"]):has(input:focus) .toggle,
        .password:not([data-strength="true"])[valid="false"]:has(input[empty="false"]) .toggle {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
