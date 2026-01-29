import React, { useEffect, useState } from 'react';

// Import the hero phone image
import heroPhoneImage from '../assets/hero_phone.png';

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
        <div className={`relative flex items-center justify-center h-[500px] md:h-[700px] w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>

            {/* Phone Image */}
            <img
                src={heroPhoneImage}
                alt="ProPickz AI Dashboard on iPhone"
                className="hero-phone w-auto h-[480px] md:h-[650px] object-contain z-10 transition-transform duration-500 hover:scale-[1.02] drop-shadow-2xl"
                style={{
                    filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.4))'
                }}
                draggable={false}
            />

            {/* Premium Blue Glow Effect */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[700px] bg-gradient-to-br from-blue-600/25 via-indigo-500/20 to-purple-500/15 blur-[150px] rounded-full"></div>
        </div>
    );
};

export default React.memo(Hero3DPhone);
