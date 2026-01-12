import React from 'react';
import { Gift, Trophy, Star } from 'lucide-react';

const CommunityBenefits: React.FC = () => {
    return (
        <div className="grid md:grid-cols-2 gap-8 mb-20">

            {/* LOTTERY WIDGET */}
            <div className="relative bg-[#0A0A0A] border border-yellow-500/30 rounded-3xl p-8 overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-yellow-500/20 transition-all duration-700"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                            <Gift className="text-yellow-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-wider">The Propickz Lottery</h3>
                            <p className="text-xs text-yellow-500 font-bold uppercase tracking-widest"> Monthly Member Giveback</p>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 mb-6 text-center">
                        <p className="text-gray-500 text-xs font-bold uppercase mb-2">Current Month's Pot</p>
                        <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-lg">
                            $4,250
                        </div>
                        <p className="text-gray-400 text-xs mt-2">Growing daily with every winning slip.</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-gray-300">Last Winner</span>
                            <span className="text-white font-bold font-mono">@jason_k (+$2,100)</span>
                        </div>
                        <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-gray-300">Next Draw</span>
                            <span className="text-yellow-400 font-bold"> in 4 Days</span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-start gap-2 text-xs text-gray-400">
                        <Star size={12} className="text-yellow-500 mt-0.5 shrink-0" />
                        <p>50% of our profits go into the pot. One random member (Free or Paid) takes half. We win, you win.</p>
                    </div>
                </div>
            </div>

            {/* COMMUNITY WINS WIDGET */}
            <div className="relative bg-[#0A0A0A] border border-green-500/30 rounded-3xl p-8 overflow-hidden group">
                <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-green-500/20 transition-all duration-700"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/30">
                            <Trophy className="text-green-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-wider">Community Wins</h3>
                            <p className="text-xs text-green-500 font-bold uppercase tracking-widest"> We Eat Together</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { u: "topg_betting", w: "$12,400", m: "NBA Parlay Hit" },
                            { u: "sarah_wins", w: "$3,200", m: "Straight Bet Streak" },
                            { u: "mike_v", w: "$850", m: "Lottery Winner" },
                        ].map((win, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-green-500/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                                        {win.u.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">@{win.u}</div>
                                        <div className="text-gray-500 text-xs">{win.m}</div>
                                    </div>
                                </div>
                                <div className="text-green-400 font-black text-lg">{win.w}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-green-900/10 border border-green-500/20 rounded-xl text-center">
                        <p className="text-green-400 text-sm font-bold"> "Paid for my yearly sub in one week." </p>
                        <p className="text-gray-500 text-xs mt-1"> - Verified Member Review </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CommunityBenefits;
