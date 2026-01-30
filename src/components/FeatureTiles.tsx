import React, { useRef } from 'react';
import { Gift } from 'lucide-react';
import { Reveal } from '../utils/Reveal';
import { useLanguage } from '../contexts/LanguageContext';
import AlgorithmTerminal from './AlgorithmTerminal';

const FeatureTiles: React.FC = () => {
    const { t } = useLanguage();
    const sectionRef = useRef<HTMLDivElement>(null);


    const widgets = [
        // Widget 1: Inside the Winning Room
        <div key="widget1" className="w-[280px] md:w-auto flex-shrink-0 md:flex-shrink rounded-[2rem] bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] p-4 relative overflow-hidden border border-purple-400/30 shadow-[inset_0_0_30px_rgba(0,0,0,0.5),0_0_40px_rgba(139,92,246,0.15)] group h-[400px] md:h-full md:min-h-[400px] hover:shadow-[0_0_60px_rgba(139,92,246,0.25)] transition-all duration-300">
            {/* Noise texture overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-60 mix-blend-overlay pointer-events-none"></div>
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
            {/* Glow effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/20 rounded-full blur-[30px] md:blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/15 rounded-full blur-[20px] md:blur-[60px] pointer-events-none"></div>

            {/* Live Tracking Badge - Absolute positioned */}
            <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-900/40 border border-cyan-500/50 text-cyan-300 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                LIVE TRACKING
            </div>

            <div className="relative z-10 flex flex-col h-full pt-10">
                <div className="mb-1">
                    <h3 className="text-base font-bold text-white">{t('featureTiles', 'Widget1Title')}</h3>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    {/* Realistic iPhone Frame */}
                    <div
                        className="relative rounded-[2.5rem] overflow-hidden"
                        style={{
                            width: '170px',
                            height: '360px',
                            background: 'linear-gradient(145deg, #2c2c2e 0%, #1c1c1e 50%, #2c2c2e 100%)',
                            padding: '3px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 2px rgba(255,255,255,0.05)'
                        }}
                    >
                        {/* Screen */}
                        <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-[#1a1a1e]">
                            <img
                                src="/assets/discord-channels.png"
                                alt="Discord Channels"
                                className="w-full h-full object-cover"
                                style={{ objectPosition: 'center top' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>,

        // Widget 2: Exclusive Giveaways
        <div key="widget2" className="w-[280px] md:w-auto flex-shrink-0 md:flex-shrink rounded-[2rem] bg-gradient-to-br from-amber-600 to-yellow-700 p-6 relative overflow-hidden border border-white/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group h-[400px] md:h-full md:min-h-[400px] hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-60 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-300/30 rounded-full blur-[20px] md:blur-[60px] pointer-events-none animate-pulse"></div>

            {/* Live Tracking Badge - Absolute positioned */}
            <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-900/40 border border-cyan-500/50 text-cyan-300 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                LIVE TRACKING
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                <div className="bg-black/30 backdrop-blur-md p-4 rounded-full mb-6 border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Gift size={48} className="text-yellow-200" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide drop-shadow-md text-balance">{t('featureTiles', 'Widget2Title')}</h3>
                <p className="text-yellow-100 font-medium mb-6">{t('featureTiles', 'Widget2Desc')}</p>
                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">{t('featureTiles', 'Widget2Badge')}</span>
            </div>
        </div>,

        // Widget 3: The Algorithm
        <div key="widget3" className="w-[280px] md:w-auto flex-shrink-0 md:flex-shrink rounded-[2rem] bg-[#0c0c0c] p-6 relative overflow-hidden border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group h-[400px] md:h-full md:min-h-[400px]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50 mix-blend-overlay pointer-events-none"></div>

            {/* Live Tracking Badge - Absolute positioned */}
            <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-900/40 border border-cyan-500/50 text-cyan-300 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                LIVE TRACKING
            </div>

            <div className="relative z-10 flex flex-col h-full pt-10">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">{t('featureTiles', 'Widget3Title')}</h3>
                    <p className="text-sm text-gray-400">{t('featureTiles', 'Widget3Desc')}</p>
                </div>
                <AlgorithmTerminal />
            </div>
        </div>,


        // Widget 4: Betting Academy - Discord Community
        <div key="widget4" className="w-[280px] md:w-auto flex-shrink-0 md:flex-shrink rounded-[2rem] bg-gradient-to-br from-[#064e3b] via-[#0d4a3a] to-[#0f2e2a] p-6 md:p-8 relative overflow-hidden border border-emerald-500/30 shadow-[inset_0_0_30px_rgba(0,0,0,0.6),0_0_40px_rgba(16,185,129,0.15)] group h-[400px] md:h-full md:min-h-[500px] hover:shadow-[0_0_60px_rgba(16,185,129,0.25)] transition-all duration-300">
            {/* Noise texture overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-60 mix-blend-overlay pointer-events-none"></div>
            {/* Diagonal lines pattern */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(16,185,129,0.03)_10px,rgba(16,185,129,0.03)_20px)] pointer-events-none"></div>
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/15 rounded-full blur-[30px] md:blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-[20px] md:blur-[60px] pointer-events-none"></div>

            {/* Live Tracking Badge - Absolute positioned */}
            <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-900/40 border border-cyan-500/50 text-cyan-300 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                LIVE TRACKING
            </div>

            <div className="relative z-10 flex flex-col h-full pt-10">
                <div className="mb-4">
                    <h3 className="text-base font-bold text-white mb-1">{t('featureTiles', 'Widget4Title')}</h3>
                    <p className="text-sm text-emerald-200/70">{t('featureTiles', 'Widget4Desc')}</p>
                </div>

                <div className="flex-1 flex items-center justify-center translate-y-4">
                    {/* Realistic iPhone Frame */}
                    <div
                        className="relative rounded-[2.5rem] overflow-hidden"
                        style={{
                            width: '170px',
                            height: '360px',
                            background: 'linear-gradient(145deg, #2c2c2e 0%, #1c1c1e 50%, #2c2c2e 100%)',
                            padding: '3px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 2px rgba(255,255,255,0.05)'
                        }}
                    >
                        {/* Screen */}
                        <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-[#1a1a1e]">
                            <img
                                src="/assets/education-screen.png"
                                alt="ProPickz Education Channels"
                                className="w-full h-full object-cover"
                                style={{ objectPosition: 'center top' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ];

    // Create infinite loop by duplicating widgets (reduced for performance)
    const extendedWidgets = [...widgets, ...widgets];

    return (
        <section className="py-24 bg-black relative overflow-hidden" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-4">
                <Reveal className="mb-12">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                        {t('featureTiles', 'HeadlinePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">{t('featureTiles', 'HeadlineHighlight')}</span><span className="text-purple-400 animate-pulse">_</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl">
                        {t('featureTiles', 'Subheadline')}
                    </p>
                </Reveal>

                {/* Infinite Auto-Scrolling Carousel with CSS Animation */}
                <div className="relative overflow-hidden">
                    {/* Gradient fade on edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

                    <div
                        className="flex gap-6 animate-carousel-scroll"
                        style={{
                            width: 'fit-content',
                            willChange: 'transform',
                        }}
                    >
                        {extendedWidgets.map((widget, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[350px] md:w-[400px]"
                            >
                                {widget}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* GPU-Accelerated CSS Animation */}
            <style>{`
                @keyframes carouselScroll {
                    0% {
                        transform: translate3d(0, 0, 0);
                    }
                    100% {
                        transform: translate3d(-50%, 0, 0);
                    }
                }
                .animate-carousel-scroll {
                    animation: carouselScroll 30s linear infinite;
                    backface-visibility: hidden;
                    perspective: 1000px;
                }
                .animate-carousel-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default FeatureTiles;

