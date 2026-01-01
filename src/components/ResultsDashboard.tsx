import React, { useState } from 'react';
import { Activity, Search } from 'lucide-react';

const ResultsDashboard: React.FC = () => {
    const [timeRange, setTimeRange] = useState('30D');
    const [unitSize, setUnitSize] = useState(100);

    // MOCK DATA - Hybrid Model Only
    const systems = [
        {
            name: "HYBRID IN-HOUSE MODEL",
            units: "+18.2",
            roi: "12.4%",
            winRate: "55.3%",
            streak: "WWLWW",
            bg: "bg-purple-900/10",
            border: "border-purple-500/30",
            text: "text-purple-400"
        }
    ];

    const bets = [
        { date: "Apr 15", sport: "NBA", pick: "BOS -7.5", odds: "-110", units: "2.0", result: "Win" },
        { date: "Apr 14", sport: "MLB", pick: "NYY Moneyline", odds: "-129", units: "1.5", result: "Loss" },
        { date: "Apr 14", sport: "NFL", pick: "KC -3.5", odds: "-113", units: "1.0", result: "Loss" },
        { date: "Apr 13", sport: "NBA", pick: "LAL Over 224", odds: "-110", units: "2.0", result: "Win" },
        { date: "Apr 13", sport: "NHL", pick: "EDM Puckline", odds: "+140", units: "1.0", result: "Win" },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-[#050505] rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-600/10 rounded-full blur-[80px] pointer-events-none"></div>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10">
                <div className="text-left">
                    <h2 className="text-2xl font-black text-white mb-2 tracking-wide">UNIT RECAP DASHBOARD 2025</h2>
                    <p className="text-gray-500 text-sm max-w-xl">Performance overview for Hybrid In-House Model - tracking units, ROI, and consistency.</p>
                </div>
                <div className="mt-4 md:mt-0 px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-full text-purple-400 text-xs font-bold uppercase tracking-wider animate-pulse">
                    Live Updates Active
                </div>
            </div>

            {/* TOP STATS ROW */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
                <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Last 30-Day</div>
                    <div className="text-4xl font-black text-purple-400">124.6</div>
                    <div className="text-gray-600 text-[10px] mt-1">UNITS PROFIT</div>
                </div>
                <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">YTD Units</div>
                    <div className="text-4xl font-black text-green-400">+642.3</div>
                    <div className="text-gray-600 text-[10px] mt-1">TOTAL PROFIT</div>
                </div>
                <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Win Rate</div>
                    <div className="text-4xl font-black text-white">58.2%</div>
                    <div className="text-gray-600 text-[10px] mt-1">CONSISTENCY</div>
                </div>
                <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Total Bets</div>
                    <div className="text-4xl font-black text-white">1,842</div>
                    <div className="text-gray-600 text-[10px] mt-1">VOLUME</div>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid lg:grid-cols-3 gap-8 relative z-10">

                {/* COL 1: MODEL PERFORMANCE CARD */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {systems.map((sys, i) => (
                        <div key={i} className={`${sys.bg} border ${sys.border} p-8 rounded-3xl relative overflow-hidden flex-1`}>
                            <div className="flex justify-between items-start mb-8">
                                <div className="text-sm font-black text-white uppercase tracking-widest">{sys.name}</div>
                                <Activity size={24} className={sys.text} />
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <div className="text-gray-400 text-xs">Net Units</div>
                                    <div className={`text-3xl font-black ${sys.text}`}>{sys.units}</div>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <div className="text-gray-400 text-xs">ROI %</div>
                                    <div className="text-xl font-bold text-white">{sys.roi}</div>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <div className="text-gray-400 text-xs">Win Rate %</div>
                                    <div className="text-xl font-bold text-white">{sys.winRate}</div>
                                </div>
                            </div>

                            {/* Week's Streak Graphic */}
                            <div className="mt-8">
                                <div className="text-[10px] text-gray-500 uppercase mb-2">Recent Form</div>
                                <div className="flex gap-1 h-8 items-end">
                                    <div className="w-2 bg-green-500/20 h-[60%] rounded-sm"></div>
                                    <div className="w-2 bg-green-500/40 h-[80%] rounded-sm"></div>
                                    <div className="w-2 bg-red-500/40 h-[40%] rounded-sm"></div>
                                    <div className="w-2 bg-green-500/60 h-[90%] rounded-sm"></div>
                                    <div className="w-2 bg-green-500 h-full rounded-sm"></div>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 bg-black/40 border border-gray-700/50 rounded-xl text-xs font-bold text-white hover:bg-gray-800 transition-colors uppercase tracking-wider">
                                View Full Bet Log
                            </button>
                        </div>
                    ))}
                </div>

                {/* COL 2 & 3: GRAPH & CALCULATOR */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* GRAPH */}
                    <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-6 h-[300px] flex flex-col relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold">Units Over Time</h3>
                            <div className="flex gap-2">
                                {['30 Days', '60 Days', 'YTD'].map(r => (
                                    <button key={r} onClick={() => setTimeRange(r)} className={`px-3 py-1 text-[10px] font-bold rounded-lg ${timeRange === r ? 'bg-gray-700 text-white' : 'text-gray-600 hover:text-gray-400'}`}>{r}</button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full relative">
                            <svg viewBox="0 0 400 100" className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,80 C50,70 100,85 150,50 S250,55 300,30 S350,20 400,10"
                                    fill="url(#graphGradient)"
                                    stroke="#a855f7"
                                    strokeWidth="3"
                                    vectorEffect="non-scaling-stroke"
                                />
                                {/* Floating Tag */}
                                <g transform="translate(300, 30)">
                                    <rect x="-40" y="-35" width="80" height="25" rx="6" fill="#1f2937" stroke="#374151" />
                                    <text x="0" y="-18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">+1,612.5 Units</text>
                                    <circle cx="0" cy="0" r="4" fill="#fff" stroke="#a855f7" strokeWidth="2" />
                                </g>
                            </svg>
                        </div>
                    </div>

                    {/* SPLIT ROW: BET LOG & CALCULATOR */}
                    <div className="grid md:grid-cols-2 gap-6 flex-1">

                        {/* BET LOG */}
                        <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-bold text-sm">Recent Bet Log</h3>
                                <Search size={14} className="text-gray-600" />
                            </div>
                            <div className="space-y-3">
                                {bets.slice(0, 4).map((bet, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div>
                                            <div className="font-bold text-white mb-0.5">{bet.pick}</div>
                                            <div className="text-gray-500">{bet.date} • {bet.sport}</div>
                                        </div>
                                        <div className={`font-bold ${bet.result === 'Win' ? 'text-green-400' : 'text-red-400'}`}>
                                            {bet.result === 'Win' ? '+' : '-'}{bet.units}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CALCULATOR / "A $100 BETTOR IS UP" */}
                        <div className="bg-[#0A0A0A] border border-gray-800 rounded-3xl p-6 flex flex-col">
                            <div className="mb-6">
                                <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">If You Followed ProPickz...</div>
                                <h3 className="text-xl font-black text-white">A <span className="text-green-500">${unitSize} UNIT</span> BETTOR IS UP</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
                                    <div className="text-green-400 font-black text-2xl">${(642.3 * unitSize).toLocaleString()}</div>
                                    <div className="text-gray-600 text-[10px] font-bold uppercase">Total Profit</div>
                                </div>
                                <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
                                    <div className="text-white font-bold text-xl">${(164.45 * unitSize).toLocaleString()}</div>
                                    <div className="text-gray-600 text-[10px] font-bold uppercase">Final Bankroll</div>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center">
                                <div className="text-gray-500 text-xs">Select Unit Size:</div>
                                <div className="flex gap-2">
                                    {[50, 100, 250].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setUnitSize(s)}
                                            className={`px-3 py-1 rounded bg-gray-800 text-xs font-bold hover:bg-gray-700 transition-colors ${unitSize === s ? 'text-white border border-gray-600' : 'text-gray-500 border border-transparent'}`}
                                        >
                                            ${s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default ResultsDashboard;
