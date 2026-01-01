
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Calendar } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

const EarningsPopup: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t, language } = useLanguage();

    useEffect(() => {
        // Check if the user has already seen the popup in this session
        const hasSeenPopup = sessionStorage.getItem('hasSeenEarningsPopup');

        if (!hasSeenPopup) {
            // Small delay to make it feel natural, then show
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem('hasSeenEarningsPopup', 'true');
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, []);

    if (!isOpen) return null;

    // Get previous month name based on language
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const lastMonthName = date.toLocaleString(language === 'fr' ? 'fr-FR' : 'default', { month: 'long' });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsOpen(false)}
            />

            {/* Popup Content */}
            <div className="relative bg-[#0f0f11] border border-purple-500/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-fade-in-up scale-100 transform transition-all">

                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full"
                >
                    <X size={20} />
                </button>

                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest font-heading">
                        <Calendar size={12} />
                        <span className="capitalize">{lastMonthName}</span> {t('popup', 'Recap')}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl text-gray-300">{t('popup', 'IfJoined')} <span className="text-white font-bold text-2xl ml-1">{t('popup', 'LastMonth')}</span></h3>
                        <p className="text-gray-500 text-sm">{t('popup', 'MadeApprox')}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-green-900/10 border border-green-500/20 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors duration-500"></div>

                        <div className="relative z-10 flex flex-col items-center justify-center">
                            <div className="text-sm font-bold text-green-400 mb-1 uppercase tracking-wider">{t('popup', 'NetProfit')}</div>
                            <div className="text-5xl font-black text-green-400 tracking-tight flex items-center gap-1">
                                <span className="text-3xl opacity-80">$</span>
                                1,450
                            </div>
                            <div className="text-xs text-green-500/60 mt-2 font-mono">+14.5 {t('popup', 'Units')}</div>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                // Optional: scroll to pricing or do nothing
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
