import React, { useEffect, useState } from 'react';

// Import the hero phone image
import heroPhoneImage from '../../phone.png';

const Hero3DPhone: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger the slide-in animation after a short delay for page load
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <>
            <style>{`
                .hero-phone-wrapper {
                    mask-image: linear-gradient(to bottom, black 55%, transparent 85%);
                    -webkit-mask-image: linear-gradient(to bottom, black 55%, transparent 85%);
                }
                .hero-phone-blur {
                    filter: none;
                }
                @media (max-width: 767px) {
                    .hero-phone-blur {
                        position: relative;
                    }
                    .hero-phone-blur::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        height: 45%;
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        pointer-events: none;
                        mask-image: linear-gradient(to bottom, transparent 0%, black 50%);
                        -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 50%);
                    }
                }
                @media (min-width: 768px) {
                    .hero-phone-wrapper {
                        mask-image: none !important;
                        -webkit-mask-image: none !important;
                    }
                }
            `}</style>
            <div className={`hero-phone-wrapper relative flex items-start justify-center h-[420px] md:h-[700px] w-full transition-all duration-700 ease-out overflow-hidden ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-y-[40px] md:translate-y-0 md:translate-x-[120px]'}`}>
                <div className="hero-phone-blur relative">
                    <img
                        src={heroPhoneImage}
                        alt="ProPickz AI Dashboard on iPhone"
                        className="hero-phone w-auto h-[460px] md:h-[650px] object-contain z-10 transition-transform duration-500 hover:scale-[1.02] drop-shadow-2xl"
                        draggable={false}
                    />
                </div>
            </div>
        </>
    );
};

export default React.memo(Hero3DPhone);
