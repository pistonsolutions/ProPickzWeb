import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Import winning slip images
import img2 from '../assets/slip2.png';
import img3 from '../assets/slip3.png';
import img4 from '../assets/slip4.png';
import img5 from '../assets/slip5.png';
import img6 from '../assets/slip6.png';
import img8 from '../assets/slip8.png';
import img9 from '../assets/slip9.png';
import imgNew1 from '../assets/IMG_7871.png';
import imgNew2 from '../assets/IMG_7872.png';
import imgNew3 from '../assets/IMG_7875.jpg';
import imgNew4 from '../assets/IMG_7876.jpg';
import imgNew5 from '../assets/IMG_7877.jpg';

const WinningSlips: React.FC = () => {
    const { t } = useLanguage();

    const slipImages = [imgNew1, imgNew2, imgNew3, imgNew4, imgNew5, img2, img3, img4, img5, img6, img8, img9];

    return (
        <div className="w-full bg-black py-12 overflow-hidden relative group/section">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-20 pointer-events-none"></div>

            {/* Ambient Purple Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-600/10 blur-[100px] pointer-events-none"></div>

            <h3 className="text-center text-gray-400 text-sm font-bold uppercase tracking-widest mb-12 relative z-20 shadow-black drop-shadow-md">
                {t('winningSlips', 'Title')}
            </h3>

            <div className="flex w-[200%] animate-marquee hover:[animation-play-state:paused] relative z-10 group/list">
                {/* Loop 1 */}
                <div className="flex items-center gap-8 pr-8">
                    {slipImages.map((src, i) => (
                        <div key={`s1-${i}`} className="w-64 md:w-80 flex-shrink-0 rounded-2xl overflow-hidden border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-110 hover:z-50 relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <img src={src} alt="Winning Slip" className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
                {/* Loop 2 (Duplicate for smooth scroll) */}
                <div className="flex items-center gap-8 pr-8">
                    {slipImages.map((src, i) => (
                        <div key={`s2-${i}`} className="w-64 md:w-80 flex-shrink-0 rounded-2xl overflow-hidden border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-110 hover:z-50 relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <img src={src} alt="Winning Slip" className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
                {/* Loop 3 (Extra buffer) */}
                <div className="flex items-center gap-8 pr-8">
                    {slipImages.map((src, i) => (
                        <div key={`s3-${i}`} className="w-64 md:w-80 flex-shrink-0 rounded-2xl overflow-hidden border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-110 hover:z-50 relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <img src={src} alt="Winning Slip" className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WinningSlips;
