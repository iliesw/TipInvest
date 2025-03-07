export default function Features() {
  const features = [
    {
      title: "Due diligence immobilière",
      description:
        "Vérification des documents légaux avant l’achat.",
      imgSrc: "/assets/images/docs.jpg", // Replace with actual path
    },
    {
      title: "Blockchain et digitalisation",
      description:
        "Garantir transparence et sécurité des transactions.",
      imgSrc: "/assets/images/chain.jpg", // Replace with actual path
    },
    {
      title: "Sécurisation des contrats",
      description:
        "Accompagnement dans la rédaction et la sécurisation des contrats immobiliers.",
      imgSrc: "/assets/images/contract.jpg", // Replace with actual path
    },
  ];

  return (
    <section className="py-16 text-center w-full px-4 mx-auto sm:w-2/3">
      <h3 className="text-lime-600 font-semibold">Sécurisation des Transactions</h3>
      <h2 className="text-3xl font-bold text-gray-900 mt-2">Notre Accompagnement Juridique</h2>
      <p className="text-gray-600 max-w-2xl mx-auto mt-2">
        Nous offrons un accompagnement complet pour assurer la sécurité et la transparence des transactions immobilières.
      </p>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-0">
        {features.map((feature, index) => (
          <div
            key={index}
            className=" rounded-2xl flex flex-col items-start"
          >
            <img src={feature.imgSrc} alt={feature.title} className="mx-auto h-[250px] min-h-50 w-full object-cover rounded-xl" />
            <h3 className="text-lg font-semibold text-gray-900 mt-4">{feature.title}</h3>
            <p className="text-gray-600 mt-2 w-fit text-start">{feature.description}</p>
            <a
              href="#"
              className="text-lime-600 font-semibold mt-4 inline-flex items-center"
            >
              En savoir plus <span className="ml-2">→</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
