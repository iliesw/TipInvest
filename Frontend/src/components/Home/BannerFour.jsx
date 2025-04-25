import React from 'react';
import './banner-four-animations.css';

const BannerFour = () => {
    return (
        <section className="banner-four relative z-10 py-12 sm:py-16 md:py-24 lg:py-36 w-full mb-16 sm:mb-0 md:-mb-20">
            {/* Main image */}
            <div className="banner-four__thumb absolute right-0 top-0 z-[-1] h-[40vh] sm:h-[60vh] md:h-[70vh] lg:h-[800px] overflow-hidden max-w-[70%] sm:max-w-[90%] block opacity-70 sm:opacity-100">
                <img src="assets/images/thumbs/banner-four-image.png" alt="Banner" className="h-[80%] object-contain"/>
            </div>
            
            {/* Shape images with animations */}
            <img 
                src="assets/images/shapes/pyramid-shape.png" 
                alt="Shape" 
                className="banner-four-shape one absolute left-[54%] bottom-[15%] z-[-1]  block sm:max-w-[45%] max-w-[25%] opacity-50 sm:opacity-100 animate-rotationScale"
            />
            <img 
                src="assets/images/shapes/angle-left.png" 
                alt="Shape" 
                className="banner-four-shape two absolute left-[38%] top-0 z-[-1] max-w-[45%] block sm:max-w-[45%] max-w-[25%] opacity-50 sm:opacity-100 animate-leftRight"
            />
            <img 
                src="assets/images/shapes/angle-right.png" 
                alt="Shape" 
                className="banner-four-shape three absolute left-[27%] bottom-0 z-[-1] max-w-[45%] block sm:max-w-[45%] max-w-[25%] opacity-50 sm:opacity-100 animate-leftRight"
            />
            
            {/* Main content with mask */}
            <div 
                className="banner-four__inner md:rounded-r-[1000px] w-full sm:bg-transparent"
            >
                <div className="container w-full px-4 sm:px-6 md:px-8">
                    {/* Mobile version (no skew) */}
                    <div className="banner-four-content block sm:hidden py-8 w-full border shadow-lg bg-white rounded-lg p-6 bg-opacity-90">
                        <div>
                            <h6 className="banner-four-content__subtitle font-poppins font-semibold text-black-500 border rounded-full w-fit px-3 py-1 bg-neutral-200 mb-2 text-sm">
                                Ai Powered Investments
                            </h6>
                            <h1 className="banner-four-content__title font-poppins font-semibold text-3xl mt-4 mb-3">
                                Invest today in Your <span className="bg-gradient-to-r from-orange-500 to-orange-500 bg-clip-text text-transparent">Dream Home</span>
                            </h1>
                            <p className="banner-four-content__desc font-poppins text-base text-gray-500 mb-6">
                                We are dedicated to providing you with the best investment opportunities
                            </p>
                            <button className='bg-black text-white py-2 px-4 rounded-md w-full sm:w-auto'>Explore More</button>
                        </div>
                    </div>
                    
                    {/* Tablet and desktop version (with skew) */}
                    <div className="banner-four-content hidden sm:block py-10 md:py-16 w-full sm:w-5/6 md:w-4/6 border shadow-2xl bg-white md:py-20 p-8 md:p-16 rounded-r-[50px] sm:skew-x-[-20deg] sm:-translate-x-12 md:-translate-x-24">
                        <div className='sm:skew-x-[20deg] sm:pl-16 md:pl-32'>
                            <h6 className="banner-four-content__subtitle font-poppins font-semibold text-black-500 border rounded-full w-fit px-3 py-1 bg-neutral-200 mb-2">
                                Ai Powered Investments
                            </h6>
                            <h1 className="banner-four-content__title font-poppins font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-5xl mt-4 sm:mt-5 mb-3 sm:mb-4">
                                Invest today in Your <span className="bg-gradient-to-r from-orange-500 to-orange-500 bg-clip-text text-transparent">Dream Home</span>
                            </h1>
                            <p className="banner-four-content__desc font-poppins text-base md:text-lg text-gray-500 mb-6 sm:mb-8 md:mb-10">
                                We are dedicated to providing you with the best investment opportunities
                            </p>
                            <button className='bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors'>Explore More</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerFour;