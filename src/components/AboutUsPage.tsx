import React from 'react';
import { Reveal } from '../utils/Reveal';
import { ChevronDown, TrendingUp, Users, Target, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutUsPage: React.FC = () => {
    const { t } = useLanguage();

    const scrollToNext = () => {
        const nextSection = document.getElementById('mission');
        if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
            {/* Global Background Noise */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            {/* HERO SECTION */}
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4">
                {/* Dynamic Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 max-w-5xl mx-auto space-y-8">
                    <Reveal>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 backdrop-blur-md">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                            {t('about', 'Standard')}
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-6 tracking-tight">
                            {t('about', 'Title')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                                {t('about', 'TitleHighlight')}
                            </span>
                        </h1>
                    </Reveal>

                    <Reveal delay={200}>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                            {t('about', 'Description')}
                            <span className="text-white font-medium block mt-2">{t('about', 'Keywords')}</span>
                        </p>
                    </Reveal>

                    <Reveal delay={400}>
                        <div className="grid grid-cols-3 gap-4 md:gap-12 mt-12 max-w-3xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl md:text-5xl font-black text-white mb-2">{t('about', 'Stat1Value')}</div>
                                <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">{t('about', 'Stat1Label')}</div>
                            </div>
                            <div className="text-center border-l border-gray-800 pl-4 md:pl-12">
                                <div className="text-3xl md:text-5xl font-black text-white mb-2">{t('about', 'Stat2Value')}</div>
                                <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">{t('about', 'Stat2Label')}</div>
                            </div>
                            <div className="text-center border-l border-gray-800 pl-4 md:pl-12">
                                <div className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600 mb-2">{t('about', 'Stat3Value')}</div>
                                <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">{t('about', 'Stat3Label')}</div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                <button
                    onClick={scrollToNext}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 text-gray-600 hover:text-white transition-colors animate-bounce"
                >
                    <ChevronDown size={32} />
                </button>
            </section>

            {/* MISSION & ORIGIN */}
            <section id="mission" className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
                    <Reveal>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-20 blur-xl"></div>
                            <div className="relative bg-[#0A0A0A] border border-gray-800 p-10 rounded-3xl overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Target size={200} className="text-white" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-6 whitespace-pre-line">{t('about', 'MissionTitle')}</h3>
                                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                    {t('about', 'MissionText1')}
                                </p>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    {t('about', 'MissionText2')}
                                </p>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={200}>
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800 shrink-0">
                                    <TrendingUp className="text-green-500" size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">{t('about', 'VisionTitle')}</h4>
                                    <p className="text-gray-400">{t('about', 'VisionText')}</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800 shrink-0">
                                    <Users className="text-blue-500" size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">{t('about', 'CommunityTitle')}</h4>
                                    <p className="text-gray-400">{t('about', 'CommunityText')}</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>



            {/* FINAL CTA */}
            <section className="py-24 text-center px-4">
                <Reveal>
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-8">{t('about', 'CTA')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{t('about', 'CTAHighlight')}</span></h2>
                    <button
                        onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
                        className="px-10 py-5 bg-white text-black font-black text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto"
                    >
                        {t('about', 'Button')} <ArrowRight size={20} />
                    </button>
                </Reveal>
            </section>

        </div>
    );
};

export default AboutUsPage;
