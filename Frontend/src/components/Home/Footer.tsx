import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Logo from "../Shared/Logo";

const sections = [
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
];

const Footer = () => {
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
                  Restez en tête du jeu immobilier avec TipInvest. Obtenez des analyses et des informations d&apos;experts sur les marchés immobiliers mondiaux.
                </p>
              </div>
              <ul className="flex items-center space-x-6 text-muted-foreground">
                <li className="font-medium hover:text-primary">
                  <a href="#">
                    <FaInstagram className="size-6" />
                  </a>
                </li>
                <li className="font-medium hover:text-primary">
                  <a href="#">
                    <FaFacebook className="size-6" />
                  </a>
                </li>
                <li className="font-medium hover:text-primary">
                  <a href="#">
                    <FaTwitter className="size-6" />
                  </a>
                </li>
                <li className="font-medium hover:text-primary">
                  <a href="#">
                    <FaLinkedin className="size-6" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-6 lg:gap-20">
              {sections.map((section, sectionIdx) => (
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
            <p>© 2025 Tip Invest. Tous droits réservés.</p>
            <ul className="flex justify-center gap-4 lg:justify-start">
              <li className="hover:text-primary">
                <a href="#"> Conditions générales</a>
              </li>
              <li className="hover:text-primary">
                <a href="#"> Politique de confidentialité</a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
