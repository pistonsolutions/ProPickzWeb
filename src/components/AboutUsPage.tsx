import React from 'react';
import { Reveal } from '../utils/Reveal';
import { ChevronDown, TrendingUp, Users, Target, CheckCircle, ArrowRight, Shield, LayoutDashboard, Gift, BookOpen } from 'lucide-react';

const AboutUsPage: React.FC = () => {
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
                            The ProPickz Standard
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-6 tracking-tight">
                            Bet Like a <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                                Professional.
                            </span>
                        </h1>
                    </Reveal>

                    <Reveal delay={200}>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                            We’re not just here to give you picks. We’re here to change the way you look at sports betting—forever.
                            <span className="text-white font-medium block mt-2">Data-Driven. Transparent. Disciplined.</span>
                        </p>
                    </Reveal>

                    <Reveal delay={400}>
                        <div className="grid grid-cols-3 gap-4 md:gap-12 mt-12 max-w-3xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl md:text-5xl font-black text-white mb-2">18+</div>
                                <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">Years Experience</div>
                            </div>
                            <div className="text-center border-l border-gray-800 pl-4 md:pl-12">
                                <div className="text-3xl md:text-5xl font-black text-white mb-2">2.4k+</div>
                                <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">Active Members</div>
                            </div>
                            <div className="text-center border-l border-gray-800 pl-4 md:pl-12">
                                <div className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600 mb-2">$214k+</div>
                                <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">Projected Profit</div>
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
                                <h3 className="text-3xl font-black text-white mb-6">Built on Frustration.<br />Fueled by Math.</h3>
                                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                    We were tired of watching bettors lose money chasing "locks" from influencers with zero accountability. The industry was broken—full of hype, fake lifestyles, and deleted loss posts.
                                </p>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    ProPickz started as a small private group of disciplined bettors. We focused on one thing: <span className="text-white font-bold">Finding the Edge.</span> No gut feelings. No bias. Just probability, math, and execution.
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
                                    <h4 className="text-xl font-bold text-white mb-2">Long-Term Vision</h4>
                                    <p className="text-gray-400">We don't chase get-rich-quick schemes. We play the statistics, compounding small edges into massive gains over time.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800 shrink-0">
                                    <Users className="text-blue-500" size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Community First</h4>
                                    <p className="text-gray-400">We win together. Our Discord isn't just a feed of picks—it's a classroom where you learn to become a sharper bettor.</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* WHY TRUST US SECTION */}
            <section className="py-32 bg-gradient-to-b from-black to-[#050505] relative">
                <div className="max-w-7xl mx-auto px-4">
                    <Reveal className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold uppercase tracking-widest text-blue-400 mb-6 font-heading">
                            <Shield size={14} /> The ProPickz Guarantee
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Built to Beat the Books. <span className="text-blue-500">Consistently.</span></h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">There's a reason our members stick around. Here is exactly why ProPickz is built different.</p>
                    </Reveal>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 1. Transparency */}
                        <Reveal delay={100} className="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl hover:bg-gray-900/60 transition-colors group">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <LayoutDashboard className="text-blue-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Full Transparency</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                We don't cherry-pick wins or delete losses. Every single pick is tracked in our public Result-Tracker, visible to everyone. <span className="text-gray-200 font-medium">Real record. Real ROI. Real trust.</span>
                            </p>
                        </Reveal>

                        {/* 2. Guarantee */}
                        <Reveal delay={200} className="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl hover:bg-gray-900/60 transition-colors group">
                            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Shield className="text-green-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Profit or Money Back</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                If you follow our plays and don't profit, you get your money back. No questions asked. <span className="text-gray-200 font-medium">No other group offers that level of accountability.</span>
                            </p>
                        </Reveal>

                        {/* 3. Rewards */}
                        <Reveal delay={300} className="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl hover:bg-gray-900/60 transition-colors group">
                            <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Gift className="text-yellow-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Member Rewards</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                50% of our own gambling profits go back into the Member Lottery. As we win, the pot grows, and we give it away to random members. <span className="text-gray-200 font-medium">When we win, you win too.</span>
                            </p>
                        </Reveal>

                        {/* 4. Education */}
                        <Reveal delay={400} className="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl hover:bg-gray-900/60 transition-colors group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <BookOpen className="text-purple-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Learn While You Earn</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Whether you're a beginner or a veteran, our Education Hub helps you understand every pick. We teach you how to fish, not just feed you.
                            </p>
                        </Reveal>

                        {/* 5. Clarity */}
                        <Reveal delay={500} className="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl hover:bg-gray-900/60 transition-colors group">
                            <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <CheckCircle className="text-pink-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Clarity Over Clutter</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                No spam. No chaos. No 100 unread channels. Our layout is clean, minimal, and easy to follow. Everything you need, nothing you don't.
                            </p>
                        </Reveal>

                        {/* 6. Quality */}
                        <Reveal delay={600} className="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl hover:bg-gray-900/60 transition-colors group">
                            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Target className="text-red-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Quality Over Quantity</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                We don't flood you with 20 random bets a day. We post only when there's a clear statistical edge backed by expert review. <span className="text-gray-200 font-medium">Consistent profit over volume.</span>
                            </p>
                        </Reveal>

                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-24 text-center px-4">
                <Reveal>
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-8">Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Upgrade?</span></h2>
                    <button
                        onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
                        className="px-10 py-5 bg-white text-black font-black text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto"
                    >
                        Start Winning Today <ArrowRight size={20} />
                    </button>
                </Reveal>
            </section>

        </div>
    );
};

export default AboutUsPage;
