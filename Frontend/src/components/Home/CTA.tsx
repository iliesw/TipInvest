export default function Cta() {
  return (
    <div className="w-full flex justify-center mx-auto px-4">
      <div className="w-full  bg-lime-50 max-w-7xl   rounded-2xl p-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{fontFamily:"Figtree"}}>Rejoignez Tips Invest dès aujourd’hui !</h1>
          <p>
            Rejoignez Tips Invest et accédez aux meilleurs outils pour optimiser
            vos investissements immobiliers.
          </p>
        </div>
        <button className=" rounded-xl bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Créer un compte gratuitement</button>

      </div>
    </div>
  );
}
