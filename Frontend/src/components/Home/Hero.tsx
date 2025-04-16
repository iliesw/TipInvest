/* eslint-disable @next/next/no-html-link-for-pages */
import { SelectedLang } from "@/stores/lang";
import { useEffect, useState } from "react";

export default function Example() {
  const [userLang, setUserLang] = useState<string>(SelectedLang.get());

  useEffect(() => {
    SelectedLang.subscribe((n) => {
      setUserLang(n);
    });
  }, []);

  const Content = {
    fr: {
      quick_presentation: "Présentation rapide de Tips Invest et de ses avantages.",
      read_more: "Read more",
      invest_today1: "Investissez dans l’immobilier",
      invest_today2: "de demain, dès aujourd’hui!",
      invest_with_tipinvest: "Investissez dès aujourd’hui dans l’immobilier de demain avec TipInvest.",
      discover_opportunities: "Découvrez nos opportunités",
    },
    us: {
      quick_presentation: "Quick presentation of Tips Invest and its advantages.",
      read_more: "Read more",
      invest_today1: "Invest today in Your ",
      invest_today2: "Dream Home",
      invest_with_tipinvest: "Invest in the real estate of tomorrow with TipInvest today.",
      discover_opportunities: "Discover our opportunities",
    },
  };

  return (
    <div className="relative z-50 overflow-hidden">
      <div className="relative isolate px-6 lg:px-8">
        {/* Background Gradient Animation */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu animate-bg-shift overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            className="relative left-[50%] w-[36.125rem] sm:w-[72.1875rem] -translate-x-1/2 rotate-[30deg] opacity-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
            style={{
              clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl py-12 text-center">
          {/* <div className="hidden sm:flex sm:justify-center">
            <div className="relative rounded-full px-4 py-2 text-sm text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 transition-all animate-fade-in">
              {Content[userLang as keyof typeof Content].quick_presentation}.{" "}
              <a href="/service" className="font-semibold text-cyan hover:text-blue-600 transition-all">
                {Content[userLang as keyof typeof Content].read_more} <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div> */}

          {/* Title with Glow Effect */}
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl animate-slide-up relative flex flex-col gap-2">
            <span className="">
              {Content[userLang as keyof typeof Content].invest_today1}
            </span>
            <span className="text-lime-600">
              {Content[userLang as keyof typeof Content].invest_today2}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-md text-gray-500 animate-fade-in ">
            {Content[userLang as keyof typeof Content].invest_with_tipinvest}
          </p>

          {/* Call to Action Button */}
          <div className="mt-8 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 animate-bounce-in"
            >
              {Content[userLang as keyof typeof Content].discover_opportunities}
            </a>
          </div>
        </div>

        {/* Bottom Animated Background */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] animate-bg-shift"
        >
          <div
            className="relative left-[50%] w-[36.125rem] sm:w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            style={{
              clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>

        {/* Featured Properties Section */}
      </div>

      {/* Custom Styles & Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }

        @keyframes bgShift {
          0% { transform: rotate(30deg) scale(1); }
          50% { transform: rotate(30deg) scale(1.1); }
          100% { transform: rotate(30deg) scale(1); }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-in-out forwards;
        }

        .animate-slide-up {
          animation: slideUp 1s ease-in-out forwards;
        }

        .animate-bounce-in {
          animation: bounceIn 0.8s ease-out forwards;
        }

        .animate-bg-shift {
          animation: bgShift 6s infinite alternate ease-in-out;
        }

        .glow-text {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
}
