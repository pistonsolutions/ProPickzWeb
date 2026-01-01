import React, { useRef, useEffect } from 'react';
import { Trophy, Flame, Target, Disc, Award, Gamepad2, ChevronLeft, ChevronRight, Dribbble } from 'lucide-react';

const sports = [
    { name: 'NFL', full: 'National Football League', icon: <Trophy size={48} className="text-blue-500" />, color: 'from-blue-900/40 to-blue-600/10' },
    { name: 'NBA', full: 'National Basketball Association', icon: <Dribbble size={48} className="text-orange-500" />, color: 'from-orange-900/40 to-red-600/10' },
    { name: 'MLB', full: 'Major League Baseball', icon: <Disc size={48} className="text-red-500" />, color: 'from-red-900/40 to-blue-900/10' },
    { name: 'NHL', full: 'National Hockey League', icon: <Flame size={48} className="text-cyan-500" />, color: 'from-cyan-900/40 to-blue-500/10' },
    { name: 'NCAAF', full: 'College Football', icon: <Award size={48} className="text-yellow-500" />, color: 'from-yellow-900/40 to-orange-600/10' },
    { name: 'UFC', full: 'Ultimate Fighting Championship', icon: <Target size={48} className="text-red-600" />, color: 'from-red-900/40 to-black/10' },
    { name: 'WNBA', full: 'Women\'s NBA', icon: <Dribbble size={48} className="text-orange-400" />, color: 'from-orange-800/40 to-orange-500/10' },
    { name: 'CBB', full: 'College Basketball', icon: <Dribbble size={48} className="text-blue-400" />, color: 'from-blue-800/40 to-blue-500/10' },
    { name: 'Horse Racing', full: 'International Racing', icon: <Award size={48} className="text-purple-500" />, color: 'from-purple-900/40 to-pink-600/10' },
    { name: 'E-Sports', full: 'Competitive Gaming', icon: <Gamepad2 size={48} className="text-green-500" />, color: 'from-green-900/40 to-emerald-600/10' },
];

const SportsCarousel: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // Triplicate the data to create a buffer for infinite scrolling
    const infiniteSports = [...sports, ...sports, ...sports, ...sports];

    // Handle Scroll to creating infinite loop effect
    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const maxScroll = container.scrollWidth;
        const oneSetWidth = maxScroll / 4; // Since we have 4 sets

        // If we scroll too far right (into the last set), jump back to the second set
        if (container.scrollLeft >= oneSetWidth * 3) {
            container.scrollLeft = container.scrollLeft - oneSetWidth;
        }
        // If we scroll too far left (into the first set), jump forward to the second set
        else if (container.scrollLeft <= 50) { // Threshold near 0
            container.scrollLeft = container.scrollLeft + oneSetWidth;
        }
    };

    // Initial scroll positioning to the second set
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const maxScroll = container.scrollWidth;
            // Start at the second set
            container.scrollLeft = maxScroll / 4;
        }
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative group w-full max-w-7xl mx-auto py-8">

            {/* Scroll Buttons */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 border border-gray-700 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:bg-white hover:text-black md:-left-6"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 border border-gray-700 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:bg-white hover:text-black md:-right-6"
            >
                <ChevronRight size={24} />
            </button>

            {/* Fade Gradients for visual "infinity" feel */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory hide-scrollbar px-8 md:px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {infiniteSports.map((sport, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 w-[240px] md:w-[280px] h-[360px] snap-center bg-gray-900/40 border border-gray-800 rounded-3xl relative overflow-hidden transition-transform duration-500 hover:scale-105 hover:border-gray-600 group/card"
                    >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${sport.color} opacity-30 group-hover/card:opacity-50 transition-opacity`}></div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                            <div className="mb-6 p-4 bg-black/30 rounded-2xl border border-white/5 shadow-xl group-hover/card:scale-110 transition-transform duration-500">
                                {sport.icon}
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2">{sport.name}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">{sport.full}</p>

                            <div className="w-8 h-1 bg-gray-700 rounded-full mb-4"></div>

                            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold text-gray-300">
                                ACTIVE MARKET
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SportsCarousel;
