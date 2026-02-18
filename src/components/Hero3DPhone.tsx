import React, { useEffect, useState } from 'react';

// Import the hero phone image
import heroPhoneImage from '../assets/hero_phone_v8_final.png';

const Hero3DPhone: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger the slide-in animation after a short delay for page load
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 200);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className={`relative flex items-center justify-center h-[500px] md:h-[700px] w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0 md:opacity-0 md:translate-y-20'}`}>

            {/* Phone Image */}
            <img
                src={heroPhoneImage}
                alt="ProPickz AI Dashboard on iPhone"
                className="hero-phone w-auto h-[480px] md:h-[650px] object-contain z-10 transition-transform duration-500 hover:scale-[1.02] drop-shadow-2xl"
                draggable={false}
            />
        </div>
    );
};

export default React.memo(Hero3DPhone);
