import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Calendar, Eye } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

const EarningsPopup: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [displayValue, setDisplayValue] = useState('****');
    const [isDecrypting, setIsDecrypting] = useState(false);
    const { t, language } = useLanguage();

    const finalValue = '1,450';
    const chars = '0123456789$#@!%&*';

    useEffect(() => {
        // Show popup after 7 seconds delay (shows on every page load/refresh)
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 7000);

        return () => clearTimeout(timer);
    }, []);

    // Encrypted reveal animation
    useEffect(() => {
        if (isRevealed && !isDecrypting) {
            setIsDecrypting(true);
            let iterations = 0;
            const maxIterations = 15;

            const interval = setInterval(() => {
                iterations++;

                if (iterations >= maxIterations) {
                    setDisplayValue(finalValue);
                    clearInterval(interval);
                    setIsDecrypting(false);
                } else {
                    const progress = iterations / maxIterations;
                    const revealedChars = Math.floor(finalValue.length * progress);

                    let scrambled = '';
                    for (let i = 0; i < finalValue.length; i++) {
                        if (i < revealedChars) {
                            scrambled += finalValue[i];
                        } else if (finalValue[i] === ',') {
                            scrambled += ',';
                        } else {
                            scrambled += chars[Math.floor(Math.random() * chars.length)];
                        }
                    }
                    setDisplayValue(scrambled);
                }
            }, 80);

            return () => clearInterval(interval);
        }
    }, [isRevealed]);

    if (!isVisible) return null;

    // Get previous month name based on language
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const lastMonthName = date.toLocaleString(language === 'fr' ? 'fr-FR' : 'default', { month: 'long' });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
                onClick={() => setIsVisible(false)}
            />

            {/* Popup Content */}
            <div className="relative bg-[#0f0f11] border border-purple-500/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-fade-in-up scale-100 transform transition-all overflow-hidden">
                {/* Textured matte background overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 pointer-events-none"></div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full z-10"
                >
                    <X size={20} />
                </button>

                <div className="text-center space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest font-heading">
                        <Calendar size={12} />
                        <span className="uppercase">{lastMonthName}</span> {t('popup', 'Recap')}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl text-gray-300">
                            {t('popup', 'IfJoined')}
                            <span className="font-bold text-2xl ml-1 bg-gradient-to-r from-purple-400 via-violet-500 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-text-shimmer">
                                {t('popup', 'LastMonth')}
                            </span>
                        </h3>
                        <p className="text-gray-500 text-sm">{t('popup', 'MadeApprox')}</p>
                    </div>

                    <div
                        className="bg-gradient-to-br from-green-500/10 to-green-900/10 border border-green-500/20 rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-all hover:border-green-500/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]"
                        onClick={() => setIsRevealed(true)}
                    >
                        {/* Green grid pattern overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,197,94,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.08)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                        {/* Subtle green glow in the center */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/20 rounded-full blur-[40px] pointer-events-none"></div>
                        <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors duration-500"></div>

                        {!isRevealed && (
                            <div className="absolute inset-0 z-20 backdrop-blur-md flex items-center justify-center bg-black/10 transition-all duration-500">
                                <div className="bg-black/80 px-5 py-2.5 rounded-full border border-green-500/50 text-green-400 text-sm font-bold flex items-center gap-2 shadow-lg animate-pulse hover:scale-105 transition-transform">
                                    <Eye size={16} />
                                    {t('popup', 'Reveal') || 'Tap to Reveal'}
                                </div>
                            </div>
                        )}

                        <div className={`relative z-10 flex flex-col items-center justify-center transition-all duration-700 ${!isRevealed ? 'opacity-40 blur-lg scale-90' : 'opacity-100 blur-0 scale-100'}`}>
                            <div className="text-sm font-bold text-green-400 mb-1 uppercase tracking-wider">{t('popup', 'NetProfit')}</div>
                            <div className="text-5xl font-black text-green-400 tracking-tight flex items-center gap-1 font-mono">
                                <span className="text-3xl opacity-80">$</span>
                                <span className={isDecrypting ? 'animate-pulse' : ''}>{displayValue}</span>
                            </div>
                            <div className="text-xs text-green-500/60 mt-2 font-mono">+14.5 {t('popup', 'Units')}</div>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={() => {
                                setIsVisible(false);
                                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full py-4 bg-white text-black font-bold text-lg rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
                        >
                            <TrendingUp size={20} />
                            {t('popup', 'CTA')}
                        </button>
                        <p className="text-xs text-gray-600 mt-4 italic">
                            {t('popup', 'Disclaimer')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarningsPopup;
