const pricingData = {
    title: "Investissez avec confiance, maximisez vos rendements",
    description:
        "Chez TipInvest, nous mettons la puissance des données et de l'IA entre vos mains pour vous aider à prendre des décisions d'investissement intelligentes et rentables. Que vous soyez un investisseur indépendant, un trader actif ou une institution financière, nous avons l'offre parfaite pour vous.",
    plans: [
        {
            name: "Essentiel",
            price: "$29",
            period: "/month",
            description:
                "Parfait pour les investisseurs qui veulent des outils fiables sans complexité.",
            features: [
                "Analyse en temps réel des tendances du marché",
                "Accès aux données financières clés",
                "Tableau de bord intuitif pour suivre vos investissements",
                "Support standard par email",
                "Mises à jour gratuites",
            ],
        },
        {
            name: "Avancé ",
            price: "$149",
            period: "/month",
            description:
                "Pour les investisseurs expérimentés cherchant à affiner leur stratégie.",
            features: [
                "Toutes les fonctionnalités de l'offre Essentiel",
                "Prédictions IA pour anticiper les tendances",
                "Rapports avancés et tableaux de bord interactifs",
                "Alertes personnalisées pour ne jamais rater une opportunité",
                "Support prioritaire",
            ],
        },
        {
            name: "Élite",
            price: "$599",
            period: "/month",
            description:
                "Pensé pour les fonds d’investissement, institutions et traders experts.",
            features: [
                "Tout ce qui est inclus dans Avancé",
                "Stratégies d'investissement sur-mesure propulsées par l’IA",
                "Accès à des données exclusives et analyses approfondies",
                "Intégration directe avec vos outils de trading",
                "Gestionnaire de compte dédié",
            ],
        },
    ],
};

export default function Prices() {
    return (
        <section className="bg-white">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-lg text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 ">
                        {pricingData.title}
                    </h2>
                    <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
                        {pricingData.description}
                    </p>
                </div>
                <div className="space-y-8  lg:grid lg:grid-cols-3 sm:gap-3 xl:gap-5 lg:space-y-0">
                    {pricingData.plans.map((plan, index) => (
                        <div
                            key={index}
                            className="flex flex-col p-6 mx-auto max-w-lg text-center bg-white rounded-3xl border border-gray-100 shadow xl:p-8 "
                        >
                            <h3 className="mb-4 text-2xl font-semibold">{plan.name}</h3>
                            <p className="font-light text-gray-500 sm:text-lg ">
                                {plan.description}
                            </p>
                            <div className="flex justify-center items-baseline my-8">
                                <span className="mr-2 text-5xl font-extrabold">{plan.price}</span>
                                <span className="text-gray-500 ">{plan.period}</span>
                            </div>
                            <ul role="list" className="mb-8 space-y-4 text-left">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center space-x-3 text-sm">
                                        <svg
                                            className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="#"
                                className="text-white bg-black hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                            >
                                Commencer
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
