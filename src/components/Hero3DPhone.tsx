import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', updateMousePosition);
            return () => window.removeEventListener('mousemove', updateMousePosition);
        }
    }, []);
    return mousePosition;
};

const Hero3DPhone: React.FC = () => {
    const { x, y } = useMousePosition();
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

    const rotateX = ((y - centerY) / 50).toFixed(2);
    const rotateY = ((x - centerX) / 50).toFixed(2);

    return (
        <div className="relative hidden lg:block perspective-1000">
            <div
                className="relative z-20 transition-transform duration-100 ease-out will-change-transform"
                style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${parseFloat(rotateY) * -1}deg)`,
                    transformStyle: 'preserve-3d'
                }}
            >
                <img
                    src="https://cdn.prod.website-files.com/683c64c4aa0f10093bc3ddc1/683f4baf9511918153fe3405_Phone%20exports-p-1080.png"
                    alt="Dashboard"
                    className="w-full max-w-md mx-auto drop-shadow-2xl"
                />

                {/* Floating Elements */}
                <div className="absolute top-20 -left-10 glass-card p-4 rounded-xl animate-float-slow" style={{ transform: 'translateZ(40px)' }}>
                    <div className="text-gray-400 text-xs font-bold uppercase mb-1">Current Streak</div>
                    <div className="text-green-400 font-mono text-2xl font-bold flex items-center gap-2">
                        <TrendingUp size={20} /> 7 WINS
                    </div>
                </div>

                <div className="absolute bottom-40 -right-5 glass-card p-4 rounded-xl animate-float-slow" style={{ transform: 'translateZ(60px)', animationDelay: '1s' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">VP</div>
                        <div>
                            <div className="text-white text-sm font-bold">New Pick Posted</div>
                            <div className="text-gray-400 text-xs">NBA • Lakers Moneyline</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero3DPhone;
