import React from 'react';
import { Users, Cpu, BarChart2, Shield } from 'lucide-react';
import { Reveal } from '../utils/Reveal';

const FeatureTiles: React.FC = () => {
    return (
        <section className="py-24 bg-black relative">
            <div className="max-w-7xl mx-auto px-4">
                <Reveal className="mb-16">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Complete Ecosystem.</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl">
                        A fully integrated suite designed for one purpose: profit.
                    </p>
                </Reveal>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* TILE 1: COMMUNITY (Purple/Indigo) */}
                    <Reveal delay={100} className="rounded-[2.5rem] bg-gradient-to-br from-purple-800 to-indigo-900 p-8 h-[500px] relative overflow-hidden group border border-white/10 hover:shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all duration-500 hover:-translate-y-2">
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="bg-black/20 backdrop-blur-md w-fit px-4 py-2 rounded-full mb-6 flex items-center gap-2 border border-white/10">
                                <Users size={16} className="text-purple-200" />
                                <span className="text-purple-100 font-bold text-xs uppercase tracking-wider">Elite Circle</span>
                            </div>

                            <h3 className="text-3xl font-black text-white mb-4 leading-tight">
                                Your New Inner Circle.
                            </h3>
                            <p className="text-white/80 font-medium text-lg mb-8">
                                Connect with sharp bettors and pro analysts in our exclusive Discord. The alpha is real.
                            </p>

                            {/* Visual: Chat Mockup - Purple Theme */}
                            <div className="flex-1 relative">
                                <div className="absolute top-0 right-0 w-[120%] h-full bg-black/20 backdrop-blur-sm rounded-tl-2xl border-t border-l border-white/10 p-4 space-y-3 transform translate-x-4">
                                    <div className="flex gap-3 animate-fade-in-up delay-100">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">K</div>
                                        <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none text-sm text-white backdrop-blur-sm">
                                            Anyone seeing this line movement? 📉
                                        </div>
                                    </div>
                                    <div className="flex gap-3 animate-fade-in-up delay-300">
                                        <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-xs">P</div>
                                        <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none text-sm text-white backdrop-blur-sm">
                                            Already locked it in. +250 value! 🔒
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* TILE 2: TECH (Pink/Fuchsia) */}
                    <Reveal delay={200} className="rounded-[2.5rem] bg-gradient-to-br from-pink-700 to-rose-900 p-8 h-[500px] relative overflow-hidden group border border-white/10 hover:shadow-[0_0_50px_rgba(236,72,153,0.4)] transition-all duration-500 hover:-translate-y-2">
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="bg-black/20 backdrop-blur-md w-fit px-4 py-2 rounded-full mb-6 flex items-center gap-2 border border-white/10">
                                <Cpu size={16} className="text-pink-200" />
                                <span className="text-pink-100 font-bold text-xs uppercase tracking-wider">Proprietary Tech</span>
                            </div>

                            <h3 className="text-3xl font-black text-white mb-4 leading-tight">
                                Unfair Advantage.
                            </h3>
                            <p className="text-white/80 font-medium text-lg mb-8">
                                Stop guessing. Start using institutional-grade tools and data visualization to find the edge.
                            </p>

                            {/* Visual: Nodes/Graph - Pink Theme */}
                            <div className="flex-1 relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
                                <div className="relative z-10 flex gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center animate-bounce-slow">
                                        <BarChart2 className="text-pink-300" size={32} />
                                    </div>
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center animate-bounce-slow" style={{ animationDelay: '0.2s' }}>
                                        <Cpu className="text-pink-300" size={32} />
                                    </div>
                                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-pink-500/50 -z-10 blur-[1px]"></div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* TILE 3: PICKS (Gold/Amber) */}
                    <Reveal delay={300} className="rounded-[2.5rem] bg-gradient-to-br from-amber-600 to-yellow-800 p-8 h-[500px] relative overflow-hidden group border border-white/10 hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all duration-500 hover:-translate-y-2">
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="bg-black/20 backdrop-blur-md w-fit px-4 py-2 rounded-full mb-6 flex items-center gap-2 border border-white/10">
                                <Shield size={16} className="text-amber-200" />
                                <span className="text-amber-100 font-bold text-xs uppercase tracking-wider">Gold Standard</span>
                            </div>

                            <h3 className="text-3xl font-black text-white mb-4 leading-tight">
                                Winning Slips Daily.
                            </h3>
                            <p className="text-white/80 font-medium text-lg mb-8">
                                High-confidence plays delivered straight to your phone. Validated, tracked, and ready to tail.
                            </p>

                            {/* Visual: Bet Slips - Gold Theme */}
                            <div className="flex-1 relative space-y-3 pt-4">
                                <div className="bg-black/30 backdrop-blur-md border border-amber-500/30 rounded-xl p-3 flex justify-between items-center transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">VIP</div>
                                        <div className="text-white text-sm font-bold">MIA Heat -4</div>
                                    </div>
                                    <span className="text-amber-300 font-bold bg-amber-500/20 px-2 py-1 rounded text-xs">WIN</span>
                                </div>
                                <div className="bg-black/30 backdrop-blur-md border border-amber-500/30 rounded-xl p-3 flex justify-between items-center transform rotate-1 hover:rotate-0 transition-transform duration-300 ml-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">VIP</div>
                                        <div className="text-white text-sm font-bold">O. 54.5 P+R</div>
                                    </div>
                                    <span className="text-amber-300 font-bold bg-amber-500/20 px-2 py-1 rounded text-xs">WIN</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default FeatureTiles;
