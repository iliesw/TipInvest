/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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

type Lang = "fr" | "us";

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

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    phone: "",
    accountType: "user",
    specialization: "",
    bio: "",
    hourlyRate: "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const submit = () => {
    setErrorMessage("");
    setSuccessMessage("");

    // Validate form before submission
    const validationError = validateForm(
      formData,
      isLogin,
      userLang,
      errorMessages
    );
    if (validationError) {
      setErrorMessage(validationError);
      setTimeout(() => {
        setErrorMessage(""); 
      }, 3000);
      return;
    }

    // Prepare data based on login or registration
    let data;
    const {
      email,
      password,
      username,
      phone,
      accountType,
      specialization,
      bio,
      hourlyRate,
    } = formData;

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
        // @ts-ignore
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
          setIsLogin(true);
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


  return (
    <main
      className={`fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[1000000] transition-all duration-300 ${
        authshow ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => {
        setAuthShow(false);
        isShowing.set(false);
      }}
    >
      <div
        className={`w-[70%] h-[80%] bg-white bg-[length:50px_50px] bg-[linear-gradient(0deg,transparent_24%,rgba(114,114,114,0.03)_25%,rgba(114,114,114,0.03)_26%,transparent_27%,transparent_74%,rgba(114,114,114,0.03)_75%,rgba(114,114,114,0.03)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(114,114,114,0.03)_25%,rgba(114,114,114,0.03)_26%,transparent_27%,transparent_74%,rgba(114,114,114,0.03)_75%,rgba(114,114,114,0.03)_76%,transparent_77%,transparent)] rounded-lg flex flex-row items-center gap-4 transition-all duration-200 overflow-hidden`}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="w-[360px] mx-auto h-full flex flex-row justify-start overflow-hidden items-center gap-2.5">
          <div
            className={`w-full min-w-[350px] h-1/2 transition-all duration-500 transform ${
              pos === 0 ? "translate-x-0" : "-translate-x-full"
            } flex flex-col justify-center gap-2.5 `}
          >
            <h1 className="text-2xl text-[#333] font-milk">
              {welcomeContent[userLang].welcome}
            </h1>
            <p className="text-sm text-[#6e6e6e] font-figtree">
              {welcomeContent[userLang].chooseOption}
            </p>

            <button
              onClick={toSignup}
              className="w-full min-h-[40px] bg-black text-white rounded font-figtree text-sm flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {welcomeContent[userLang].continueWithEmail}
            </button>
            <div className="opacity-70 text-xs w-full text-center">
              {welcomeContent[userLang].or}
            </div>
            <button
              onClick={toLogin}
              className="w-full min-h-[40px] bg-black text-white rounded font-figtree text-sm flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {welcomeContent[userLang].loginToAccount}
            </button>
            <div className="text-[10px] opacity-70">
              {welcomeContent[userLang].confirmText}{" "}
              <a href="/" className="text-lime-600 hover:underline">
                {welcomeContent[userLang].privacyPolicy}
              </a>{" "}
              ainsi que les{" "}
              <a href="/" className="text-lime-600 hover:underline">
                {welcomeContent[userLang].termsOfUse}
              </a>
            </div>
          </div>
          <div
            className={`w-full min-w-[350px] h-1/2 transition-all duration-500 transform ${
              pos === 0 ? "translate-x-0" : "-translate-x-full"
            } flex flex-col justify-center gap-2.5`}
          >
            <div className="cursor-pointer" onClick={back}>
              ← Back
            </div>
            <h1 className="text-2xl text-[#333] font-milk">
              {isLogin ? uiData[userLang][0].h1 : uiData[userLang][1].h1}
            </h1>
            <p className="text-sm text-[#6e6e6e] font-figtree">
              {isLogin ? uiData[userLang][0].p : uiData[userLang][1].p}
            </p>

            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-2.5 mb-2.5 rounded">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 text-green-600 p-2.5 mb-2.5 rounded">
                {successMessage}
              </div>
            )}

            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(value: string) => handleInputChange("email", value)}
            />

            {(isLogin
              ? uiData[userLang][0].username
              : uiData[userLang][1].username) && (
              <div className="flex flex-col gap-2.5">
                <Input
                  type="username"
                  placeholder="Nom d'utilisateur"
                  value={formData.username}
                  onChange={(value: string) =>
                    handleInputChange("username", value)
                  }
                />
                <InputPhone
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={(value: string) =>
                    handleInputChange("phone", value)
                  }
                />
              </div>
            )}
            <Input
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(value: string) => handleInputChange("password", value)}
              passwordStrength={!isLogin}
            />
            {!isLogin && (
              <div className="flex flex-col gap-2.5">
                <select
                  value={formData.accountType}
                  onChange={(e) =>
                    handleInputChange("accountType", e.target.value)
                  }
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition-all"
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

                {formData.accountType === "expert" && (
                  <div className="mt-2.5">
                    <h3 className="text-sm font-semibold mb-2.5 text-[#333]">
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
                      value={formData.specialization || ""}
                      onChange={(value: string) =>
                        handleInputChange("specialization", value)
                      }
                    />
                  </div>
                )}
              </div>
            )}
            <button
              className="w-full min-h-[40px] bg-black text-white rounded font-figtree text-sm flex items-center justify-center gap-2.5 cursor-pointer mt-2.5"
              onClick={submit}
            >
              {!loginFetching ? (
                isLogin ? (
                  uiData[userLang][0].button
                ) : (
                  uiData[userLang][1].button
                )
              ) : (
                <span className="animate-spin">
                  <CircleDashedIcon />
                </span>
              )}
            </button>
            <div className="text-[10px] opacity-70">
              By clicking Sign Up, you agree to our{" "}
              <a href="/" className="text-black hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/" className="text-black hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// Helper function for form validation
const validateForm = (
  formData: any,
  isLogin: boolean,
  userLang: Lang,
  errorMessages: any
): string | null => {
  const { email, password, username, phone, accountType, specialization } =
    formData;

  if (!email || !password) {
    return errorMessages[userLang].missingFields;
  }

  if (!isLogin && (!username || !phone)) {
    return errorMessages[userLang].missingFields;
  }

  // Validate only specialization field if registering as an expert
  if (!isLogin && accountType === "expert" && !specialization) {
    return userLang === "fr"
      ? "Veuillez remplir le champ de spécialisation."
      : "Please fill in the specialization field.";
  }

  return null; // No errors
};

export default LoginPage;
