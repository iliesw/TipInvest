/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable import/no-anonymous-default-export */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// eslint-disable-next-line react/display-name
export default () => {
    const testimonials = [
        {
            avatar: "https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg",
            name: "Martin Escobar",
            title: "Investisseur immobilier",
            quote: "Cette plateforme a rendu l'investissement immobilier sans effort. J'ai trouvé des propriétés à haut rendement plus rapidement que jamais, et la conclusion des transactions a été un jeu d'enfant !"
        },
        {
            avatar: "https://randomuser.me/api/portraits/women/79.jpg",
            name: "Angela Stian",
            title: "Acheteur de maison",
            quote: "J'ai trouvé la maison de mes rêves en quelques clics. Les outils de recherche et les réponses instantanées des agents ont rendu mon expérience fluide et sans stress !"
        },
        {
            avatar: "https://randomuser.me/api/portraits/men/86.jpg",
            name: "Karim Ahmed",
            title: "Agent immobilier",
            quote: "Cette plateforme m'a aidé à me connecter avec des acheteurs sérieux plus rapidement que toute autre. Mes annonces bénéficient d'une grande visibilité, et les transactions se concluent rapidement !"
        },
    ];
    

    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <section className="py-14">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <h3 className="text-lime-600 font-semibold pb-6">Ce que disent les gens</h3>
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
                                            “{testimonials[currentTestimonial].quote}“
                                        </p>
                                    </blockquote>
                                    <div className="mt-6">
                                        <img src={testimonials[currentTestimonial].avatar} className="w-16 h-16 mx-auto rounded-full" />
                                        <div className="mt-3">
                                            <span className="block text-gray-800 font-semibold">{testimonials[currentTestimonial].name}</span>
                                            <span className="block text-gray-600 text-sm mt-0.5">{testimonials[currentTestimonial].title}</span>
                                        </div>
                                    </div>
                                </figure>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
                <div className="mt-12">
                    <ul className="flex gap-x-3 justify-center">
                        {testimonials.map((_, idx) => (
                            <li key={idx}>
                                <button className={`w-2.5 h-2.5 rounded-full duration-150 ring-offset-2 ring-lime-600 focus:ring ${currentTestimonial === idx ? "bg-lime-600" : "bg-gray-300"}`}
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