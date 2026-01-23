import React from 'react';
import { Users, Shield, BookOpen, Wallet, BarChart2, TrendingUp, Wrench, Gift, Bell } from 'lucide-react';
import { Reveal } from '../utils/Reveal';
import { useLanguage } from '../contexts/LanguageContext';

// Import winning slip images for Widget 3
import img2 from '../assets/slip2.png';
import img3 from '../assets/slip3.png';
import img4 from '../assets/slip4.png';
import img5 from '../assets/slip5.png';
import img6 from '../assets/slip6.png';
import img8 from '../assets/slip8.png';
import imgNew1 from '../assets/IMG_7871.png';
import imgNew2 from '../assets/IMG_7872.png';
import imgNew3 from '../assets/IMG_7875.jpg';
import imgNew4 from '../assets/IMG_7876.jpg';
import imgNew5 from '../assets/IMG_7877.jpg';

const FeatureTiles: React.FC = () => {
    const { t } = useLanguage();
    const slipImages = [imgNew1, imgNew2, imgNew3, imgNew4, imgNew5, img2, img3, img4, img5, img6, img8];

    return (
        <section className="py-24 bg-black relative">
            <div className="max-w-7xl mx-auto px-4">
                <Reveal className="mb-12">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                        {t('featureTiles', 'HeadlinePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">{t('featureTiles', 'HeadlineHighlight')}</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl">
                        {t('featureTiles', 'Subheadline')}
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-fr">

                    {/* --- WIDGET 1: INSIDE THE WINNING ROOM --- */}
                    <Reveal delay={100} className="md:col-span-2 rounded-[2rem] bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] p-6 relative overflow-hidden border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group h-full min-h-[400px]">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-white mb-1">Inside the Winning Room</h3>
                                <p className="text-sm text-indigo-200/70">All plays, alerts, and updates delivered in one place</p>
                            </div>

                            {/* Notifications Stack */}
                            <div className="flex-1 flex flex-col gap-3 mt-2 overflow-hidden mask-linear-fade">
                                {/* Notification 1 */}
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl flex gap-3 shadow-lg transform transition-transform hover:scale-[1.02]">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-inner">
                                        <Bell size={20} className="text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="text-white font-bold text-xs">NBA Pick</span>
                                            <span className="text-gray-400 text-[10px]">now</span>
                                        </div>
                                        <div className="text-indigo-100 text-xs truncate">Pelicans +1.5 vs Mavericks</div>
                                        <div className="text-green-400 text-[10px] font-mono mt-0.5">Odds: +125</div>
                                    </div>
                                </div>
                                {/* Notification 2 */}
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl flex gap-3 shadow-lg transform transition-transform hover:scale-[1.02]">
                                    <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shrink-0 shadow-inner">
                                        <Bell size={20} className="text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="text-white font-bold text-xs">CFB Pick</span>
                                            <span className="text-gray-400 text-[10px]">2m</span>
                                        </div>
                                        <div className="text-purple-100 text-xs truncate">Princeton +8.5 vs Temple</div>
                                        <div className="text-green-400 text-[10px] font-mono mt-0.5">Odds: +110</div>
                                    </div>
                                </div>
                                {/* Notification 3 */}
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl flex gap-3 shadow-lg transform transition-transform hover:scale-[1.02]">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                                        <Bell size={20} className="text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="text-white font-bold text-xs">NFL Pick</span>
                                            <span className="text-gray-400 text-[10px]">5m</span>
                                        </div>
                                        <div className="text-blue-100 text-xs truncate">SF 49ers vs IND Colts</div>
                                        <div className="text-green-400 text-[10px] font-mono mt-0.5">Over 46.5</div>
                                    </div>
                                </div>
                                {/* Notification 4 */}
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl flex gap-3 shadow-lg transform transition-transform hover:scale-[1.02] opacity-70">
                                    <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shrink-0 shadow-inner">
                                        <Bell size={20} className="text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="text-white font-bold text-xs">NHL Pick</span>
                                            <span className="text-gray-400 text-[10px]">12m</span>
                                        </div>
                                        <div className="text-teal-100 text-xs truncate">Flyers ML vs Canucks</div>
                                        <div className="text-green-400 text-[10px] font-mono mt-0.5">WIN</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* --- WIDGET 2: THE ALGORITHM --- */}
                    <Reveal delay={200} className="md:col-span-2 rounded-[2rem] bg-[#0c0c0c] p-6 relative overflow-hidden border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group h-full min-h-[400px]">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-white mb-1">The Algorithm</h3>
                                <p className="text-sm text-gray-400">Data-driven insights</p>
                            </div>

                            {/* Terminal Window */}
                            <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden font-mono text-[10px] sm:text-xs shadow-2xl">
                                <div className="bg-[#2d2d2d] px-3 py-2 flex gap-1.5 border-b border-white/5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                </div>
                                <div className="p-3 text-gray-300 space-y-2 overflow-hidden">
                                    <div>
                                        <span className="text-blue-400">picks</span> = <span className="text-yellow-300">sports_picks</span>.<span className="text-blue-300">get_today_picks</span>()
                                    </div>
                                    <div className="pl-0 text-gray-500"># Analyze matchups</div>
                                    <div className="space-y-1">
                                        <div className="flex gap-2">
                                            <span className="text-green-400">➜</span>
                                            <span>Lakers vs. Clippers</span>
                                        </div>
                                        <div className="pl-5 text-blue-300">Spread: -3.5 <span className="text-green-400">(+105)</span></div>

                                        <div className="flex gap-2 mt-2">
                                            <span className="text-green-400">➜</span>
                                            <span>Celtics vs. Heat</span>
                                        </div>
                                        <div className="pl-5 text-blue-300">Moneyline: <span className="bg-green-500/20 text-green-300 px-1 rounded">WIN</span> (-120)</div>

                                        <div className="flex gap-2 mt-2">
                                            <span className="text-green-400">➜</span>
                                            <span>Yankees vs. Red Sox</span>
                                        </div>
                                        <div className="pl-5 text-blue-300">Moneyline: <span className="bg-green-500/20 text-green-300 px-1 rounded">WIN</span> (+110)</div>
                                    </div>
                                    <div className="animate-pulse text-green-500 mt-2">_</div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* --- WIDGET 5: EXCLUSIVE GIVEAWAYS --- */}
                    <Reveal delay={300} className="md:col-span-2 rounded-[2rem] bg-gradient-to-br from-amber-600 to-yellow-700 p-6 relative overflow-hidden border border-white/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group h-full min-h-[400px] hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all">
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
                    </Reveal>

                    {/* --- WIDGET 4: BETTING ACADEMY (Existing Content) --- */}
                    <Reveal delay={400} className="md:col-span-3 rounded-[2rem] bg-gradient-to-br from-[#064e3b] to-[#0f2e2a] p-8 relative overflow-hidden border border-white/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group min-h-[350px]">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex flex-col items-start gap-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
                                        <BookOpen size={24} className="text-emerald-300" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-white leading-none">{t('learning', 'Headline')}</h3>
                                </div>
                                <p className="text-emerald-200/80 text-base md:text-lg leading-relaxed max-w-2xl">{t('learning', 'Subheadline')}</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/10 flex flex-col gap-2 hover:bg-white/10 transition-colors">
                                    <Wallet size={16} className="text-emerald-300" />
                                    <span className="text-white text-xs font-bold">{t('learning', 'BankrollTitle')}</span>
                                </div>
                                <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/10 flex flex-col gap-2 hover:bg-white/10 transition-colors">
                                    <Users size={16} className="text-purple-300" />
                                    <span className="text-white text-xs font-bold">{t('learning', 'StrategyTitle')}</span>
                                </div>
                                <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/10 flex flex-col gap-2 hover:bg-white/10 transition-colors">
                                    <BarChart2 size={16} className="text-blue-300" />
                                    <span className="text-white text-xs font-bold">{t('learning', 'EdgeTitle')}</span>
                                </div>
                                <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/10 flex flex-col gap-2 hover:bg-white/10 transition-colors">
                                    <TrendingUp size={16} className="text-orange-300" />
                                    <span className="text-white text-xs font-bold">{t('learning', 'ClvTitle')}</span>
                                </div>
                                <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/10 flex flex-col gap-2 hover:bg-white/10 transition-colors">
                                    <Wrench size={16} className="text-gray-300" />
                                    <span className="text-white text-xs font-bold">{t('learning', 'ToolsTitle')}</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* --- WIDGET 3: REAL BETTING SLIPS --- */}
                    <Reveal delay={500} className="md:col-span-3 rounded-[2rem] bg-[#111] p-0 relative overflow-hidden border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group min-h-[350px] flex flex-col">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                        <div className="p-8 pb-4 relative z-10 bg-gradient-to-b from-black/80 to-transparent">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/30">
                                    <Shield size={20} className="text-purple-300" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Real User Wins</h3>
                            </div>
                            <p className="text-sm text-gray-400 pl-[3.25rem]">Verified community results</p>
                        </div>

                        {/* Slips Marquee/Carousel */}
                        <div className="flex-1 overflow-hidden relative flex items-center">
                            <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused] px-4">
                                {/* Set 1 */}
                                {slipImages.map((src, i) => (
                                    <div key={`w3-s1-${i}`} className="w-60 md:w-80 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg transform rotate-1 hover:rotate-0 transition-all duration-300 group/image">
                                        <img src={src} alt="Win" className="w-full h-auto opacity-80 group-hover/image:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                                {/* Set 2 */}
                                {slipImages.map((src, i) => (
                                    <div key={`w3-s2-${i}`} className="w-60 md:w-80 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg transform rotate-1 hover:rotate-0 transition-all duration-300 group/image">
                                        <img src={src} alt="Win" className="w-full h-auto opacity-80 group-hover/image:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                            {/* Gradient Fade Sides */}
                            <div className="absolute inset-y-0 left-0 w-8 md:w-12 bg-gradient-to-r from-[#111] to-transparent z-10"></div>
                            <div className="absolute inset-y-0 right-0 w-8 md:w-12 bg-gradient-to-l from-[#111] to-transparent z-10"></div>
                        </div>
                    </Reveal>

                </div>
            </div>
        </section>
    );
};

export default FeatureTiles;
