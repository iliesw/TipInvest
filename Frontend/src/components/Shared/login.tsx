/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import Input from "./ui/Input";
import InputPhone from "./ui/InputPhone";
import { CircleDashedIcon } from "lucide-react";
import { isShowing } from "@/stores/isAuthVisible";
import { SelectedLang } from "@/stores/lang";
import useFetch, { Server } from "./../../lib/fetch";
import { useRouter } from "next/router";
import { saveToken } from "@/pages/api/set-cookie";
import { decodeToken } from "@/lib/auth";

type Lang = "fr" | "us";

const LoginPage: React.FC = () => {
  const [authshow, setAuthShow] = useState(isShowing.get());
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

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

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [accountType, setAccountType] = useState("user");

  // Expert-specific fields
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  // Error messages for different languages
  const errorMessages = {
    fr: {
      userExists: "Cet utilisateur existe déjà. Veuillez vous connecter.",
      invalidCredentials: "Email ou mot de passe incorrect.",
      missingFields: "Veuillez remplir tous les champs requis.",
      serverError: "Une erreur est survenue. Veuillez réessayer plus tard.",
      emailNotVerified:
        "Veuillez vérifier votre email avant de vous connecter. Vérifiez votre boîte de réception pour le lien de vérification.",
    },
    us: {
      userExists: "This user already exists. Please log in instead.",
      invalidCredentials: "Invalid email or password.",
      missingFields: "Please fill in all required fields.",
      serverError: "An error occurred. Please try again later.",
      emailNotVerified:
        "Please verify your email before logging in. Check your inbox for the verification link.",
    },
  };

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
    setErrorMessage(""); // Clear error messages when navigating
    setSuccessMessage(""); // Clear success messages when navigating
    setPos((prev) => (prev + 1 > 1 ? 1 : prev + 1));
  };

  const back = () => {
    setErrorMessage(""); // Clear error messages when navigating
    setSuccessMessage(""); // Clear success messages when navigating
    setPos((prev) => (prev - 1 < 0 ? 0 : prev - 1));
  };

  const toLogin = () => {
    setErrorMessage(""); // Clear error messages when switching modes
    setSuccessMessage(""); // Clear success messages when switching modes
    setIsLogin(true);
    next();
  };

  const toSignup = () => {
    setErrorMessage(""); // Clear error messages when switching modes
    setSuccessMessage(""); // Clear success messages when switching modes
    setIsLogin(false);
    next();
  };
  const router = useRouter();

  const validateForm = (): boolean => {
    if (!email || !password) {
      setErrorMessage(errorMessages[userLang].missingFields);
      return false;
    }

    if (!isLogin && (!username || !phone)) {
      setErrorMessage(errorMessages[userLang].missingFields);
      return false;
    }

    // Validate only specialization field if registering as an expert
    if (!isLogin && accountType === "expert" && !specialization) {
      setErrorMessage(
        userLang === "fr"
          ? "Veuillez remplir le champ de spécialisation."
          : "Please fill in the specialization field."
      );
      return false;
    }

    return true;
  };

  const submit = () => {
    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Prepare data based on login or registration
    let data;

    if (isLogin) {
      data = { email, password };
    } else {
      data = {
        email,
        name: username,
        password,
        phone,
        role: accountType,
      };

      // Add expert-specific fields if registering as an expert
      if (accountType === "expert" && specialization) {
        // Use default values for bio and hourlyRate if not provided
        const defaultBio = userLang === "fr" ? `` : ``;

        const defaultHourlyRate = 50; // Default hourly rate in euros

        data.expertProfile = {
          specialization,
          bio: bio || defaultBio,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : defaultHourlyRate,
        };
      }
    }

    console.log(data);
    setLoginFetching(true);

    useFetch
      .post("/auth" + (isLogin ? "/login" : "/register"), data)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          // Handle different HTTP error statuses
          if (res.status === 409) {
            throw new Error("USER_EXISTS");
          } else if (res.status === 401) {
            throw new Error("INVALID_CREDENTIALS");
          } else if (
            res.status === 403 &&
            res.statusText.includes("EMAIL_NOT_VERIFIED")
          ) {
            throw new Error("EMAIL_NOT_VERIFIED");
          } else {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
        }
      })
      .then((respData) => {
        setLoginFetching(false);
        console.log("Success:", respData);

        // Si c'est une inscription réussie, afficher un message de vérification d'email
        if (!isLogin && !respData.token) {
          setErrorMessage("");
          setSuccessMessage(
            userLang === "fr"
              ? "Inscription réussie ! Veuillez vérifier votre email pour activer votre compte."
              : "Registration successful! Please check your email to activate your account."
          );
          return;
        }

        // Sinon, c'est une connexion réussie
        saveToken(respData.token);

        // Check user role from token and redirect accordingly
        try {
          const tokenData = respData.token.split(".")[1];
          const decodedData = JSON.parse(atob(tokenData));

          if (decodedData && decodedData.role === "admin") {
            router.push("/admin");
          } else if (decodedData && decodedData.role === "agency") {
            router.push("/agency");
          } else if (decodedData && decodedData.role === "expert") {
            router.push("/expert");
          } else {
            router.push("/client");
          }
        } catch (error) {
          console.error("Error parsing token:", error);
          router.push("/client"); // Default fallback
        }
      })
      .catch((err) => {
        setLoginFetching(false);
        console.error("Error:", err);

        // Set appropriate error message based on error type
        if (err.message === "USER_EXISTS") {
          setErrorMessage(errorMessages[userLang].userExists);
        } else if (err.message === "INVALID_CREDENTIALS") {
          setErrorMessage(errorMessages[userLang].invalidCredentials);
        } else if (err.message === "EMAIL_NOT_VERIFIED") {
          setErrorMessage(errorMessages[userLang].emailNotVerified);
        } else {
          setErrorMessage(errorMessages[userLang].serverError);
        }
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

            {/* Error message display */}
            {errorMessage && (
              <div
                className="error-message"
                style={{ color: "red", marginBottom: "10px" }}
              >
                {errorMessage}
              </div>
            )}

            {/* Success message display */}
            {successMessage && (
              <div
                className="success-message"
                style={{ color: "green", marginBottom: "10px" }}
              >
                {successMessage}
              </div>
            )}

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
            />

            {(isLogin
              ? uiData[userLang][0].username
              : uiData[userLang][1].username) && (
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
              passwordStrength={!isLogin}
            />
            {!isLogin && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="user">
                    {userLang === "fr" ? "Client" : "Client"}
                  </option>
                  <option value="agency">
                    {userLang === "fr" ? "Agence" : "Agency"}
                  </option>
                  <option value="expert">
                    {userLang === "fr" ? "Expert" : "Expert"}
                  </option>
                </select>

                {/* Show expert-specific fields when expert account type is selected */}
                {accountType === "expert" && (
                  <div style={{ marginTop: "10px" }}>
                    <h3
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        marginBottom: "10px",
                        color: "#333",
                      }}
                    >
                      {userLang === "fr"
                        ? "Informations d'expert"
                        : "Expert Information"}
                    </h3>

                    <Input
                      type="pro"
                      placeholder={
                        userLang === "fr"
                          ? "Spécialisation *"
                          : "Specialization *"
                      }
                      value={specialization || ""}
                      onChange={setSpecialization}
                      style={{
                        borderColor: specialization ? "#ddd" : "#ff6b6b",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
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

            {/* Resend verification link */}
            {errorMessage === errorMessages[userLang].emailNotVerified && (
              <button
                onClick={() => {
                  const userEmail = email;
                  fetch(`${Server}/auth/resend-verification`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: userEmail }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.success) {
                        setSuccessMessage(
                          userLang === "fr"
                            ? "Email de vérification renvoyé. Veuillez vérifier votre boîte de réception."
                            : "Verification email resent. Please check your inbox."
                        );
                        setErrorMessage("");
                      } else {
                        setErrorMessage(
                          data.message || errorMessages[userLang].serverError
                        );
                      }
                    })
                    .catch(() => {
                      setErrorMessage(errorMessages[userLang].serverError);
                    });
                }}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#f0f0f0",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {userLang === "fr"
                  ? "Renvoyer l'email de vérification"
                  : "Resend verification email"}
              </button>
            )}
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
        .error-message {
          background-color: #ffebee;
          color: #d32f2f;
          padding: 10px;
          border-radius: 5px;
          font-size: 0.8rem;
          margin-bottom: 10px;
          text-align: center;
          border: 1px solid #ffcdd2;
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
          .error-message {
            font-size: 0.7rem;
            padding: 8px;
          }
        }
      `}</style>
    </main>
  );
};

export default LoginPage;
