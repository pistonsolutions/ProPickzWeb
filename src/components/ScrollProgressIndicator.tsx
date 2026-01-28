import React, { useState, useEffect } from 'react';

const ScrollProgressIndicator: React.FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setScrollProgress(Math.min(progress, 100));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed right-4 top-0 bottom-0 z-50 hidden md:flex flex-col items-center justify-between py-8 pointer-events-none">
            {/* Top text */}
            <div
                className="text-[10px] font-mono font-bold tracking-[3px] text-purple-500/60"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
                SYS:V1.0
            </div>

            {/* Progress line container */}
            <div className="flex-1 flex items-center justify-center my-4 relative">
                {/* Vertical track line */}
                <div className="w-[2px] h-full bg-gray-800/50 rounded-full relative">
                    {/* Glowing purple cube/indicator */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 w-3 h-6 rounded-sm transition-all duration-150 ease-out"
                        style={{
                            top: `${scrollProgress}%`,
                            transform: `translateX(-50%) translateY(-50%)`,
                            background: 'linear-gradient(180deg, #a855f7 0%, #7c3aed 100%)',
                            boxShadow: '0 0 15px rgba(168, 85, 247, 0.8), 0 0 30px rgba(168, 85, 247, 0.4)',
                        }}
                    />
                </div>

                {/* PROPICKZ text next to line */}
                <div
                    className="absolute left-6 text-[9px] font-bold tracking-[4px] text-purple-500/50"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                    PROPICKZ
                </div>
            </div>

            {/* Bottom spacer */}
            <div className="h-4" />
        </div>
    );
};

export default React.memo(ScrollProgressIndicator);
