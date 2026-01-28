import React, { useEffect, useRef, useState } from 'react';
import { Gift } from 'lucide-react';
import { Reveal } from '../utils/Reveal';
import { useLanguage } from '../contexts/LanguageContext';
import AlgorithmTerminal from './AlgorithmTerminal';

const FeatureTiles: React.FC = () => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Check if section is in view for drop-down animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const widgets = [
        // Widget 1: Inside the Winning Room
        <div key="widget1" className="w-[280px] md:w-auto flex-shrink-0 md:flex-shrink rounded-[2rem] bg-[#7c3aed] p-4 relative overflow-hidden border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group h-[400px] md:h-full md:min-h-[400px]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/20 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-1">
                    <h3 className="text-base font-bold text-white">Inside the Winning Room</h3>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-[200px] h-[340px] md:h-[420px]">
                        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-[#2a2a2a] via-[#1a1a1a] to-[#3a3a3a] p-[3px] shadow-[0_25px_50px_rgba(0,0,0,0.5)]">
                            <div className="w-full h-full rounded-[2.2rem] bg-black overflow-hidden relative">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-20"></div>
                                <img
                                    src="/assets/discord-channels.png"
                                    alt="Discord Channels"
                                    className="w-full h-full object-cover object-top pt-8"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                        <div className="absolute top-24 -right-[2px] w-[2px] h-12 bg-[#2a2a2a] rounded-r-sm"></div>
                        <div className="absolute top-20 -left-[2px] w-[2px] h-8 bg-[#2a2a2a] rounded-l-sm"></div>
                        <div className="absolute top-32 -left-[2px] w-[2px] h-12 bg-[#2a2a2a] rounded-l-sm"></div>
                    </div>
                </div>
            </div>
        </div>,

        // Widget 2: The Algorithm
        <div key="widget2" className="w-[280px] md:w-auto flex-shrink-0 md:flex-shrink rounded-[2rem] bg-[#0c0c0c] p-6 relative overflow-hidden border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group h-[400px] md:h-full md:min-h-[400px]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">The Algorithm</h3>
                    <p className="text-sm text-gray-400">Industry leading technology aggregating millions of data points every second.</p>
                </div>
                <AlgorithmTerminal />
            </div>
        </div>,

        // Widget 3: Exclusive Giveaways
        <div key="widget3" className="w-[280px] md:w-auto flex-shrink-0 md:flex-shrink rounded-[2rem] bg-gradient-to-br from-amber-600 to-yellow-700 p-6 relative overflow-hidden border border-white/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group h-[400px] md:h-full md:min-h-[400px] hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-300/30 rounded-full blur-[60px] pointer-events-none animate-pulse"></div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                <div className="bg-black/30 backdrop-blur-md p-4 rounded-full mb-6 border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Gift size={48} className="text-yellow-200" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide drop-shadow-md">Exclusive Giveaways</h3>
                <p className="text-yellow-100 font-medium mb-6">Weekly prizes for our VIP members.</p>
                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">Members Only</span>
            </div>
        </div>,

        // Widget 4: Betting Academy
        <div key="widget4" className="w-[280px] md:w-auto flex-shrink-0 md:flex-shrink rounded-[2rem] bg-gradient-to-br from-[#064e3b] to-[#0f2e2a] p-6 md:p-8 relative overflow-hidden border border-white/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group h-[400px] md:min-h-[350px]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-1">
                    <h3 className="text-base font-bold text-white mb-1">Master the Game Behind the Picks</h3>
                    <p className="text-sm text-emerald-200/70">Learn the principles behind sports betting... or don't. Our picks work either way.</p>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-[200px] h-[280px] md:h-[420px]">
                        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-[#2a2a2a] via-[#1a1a1a] to-[#3a3a3a] p-[3px] shadow-[0_25px_50px_rgba(0,0,0,0.5)]">
                            <div className="w-full h-full rounded-[2.2rem] bg-black overflow-hidden relative">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-20"></div>
                                <img
                                    src="/assets/education-channels.png"
                                    alt="Education Channels"
                                    className="w-full h-full object-cover object-top pt-8"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                        <div className="absolute top-24 -right-[2px] w-[2px] h-12 bg-[#2a2a2a] rounded-r-sm"></div>
                        <div className="absolute top-20 -left-[2px] w-[2px] h-8 bg-[#2a2a2a] rounded-l-sm"></div>
                        <div className="absolute top-32 -left-[2px] w-[2px] h-12 bg-[#2a2a2a] rounded-l-sm"></div>
                    </div>
                </div>
            </div>
        </div>
    ];

    return (
        <section className="py-24 bg-black relative" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-4">
                <Reveal className="mb-12">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                        {t('featureTiles', 'HeadlinePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Complete Ecosystem</span><span className="text-purple-400 animate-pulse">_</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl">
                        {t('featureTiles', 'Subheadline')}
                    </p>
                </Reveal>

                {/* Desktop: Grid Layout */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {widgets.map((widget, index) => (
                        <Reveal key={index} delay={100 * (index + 1)}>
                            {widget}
                        </Reveal>
                    ))}
                </div>

                {/* Mobile: Horizontal Scrolling Carousel with Drop Animation */}
                <div className="md:hidden relative overflow-hidden">
                    <div
                        className={`flex gap-4 overflow-x-auto pb-4 px-2 snap-x snap-mandatory scrollbar-hide transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        {widgets.map((widget, index) => (
                            <div
                                key={index}
                                className={`snap-center transition-all duration-500`}
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                                    opacity: isVisible ? 1 : 0,
                                    transitionDelay: `${index * 100}ms`
                                }}
                            >
                                {widget}
                            </div>
                        ))}
                    </div>

                    {/* Scroll Indicator */}
                    <div className="flex justify-center gap-2 mt-4">
                        <div className="w-8 h-1 bg-purple-500 rounded-full"></div>
                        <div className="w-2 h-1 bg-gray-700 rounded-full"></div>
                        <div className="w-2 h-1 bg-gray-700 rounded-full"></div>
                        <div className="w-2 h-1 bg-gray-700 rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureTiles;
