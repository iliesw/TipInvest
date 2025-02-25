/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

const Into = () => {
  return (
    <div className="flex justify-center mb-20">
      <div className="w-[65vw] h-[35vh] bg-gradient-to-t from-[#008e2650] to-white rounded-lg overflow-visible flex relative">
        <img className="h-[70vh] absolute bottom-0 w-[90%] h-[160%] left-[-25%]" src="/assets/images/right.png" />
        <img className="h-[70vh] absolute bottom-0 h-[200%] left-[65%] z-0 mask-image-gradient-to-t from-black to-[#00000080]" src="/assets/images/left.png" />
      </div>
    </div>
  );
};

export default Into;
