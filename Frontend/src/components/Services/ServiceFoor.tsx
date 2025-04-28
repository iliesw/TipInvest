"use client";
import {
  BuildingLibraryIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { ClipboardListIcon } from "lucide-react";
import { SelectedLang } from "@/stores/lang";
import { useEffect, useState } from "react";
type Lang = "fr" | "us";

const features = {
  fr: [
    {
      name: "Accès au Catalogue de Fournitures",
      description:
        "Profitez d'un accès exclusif à un large catalogue de fournitures avec des prix négociés.",
      icon: ShoppingBagIcon,
    },
    {
      name: "Mise en Relation avec des Chantiers",
      description:
        "Connectez-vous à un réseau dynamique d'opportunités sur des chantiers et dans le marché.",
      icon: BuildingLibraryIcon,
    },
    {
      name: "Outils de Gestion de Projet et CRM",
      description:
        "Gérez efficacement vos projets avec nos outils spécialisés en gestion de projet et notre système CRM robuste.",
      icon: ClipboardListIcon,
    },
  ],
  us: [
    {
      name: "Access to Supplies Catalog",
      description:
        "Get exclusive access to a wide range of supplies with negotiated prices.",
      icon: ShoppingBagIcon,
    },
    {
      name: "Connect with Job Sites",
      description:
        "Connect with a dynamic network of opportunities on job sites and in the market.",
      icon: BuildingLibraryIcon,
    },
    {
      name: "Project Management Tools and CRM",
      description:
        "Efficiently manage your projects with our specialized project management tools and robust CRM system.",
      icon: ClipboardListIcon,
    },
  ],
};

const Titles = {
  fr: {
    title: "Déployez plus rapidement",
    subtitle: "Tout ce dont vous avez besoin pour déployer votre application",
  },
  us: {
    title: "Everything you need",
    subtitle: "Everything you need in one place to invest ",
  },
};
export default function ServiceFoor() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
  useEffect(() => {
    SelectedLang.subscribe((n) => {
      setUserLang(n as Lang);
    });
  }, []);
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto w-full sm:w-2/3 px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-lime-600">
            {Titles[userLang].title}
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
            {Titles[userLang].subtitle}
          </p>
        </div>
        <div className="flex mt-20 gap-8 items-center">
          <div className="w-full">
            <dl className="flex flex-col gap-x-8 gap-y-10  lg:grid-cols-2 lg:gap-y-8">
              {features[userLang].map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base/7 font-semibold text-gray-900">
                    <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg ">
                      <feature.icon
                        aria-hidden="true"
                        className="size-6 text-lime-600"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2  text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="w-full min-h-[400px] bg-black rounded-xl hidden sm:block"></div>
        </div>
      </div>
    </div>
  );
}
