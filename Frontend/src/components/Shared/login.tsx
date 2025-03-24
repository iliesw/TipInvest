/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import Input from "./ui/Input";
import InputPhone from "./ui/InputPhone";
import { CircleDashedIcon } from "lucide-react";
import { isShowing } from "@/stores/isAuthVisible";
import { SelectedLang } from "@/stores/lang";
import useFetch from "./../../lib/fetch";
import { useRouter } from "next/router";
import { saveToken } from "@/pages/api/set-cookie"


type Lang = 'fr' | 'us';

const LoginPage: React.FC = () => {
  const [authshow, setAuthShow] = useState(isShowing.get());
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
        useEffect(() => {
          SelectedLang.subscribe((n) => {
            setUserLang(n as Lang);
          });
        }, []);
        useEffect(() => {
          isShowing.subscribe((n) => {
            setAuthShow(n);
          });
        }, []);
  
  const [pos, setPos] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
  const [loginFetching, setLoginFetching] = useState(false);


  const [email,setEmail] = useState("");
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [phone,setPhone] = useState("")


  const uiData = {
    fr: [
      {
        h1: "Bon retour !",
        p: "Entrez vos identifiants pour vous connecter",
        username: false,
        button: "Se connecter",
      },
      {
        h1: "Créer un compte !",
        p: "Entrez vos informations pour vous inscrire",
        username: true,
        button: "S'inscrire",
      },
    ],
    us: [
      {
        h1: "Welcome back!",
        p: "Enter your credentials to log in",
        username: false,
        button: "Log in",
      },
      {
        h1: "Create an account!",
        p: "Enter your information to sign up",
        username: true,
        button: "Sign up",
      },
    ],
  };

  const welcomeContent = {
    fr: {
      welcome: "Bienvenue sur TipInvest !",
      chooseOption: "Choisissez une option pour continuer",
      continueWithEmail: "Continuer avec Email",
      or: "OU",
      loginToAccount: "Se connecter à votre compte",
      privacyPolicy: "Politique de confidentialité",
      termsOfUse: "Conditions d'utilisation",
      confirmText:
        "En choisissant une méthode de connexion, je confirme avoir lu et compris la",
    },
    us: {
      welcome: "Welcome to TipInvest!",
      chooseOption: "Choose an option to continue",
      continueWithEmail: "Continue with Email",
      or: "OR",
      loginToAccount: "Log in to your account",
      privacyPolicy: "Privacy Policy",
      termsOfUse: "Terms of Use",
      confirmText:
        "By choosing a login method, I confirm that I have read and understood the",
    },
  };

  const next = () => {
    setPos((prev) => (prev + 1 > 1 ? 1 : prev + 1));
  };

  const back = () => {
    setPos((prev) => (prev - 1 < 0 ? 0 : prev - 1));
  };

  const toLogin = () => {
    setIsLogin(true);
    next();
  };

  const toSignup = () => {
    setIsLogin(false);
    next();
  };
  const router = useRouter();
  const submit = () => {
    
    const data = isLogin? {email,password}:{email,"name":username,password,phone};

    console.log(data);
    setLoginFetching(true);

    useFetch.post("/auth" + (isLogin ? "/login" : "/register"),data)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      })
      .then((respData) => {
        setLoginFetching(false);
        console.log("Success:", respData);
        saveToken(respData.token);
        router.push("/client");
      })
      .catch((err) => {
        setLoginFetching(false);
        console.error("Error:", err);
      });
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <main
      className={authshow ? "show" : "hide"}
      onClick={() => {
        setAuthShow(false);
        isShowing.set(false);
      }}
    >
      <div className="panel" onClick={stopPropagation}>
        <div
          className="content"
          style={{ "--pos": pos } as React.CSSProperties}
        >
          <div className="welcome">
            <h1>{welcomeContent[userLang].welcome}</h1>
            <p>{welcomeContent[userLang].chooseOption}</p>

            <button onClick={toSignup}>
              {welcomeContent[userLang].continueWithEmail}
            </button>
            <div className="po">{welcomeContent[userLang].or}</div>
            <button onClick={toLogin}>
              {welcomeContent[userLang].loginToAccount}
            </button>
            <div className="law">
              {welcomeContent[userLang].confirmText}{" "}
              <a href="/">{welcomeContent[userLang].privacyPolicy}</a> ainsi que
              les <a href="/">{welcomeContent[userLang].termsOfUse}</a>
            </div>
          </div>
          <div className="inputs">
            <div className="back" onClick={back}>
              ← Back
            </div>
            <h1>{isLogin ? uiData[userLang][0].h1 : uiData[userLang][1].h1}</h1>
            <p>{isLogin ? uiData[userLang][0].p : uiData[userLang][1].p}</p>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
            />
            {(isLogin ? uiData[userLang][0].username : uiData[userLang][1].username) && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Input
                  type="username"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={setUsername}
                />
                <InputPhone
                  placeholder="Téléphone"
                  value={phone}
                  onChange={setPhone}
                />
              </div>
            )}
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={setPassword}
            />
            <button style={{ marginTop: "10px" }} onClick={submit}>
              {!loginFetching ? (
                isLogin ? (
                  uiData[userLang][0].button
                ) : (
                  uiData[userLang][1].button
                )
              ) : (
                <span style={{ animation: "spin 1s linear infinite" }}>
                  <CircleDashedIcon />
                </span>
              )}
            </button>
            <div className="law">
              By clicking Sign Up, you agree to our{" "}
              <a href="/">Terms of Service</a> and{" "}
              <a href="/">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .bg {
          background: black;
          background-size: cover;
          width: 50%;
          height: 100%;
          display: block;
        }
        main {
          font-family: "Figtree";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(5px);
          z-index: 1000000;
          transition: 0.3s all;
        }
        .panel {
          width: 70%;
          height: 80%;
          --color: rgba(114, 114, 114, 0.03);
          background-color: #ffffff;
          background-image: linear-gradient(
              0deg,
              transparent 24%,
              var(--color) 25%,
              var(--color) 26%,
              transparent 27%,
              transparent 74%,
              var(--color) 75%,
              var(--color) 76%,
              transparent 77%,
              transparent
            ),
            linear-gradient(
              90deg,
              transparent 24%,
              var(--color) 25%,
              var(--color) 26%,
              transparent 27%,
              transparent 74%,
              var(--color) 75%,
              var(--color) 76%,
              transparent 77%,
              transparent
            );
          background-size: 50px 50px;
          border-radius: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1rem;
          transition: 0.2s all;
          overflow: hidden;
        }
        .content {
          --pos: 0;
          width: 360px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          flex-direction: row;
          justify-content: start;
          overflow: hidden;
          align-items: center;
          gap: 10px;
        }
        .content > * {
          width: 100%;
          min-width: 350px;
          height: 50%;
          transition: 0.5s all;
          transform: translateX(calc(var(--pos) * -101%));
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.6rem;
          opacity: calc(1 + var(--pos));
        }
        h1 {
          font-size: 1.5rem;
          color: #333;
          font-family: Milk;
        }
        p {
          margin-top: -10px;
          margin-bottom: 10px;
          font-size: 0.9rem;
          color: #6e6e6e;
          font-family: Figtree;
        }
        .po {
          opacity: 0.7;
          font-size: 0.7rem;
          width: 100%;
          text-align: center;
        }
        button {
          width: 100%;
          min-height: 40px;
          background-color: #000;
          color: #fff;
          border: none;
          border-radius: 5px;
          font-size: 0.8rem;
          font-family: Figtree;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        .law {
          margin-top: 10px;
          opacity: 0.7;
          font-family: Figtree;
          font-size: 0.75rem;
        }
        .law a {
          color: #6e9900;
          text-decoration: none;
          font-weight: 600;
        }
        .back {
          cursor: pointer;
        }
        .show {
          opacity: 1;
          pointer-events: all;
        }
        .hide {
          opacity: 0;
          pointer-events: none;
        }
        .hide .panel {
          transform: translateY(200%);
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @media (max-width: 1600px) {
          .bg {
            display: none;
          }
        }
        @media (max-width: 768px) {
          .panel {
            width: calc(100% - 20px);
            height: 60vh;
            padding: 20px;
            box-sizing: border-box;
          }
          .content {
            scale: 0.95;
            box-sizing: border-box;
            width: 75vw;
            gap: 3px;
          }
          .content > * {
            min-width: calc(75vw);
          }
          h1 {
            font-size: 1.4rem;
            white-space: nowrap;
            overflow: hidden;
          }
          p {
            font-size: 0.8rem;
          }
          button {
            padding: 10px;
          }
          .law {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </main>
  );
};

export default LoginPage;
