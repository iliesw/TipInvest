const Stats = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="block w-[80rem] my-[150px] rounded-[20px] outline outline-2 outline-dashed outline-[rgba(0,0,0,0.153)] p-[55px] box-border">
        <div className="flex gap-[80px] pt-[15px] items-center">
          <div className="w-[150%]">
            <span className="bg-[rgb(247,255,233)] px-[20px] py-[10px] rounded-[50px] text-[15px] font-rubik text-black">
              Votre partenaire pour réussir
            </span>
            <h1 className="font-figtree text-[40px] font-extrabold w-full text-start mt-[20px]">
              Déjà plus de 500 investisseurs conquis !
            </h1>
          </div>
          <p className="w-[120%] h-full text-start opacity-50 font-versel">
            Notre plateforme est conçue pour connecter les utilisateurs à leurs
            biens idéaux rapidement, offrant une expérience fluide et
            engageante. Pour les investisseurs, nous offrons une forte
            croissance, des ventes plus rapides et un retour sur investissement
            croissant, faisant de notre plateforme une opportunité idéale sur le
            marché immobilier.
          </p>
        </div>
        <div className="my-[30px] mb-[40px] w-full h-[1px] bg-gradient-to-r from-[rgba(0,0,0,0.253)] to-white bg-[length:5px]"></div>
          <div className="flex gap-[40px]">
            <div className="w-full flex flex-col gap-[20px] items-center">
              <h1 className="text-[65px] font-figtree m-0">50+</h1>
              <p className="text-center m-0 font-versel opacity-50">
                Biens listés – Un large éventail de maisons, appartements et
                espaces commerciaux.
              </p>
            </div>
            <div className="w-full flex flex-col gap-[20px] items-center">
              <h1 className="text-[65px] font-figtree m-0">150%</h1>
              <p className="text-center m-0 font-versel opacity-50">
                Croissance annuelle – Démontrant la popularité croissante de la
                plateforme et l&apos;augmentation de sa part de marché.
              </p>
            </div>
            <div className="w-full flex flex-col gap-[20px] items-center">
              <h1 className="text-[65px] font-figtree m-0">30%</h1>
              <p className="text-center m-0 font-versel opacity-50">
                Augmentation du ROI – Les investisseurs bénéficient de
                rendements plus élevés grâce à nos analyses de données et
                transactions rapides.
              </p>
            </div>
          </div>
        </div>
      </div>

    
  );
};

export default Stats;
