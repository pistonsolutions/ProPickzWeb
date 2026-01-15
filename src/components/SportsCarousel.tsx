import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const sports = [
    { name: 'NFL', full: 'National Football League', color: 'bg-blue-900/10 border-blue-500/20', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&q=80' },
    { name: 'NBA', full: 'National Basketball Association', color: 'bg-orange-900/10 border-orange-500/20', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80' },
    { name: 'MLB', full: 'Major League Baseball', color: 'bg-red-900/10 border-red-500/20', image: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=600&q=80' },
    { name: 'NHL', full: 'National Hockey League', color: 'bg-cyan-900/10 border-cyan-500/20', image: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=600&q=80' },
    { name: 'NCAAF', full: 'College Football', color: 'bg-yellow-900/10 border-yellow-500/20', image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80' },
    { name: 'UFC', full: 'Ultimate Fighting Championship', color: 'bg-red-950/20 border-red-600/20', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&q=80' },
    { name: 'WNBA', full: 'Women\'s NBA', color: 'bg-pink-900/10 border-pink-500/20', image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=600&q=80' },
    { name: 'CBB', full: 'College Basketball', color: 'bg-blue-800/10 border-blue-400/20', image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&q=80' },
    { name: 'Horse Racing', full: 'International Racing', color: 'bg-purple-900/10 border-purple-500/20', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
    { name: 'E-Sports', full: 'Competitive Gaming', color: 'bg-green-900/10 border-green-500/20', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80' },
];

const SportsCarousel: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // Large buffer to simulate infinity without glitchy jump logic
    const infiniteSports = Array(15).fill(sports).flat();

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
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black border border-gray-800 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-900 md:-left-6 shadow-xl"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={() => scroll('right')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black border border-gray-800 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-900 md:-right-6 shadow-xl"
            >
                <ChevronRight size={24} />
            </button>

            {/* Fade Gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory hide-scrollbar px-8 md:px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {infiniteSports.map((sport, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 w-[240px] md:w-[280px] h-[360px] snap-center bg-[#0f1014] border border-gray-800 rounded-3xl relative overflow-hidden transition-all duration-300 hover:border-gray-700 hover:bg-[#15161a] group/card"
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover/card:scale-110 opacity-30 group-hover/card:opacity-50"
                            style={{ backgroundImage: `url(${sport.image})` }}
                        ></div>

                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>

                        <div className={`absolute inset-0 ${sport.color} opacity-0 group-hover/card:opacity-100 transition-opacity duration-500`}></div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                            {/* Just Text - No Icons */}

                            <h3 className="text-3xl font-black text-white mb-3 tracking-tight relative z-20">{sport.name}</h3>
                            <p className="text-sm text-gray-400 uppercase tracking-widest mb-8 font-medium relative z-20">{sport.full}</p>

                            <div className="w-12 h-1 bg-gray-800 rounded-full mb-8 group-hover/card:bg-gray-700 transition-colors relative z-20"></div>

                            <div className="px-4 py-2 bg-black/50 rounded-full border border-gray-800 text-xs font-bold text-gray-500 group-hover/card:text-white group-hover/card:border-white/20 transition-all relative z-20">
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
