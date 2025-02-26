export default function Cta() {
  return (
    <div className="w-full flex justify-center mx-auto px-4">
      <div className="w-full bg-lime-50 max-w-7xl rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-6 text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold" style={{fontFamily:"Figtree"}}>Rejoignez Tips Invest dès aujourd’hui !</h1>
          <p className="mt-2">
            Rejoignez Tips Invest et accédez aux meilleurs outils pour optimiser
            vos investissements immobiliers.
          </p>
        </div>
        <button className="w-full md:w-auto rounded-xl bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Créer un compte gratuitement</button>
      </div>
    </div>
  );
}
