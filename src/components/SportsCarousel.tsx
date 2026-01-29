import React from 'react';

const getSports = () => [
    { name: 'NFL' },
    { name: 'NBA' },
    { name: 'MLB' },
    { name: 'NHL' },
    { name: 'NCAAF' },
    { name: 'UFC' },
    { name: 'WNBA' },
    { name: 'CBB' },
    { name: 'Horse Racing' },
    { name: 'E-Sports' },
];

const SportsCarousel: React.FC = () => {
    // Use t to get translated content if needed, even if unused in current static list to maintain pattern
    const sports = getSports();

    // Animation state
    const sectionRef = React.useRef<HTMLDivElement>(null);

    const SportCard = ({ sport, index, isMobile = false }: { sport: { name: string }, index: number, isMobile?: boolean }) => (
        <div
            className={`flex-shrink-0 w-[240px] md:w-[200px] h-[120px] bg-[#0f1014] border border-purple-500/30 rounded-2xl relative overflow-hidden group/card shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:border-purple-400/60 transition-all duration-300 flex items-center justify-center transform hover:scale-105 ${isMobile ? 'snap-center' : ''
                }`}
        >
            {/* Glowing Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent opacity-50 group-hover/card:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

            {/* Text */}
            <h3 className="text-2xl font-black text-white tracking-tight relative z-10 group-hover/card:text-purple-100 transition-colors drop-shadow-md">
                {sport.name}
            </h3>

            {/* Animated Border Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000"></div>
        </div>
    );

    return (
        <div className="relative group w-full py-8 overflow-hidden" ref={sectionRef}>

            {/* Fade Gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>

            {/* Desktop: Marquee Container */}
            <div className="hidden md:flex animate-marquee hover:[animation-play-state:paused] gap-6 items-center">
                {/* Triple the list for smooth infinity loop */}
                {[...sports, ...sports, ...sports].map((sport, i) => (
                    <SportCard key={`desktop-${i}`} sport={sport} index={i} />
                ))}
            </div>

            {/* Mobile: Horizontal Swipe Carousel */}
            <div
                className="flex md:hidden overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {sports.map((sport, i) => (
                    <SportCard key={`mobile-${i}`} sport={sport} index={i} isMobile={true} />
                ))}
            </div>

            {/* Mobile Scroll Indicator */}
            <div className="flex md:hidden justify-center gap-1.5 mt-2 opacity-50">
                <div className="w-6 h-1 bg-purple-500 rounded-full"></div>
                <div className="w-1.5 h-1 bg-gray-700 rounded-full"></div>
                <div className="w-1.5 h-1 bg-gray-700 rounded-full"></div>
            </div>
        </div>
    );
};

export default SportsCarousel;
