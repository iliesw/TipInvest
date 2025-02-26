/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

const Intro = () => {
  return (
    <div className="flex justify-center mb-20 px-10">
      <div className=" w-full md:w-[65vw] h-[35vh] bg-gradient-to-t from-[#008e2650] to-transparent rounded-lg overflow-visible flex relative">
        <img className="hidden md:block h-[30vh] md:h-[55vh] absolute bottom-0 w-[90%] left-[-25%]" src="/assets/images/right.png" />
        <img className=" h-[60vh] md:h-[70vh] absolute bottom-0 left-[-5%] md:left-[65%] z-0" style={{mask:"linear-gradient(0deg,black,transparent 150%)"}} src="/assets/images/left.png" />
      </div>
    </div>
  );
};

export default Intro;
