/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable import/no-anonymous-default-export */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SelectedLang } from "@/stores/lang";
type Lang = 'fr' | 'us';

// eslint-disable-next-line react/display-name
export default () => {
  const testimonials = {
    fr: [
      {
        avatar: "https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg",
        name: "Martin Escobar",
        title: "Investisseur immobilier",
        quote:
          "Cette plateforme a rendu l'investissement immobilier sans effort. J'ai trouvé des propriétés à haut rendement plus rapidement que jamais, et la conclusion des transactions a été un jeu d'enfant !",
      },
      {
        avatar: "https://randomuser.me/api/portraits/women/79.jpg",
        name: "Angela Stian",
        title: "Acheteur de maison",
        quote:
          "J'ai trouvé la maison de mes rêves en quelques clics. Les outils de recherche et les réponses instantanées des agents ont rendu mon expérience fluide et sans stress !",
      },
      {
        avatar: "https://randomuser.me/api/portraits/men/86.jpg",
        name: "Karim Ahmed",
        title: "Agent immobilier",
        quote:
          "Cette plateforme m'a aidé à me connecter avec des acheteurs sérieux plus rapidement que toute autre. Mes annonces bénéficient d'une grande visibilité, et les transactions se concluent rapidement !",
      },
    ],
    us: [
      {
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        name: "John Carter",
        title: "Real Estate Investor",
        quote:
          "This platform made real estate investing effortless. I found high-yield properties faster than ever, and closing deals was a breeze!",
      },
      {
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        name: "Samantha Green",
        title: "Home Buyer",
        quote:
          "I found my dream home in just a few clicks. The search tools and instant responses from agents made my experience smooth and stress-free!",
      },
      {
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        name: "Michael Johnson",
        title: "Real Estate Agent",
        quote:
          "This platform connected me with serious buyers faster than any other. My listings get great visibility, and deals close quickly!",
      },
    ],
  };

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
            useEffect(() => {
              SelectedLang.subscribe((n) => {
                setUserLang(n as Lang);
              });
            }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.fr.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.fr.length]);

  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center mb-32 lg:mb-0">
          <h3 className="text-lime-600 font-semibold pb-6">
            Ce que disent les gens
          </h3>
          <div className="relative h-48">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
                className="absolute w-full"
              >
                <figure>
                  <blockquote>
                    <p className="text-gray-800 text-xl font-semibold sm:text-2xl">
                      “{testimonials[userLang][currentTestimonial].quote}“
                    </p>
                  </blockquote>
                  <div className="mt-6">
                    <img
                      src={testimonials[userLang][currentTestimonial].avatar}
                      className="w-16 h-16 mx-auto rounded-full"
                    />
                    <div className="mt-3">
                      <span className="block text-gray-800 font-semibold">
                        {testimonials[userLang][currentTestimonial].name}
                      </span>
                      <span className="block text-gray-600 text-sm mt-0.5">
                        {testimonials[userLang][currentTestimonial].title}
                      </span>
                    </div>
                  </div>
                </figure>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-12 hidden lg:block">
          <ul className="flex gap-x-3 justify-center">
            {testimonials.fr.map((_, idx) => (
              <li key={idx}>
                <button
                  className={`w-2.5 h-2.5 rounded-full duration-150 ring-offset-2 ring-lime-600 focus:ring ${
                    currentTestimonial === idx ? "bg-lime-600" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentTestimonial(idx)}
                ></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
