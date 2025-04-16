import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";
import Logo from "../Shared/Logo";
import { SelectedLang } from "@/stores/lang";
import { useEffect, useState } from "react";

const Content = {
  us: {
    disc: "Stay ahead of the real estate game with TipInvest. Get expert analysis and insights on global real estate markets.",
    sections: [
      {
        title: "Product",
        links: [
          { name: "Overview", href: "#" },
          { name: "Pricing", href: "#" },
          { name: "Market", href: "#" },
          { name: "Features", href: "#" },
        ],
      },
      {
        title: "Company",
        links: [
          { name: "About", href: "#" },
          { name: "Team", href: "#" },
          { name: "Blog", href: "#" },
          { name: "Careers", href: "#" },
        ],
      },
      {
        title: "Resources",
        links: [
          { name: "Aide", href: "#" },
          { name: "Ventes", href: "#" },
          { name: "Publicité", href: "#" },
          { name: "Confidentialité", href: "#" },
        ],
      },
    ] ,
    cc: "© 2025 Tip Invest. All rights reserved.",
    cs: "Terms and Conditions",
    pp: "Privacy Policy"
  },
  fr:{
    disc:"Restez en tête du jeu immobilier avec TipInvest. Obtenez des analyses et des informations d&apos;experts sur les marchés immobiliers mondiaux.",
    sections : [
      {
        title: "Produit",
        links: [
          { name: "Aperçu", href: "#" },
          { name: "Tarification", href: "#" },
          { name: "Marché", href: "#" },
          { name: "Fonctionnalités", href: "#" },
        ],
      },
      {
        title: "Entreprise",
        links: [
          { name: "À propos", href: "#" },
          { name: "Équipe", href: "#" },
          { name: "Blog", href: "#" },
          { name: "Carrières", href: "#" },
        ],
      },
      {
        title: "Ressources",
        links: [
          { name: "Aide", href: "#" },
          { name: "Ventes", href: "#" },
          { name: "Publicité", href: "#" },
          { name: "Confidentialité", href: "#" },
        ],
      },
    ] ,
    cc:"© 2025 Tip Invest. Tous droits réservés.",
    cs:"Conditions générales",
    pp:"Politique de confidentialité"
  }
}


const socialMediaLinks = [
  { name: "@tipinvest", href: "https://www.linkedin.com/company/tips-invest", icon: FaLinkedin, bgColor: "bg-blue-400" },
  { name: "@tipinvest", href: "https://www.facebook.com/profile.php?id=61557572841502", icon: FaFacebook, bgColor: "bg-blue-600" },
  { name: "@tipinvest", href: "#", icon: FaYoutube, bgColor: "bg-red-500" },
];
type Lang = 'fr' | 'us';

const Footer = () => {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
            useEffect(() => {
              SelectedLang.subscribe((n) => {
                setUserLang(n as Lang);
              });
            }, []);
  return (
    <section className="py-16 flex justify-center pt-16 mt-10">
      <div className="container w-full lg:w-4/6">
        <footer className="w-full">
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              <div>
                <span className="flex items-center justify-center gap-4 lg:justify-start">
                  <Logo />
                </span>
                <p className="mt-6 text-sm text-muted-foreground">
                  {Content[userLang].disc}
                </p>
              </div>
              <ul className="flex items-center space-x-3 text-muted-foreground">
                {socialMediaLinks.map((link, idx) => (
                  <li key={idx} className="font-medium text-sm items-center flex gap-2 text-white rounded-full hover:text-primary">
                    <a href={link.href} aria-label={link.name} className={`flex items-center gap-2 ${link.bgColor} px-2 py-1 rounded-full`}>
                      <link.icon className="size-4" /> 
                    <p>{link.name}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-6 lg:gap-20">
              {Content[userLang].sections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-6 font-bold">{section.title}</h3>
                  <ul className="space-y-4 text-sm text-muted-foreground">
                    {section.links.map((link, linkIdx) => (
                      <li
                        key={linkIdx}
                        className="font-medium hover:text-primary"
                      >
                        <a href={link.href}>{link.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 flex flex-col justify-between gap-4 border-t pt-8 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left">
            <p>{Content[userLang].cc}</p>
            <ul className="flex justify-center gap-4 lg:justify-start">
              <li className="hover:text-primary">
                <a href="#"> {Content[userLang].cs}</a>
              </li>
              <li className="hover:text-primary">
                <a href="#"> {Content[userLang].pp}</a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
