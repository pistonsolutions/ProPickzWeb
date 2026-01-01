import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AsSeenOn: React.FC = () => {
    const { t } = useLanguage();

    const brands = [
        "FORBES", "YAHOO FINANCE", "BLEACHER REPORT", "ESPN", "BUSINESS INSIDER", "SPORTS ILLUSTRATED", "GQ", "VICE"
    ];

    return (
        <div className="py-10 bg-black border-y border-gray-900 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] font-heading">
                    {t('hero', 'AsSeenOn')}
                </p>
            </div>

            <div className="relative flex overflow-hidden group">
                <div className="flex animate-marquee whitespace-nowrap gap-16 md:gap-32 items-center">
                    {/* First Set */}
                    {brands.map((brand, index) => (
                        <span
                            key={`a-${index}`}
                            className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-700 to-gray-900 group-hover:from-gray-500 group-hover:to-gray-700 transition-all duration-500 select-none"
                        >
                            {brand}
                        </span>
                    ))}

                    {/* Duplicate Set for Infinite Scroll */}
                    {brands.map((brand, index) => (
                        <span
                            key={`b-${index}`}
                            className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-700 to-gray-900 group-hover:from-gray-500 group-hover:to-gray-700 transition-all duration-500 select-none"
                        >
                            {brand}
                        </span>
                    ))}

                    {/* Triplicate Set for safety on wide screens */}
                    {brands.map((brand, index) => (
                        <span
                            key={`c-${index}`}
                            className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-700 to-gray-900 group-hover:from-gray-500 group-hover:to-gray-700 transition-all duration-500 select-none"
                        >
                            {brand}
                        </span>
                    ))}
                </div>

                {/* Fade Masks */}
                <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-black to-transparent z-10"></div>
                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-black to-transparent z-10"></div>
            </div>
        </div>
    );
};

export default AsSeenOn;
