/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

const Intro = () => {
  return (
    <div className=" overflow-hidden h-[500px] sm:h-[700px] w-full mt-[-30vh] flex items-end justify-center">
      <div className="justify-center px-10 md:flex w-full mt-[-0%]">
        <div className="imga d0 w-full  md:w-[65vw] h-[35vh] bg-gradient-to-t from-[#008e2650] to-transparent rounded-lg overflow-visible flex d1 relative">
          <img
            className=" imga d2 hidden md:block h-[30vh] md:h-[55vh] absolute bottom-0 w-[90%] left-[-25%]"
            src="/assets/images/right.png"
          />
          <img
            className="imgm imga h-[60vh] md:h-[70vh] absolute bottom-0 left-[-5%] md:left-[65%] z-0"
            src="/assets/images/left.png"
          />
        </div>
      </div>
      <style jsx>{`
  @keyframes moveUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .imgm {
    mask-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0)
    ); /* Mask on mobile */
  }

  @media (min-width: 768px) {
    .imgm {
      mask-image: none !important; /* Ensures override */
    }
  }

  .imga {
    opacity: 0; /* Hide initially */
    animation: moveUp 0.7s ease forwards;
  }

  .d0 {
    animation-delay: 0ms;
  }

  .d1 {
    animation-delay: 200ms;
  }

  .d2 {
    animation-delay: 400ms;
  }
`}</style>

    </div>
  );
};

export default Intro;
