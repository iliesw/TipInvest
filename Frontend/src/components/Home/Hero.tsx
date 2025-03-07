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
  const Content: { [key: string]: { quick_presentation: string; read_more: string; invest_today1: string;invest_today2: string; invest_with_tipinvest: string; discover_opportunities: string; } } = {
    fr: {
      quick_presentation:
        "Présentation rapide de Tips Invest et de ses avantages.",
      read_more: "Read more",
      invest_today1: "Investissez dans l’immobilier",
      invest_today2: "de demain, dès aujourd’hui!",
      invest_with_tipinvest:
        "Investissez dès aujourd’hui dans l’immobilier de demain avec TipInvest.",
      discover_opportunities: "Découvrez nos opportunités",
    },
    us: {
      quick_presentation:
        "Quick presentation of Tips Invest and its advantages.",
      read_more: "Read more",
      invest_today1: "Invest in the real estate",
      invest_today2: "of tomorrow, today!",
      invest_with_tipinvest:
        "Invest in the real estate of tomorrow with TipInvest today.",
      discover_opportunities: "Discover our opportunities",
    },
  };

  return (
    <div className=" relative z-50">
      <div className="relative isolate px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-1xl py-10">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              {Content[userLang as keyof typeof Content].quick_presentation}.{" "}
              <a href="/service" className="font-semibold text-cyan">
                <span aria-hidden="true" className="absolute inset-0" />
                {Content[userLang as keyof typeof Content].read_more} <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1
              className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl z-50 relative"
              style={{ filter: "drop-shadow(0px 0px 5px white)" }}
            >
              {Content[userLang as keyof typeof Content].invest_today1}<br/>{Content[userLang as keyof typeof Content].invest_today2}
            </h1>
            <p className="mt-8 text-md font-medium text-pretty text-gray-500">
            {Content[userLang as keyof typeof Content].invest_with_tipinvest}
            </p>
            <div className="mt-5 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-full bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                {Content[userLang as keyof typeof Content].discover_opportunities}
              </a>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
  );
}
