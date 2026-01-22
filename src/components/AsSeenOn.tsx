import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AsSeenOn: React.FC = () => {
    const { t } = useLanguage();

    const brands = [
        { name: "FORBES", color: "text-white" },
        { name: "YAHOO FINANCE", color: "text-purple-400" },
        { name: "BLEACHER REPORT", color: "text-green-400" },
        { name: "ESPN", color: "text-red-500" },
        { name: "BUSINESS INSIDER", color: "text-blue-400" },
        { name: "SPORTS ILLUSTRATED", color: "text-orange-500" },
        { name: "GQ", color: "text-yellow-400" },
        { name: "VICE", color: "text-pink-500" }
    ];

    return (
        <div className="py-20 bg-black border-y border-gray-900 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] font-heading">
                    {t('hero', 'AsSeenOn')}
                </p>
            </div>

            <div className="relative flex overflow-hidden group">
                <div className="flex animate-marquee-slow whitespace-nowrap gap-20 md:gap-40 items-center hover:[animation-play-state:paused] will-change-transform">
                    {/* First Set */}
                    {brands.map((brand, index) => (
                        <span
                            key={`a-${index}`}
                            className={`text-3xl md:text-5xl font-black ${brand.color} opacity-80 hover:opacity-100 transition-[transform,opacity] duration-300 select-none hover:scale-110 cursor-default`}
                        >
                            {brand.name}
                        </span>
                    ))}

                    {/* Duplicate Set for Infinite Scroll */}
                    {brands.map((brand, index) => (
                        <span
                            key={`b-${index}`}
                            className={`text-3xl md:text-5xl font-black ${brand.color} opacity-80 hover:opacity-100 transition-[transform,opacity] duration-300 select-none hover:scale-110 cursor-default`}
                        >
                            {brand.name}
                        </span>
                    ))}

                    {/* Triplicate Set for safety on wide screens */}
                    {brands.map((brand, index) => (
                        <span
                            key={`c-${index}`}
                            className={`text-3xl md:text-5xl font-black ${brand.color} opacity-80 hover:opacity-100 transition-[transform,opacity] duration-300 select-none hover:scale-110 cursor-default`}
                        >
                            {brand.name}
                        </span>
                    ))}
                </div>

                {/* Fade Masks */}
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10"></div>
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10"></div>
            </div>
        </div>
    );
};

export default AsSeenOn;
