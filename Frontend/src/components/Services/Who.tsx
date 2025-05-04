export default function Who() {
    return (
        <div className="w-full sm:w-2/3 mx-auto flex flex-col space-y-8 px-4 py-16 sm:py-24 md:py-32">
            <h1 className="text-5xl font-bold  text-gray-800 mb-6">
                Qui sommes-nous ?
            </h1>
            <ul className="space-y-8 list-inside text-gray-700">
                <li className="leading-relaxed text-base sm:text-lg relative flex gap-4 sm:gap-6 flex-col sm:flex-row items-start sm:items-center">
                    <h1 className="text-4xl sm:text-6xl text-transparent font-black bg-clip-text bg-neutral-600 font-[Code] min-w-[2.5rem] sm:min-w-[3.5rem] text-center sm:text-left">1</h1>
                    Tips Invest est une plateforme innovante dédiée à l&lsquo;investissement immobilier à distance.
                    Nous réunissons une communauté d&lsquo;investisseurs, d&lsquo;experts immobiliers, de conseillers financiers et de partenaires stratégiques pour offrir une expérience d&lsquo;investissement simplifiée, sécurisée et optimisée.
                </li>
                <li className="leading-relaxed text-base sm:text-lg relative flex gap-4 sm:gap-6 flex-col sm:flex-row items-start sm:items-center">
                    <h1 className="text-4xl sm:text-6xl text-transparent font-black bg-clip-text bg-neutral-600 font-[Code] min-w-[2.5rem] sm:min-w-[3.5rem] text-center sm:text-left">2</h1>
                    Notre mission est de réduire les barrières géographiques et démocratiser l&lsquo;accès à des opportunités immobilières rentables, notamment pour les investisseurs résidant à l&lsquo;étranger.
                </li>
                <li className="leading-relaxed text-base sm:text-lg relative flex gap-4 sm:gap-6 flex-col sm:flex-row items-start sm:items-center">
                    <h1 className="text-4xl sm:text-6xl text-transparent font-black bg-clip-text bg-neutral-600 font-[Code] min-w-[2.5rem] sm:min-w-[3.5rem] text-center sm:text-left">3</h1>
                    Grâce à une technologie de pointe (visualisation 3D immersive, simulateurs financiers, accompagnement personnalisé), nous permettons à nos clients d&lsquo;investir à distance en toute confiance, avec un service clé en main allant de la sélection du bien jusqu&lsquo;à sa gestion locative.
                </li>
            </ul>
        </div>
    );
}