import React, { useRef } from 'react';
import { TrendingUp, Battery, Wifi, Signal } from 'lucide-react';

const Hero3DPhone: React.FC = () => {
    const phoneRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!phoneRef.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const rotateX = ((mouseY - centerY) / 20).toFixed(2);
        const rotateY = ((mouseX - centerX) / 20).toFixed(2);

        phoneRef.current.style.transform = `perspective(1000px) rotateX(${-parseFloat(rotateX)}deg) rotateY(${rotateY}deg) rotateZ(-6deg)`;
    };

    const handleMouseLeave = () => {
        if (!phoneRef.current) return;
        phoneRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) rotateZ(-6deg)';
    };

    return (
        <div
            ref={containerRef}
            className="relative hidden lg:block perspective-1000 z-50 h-[780px] w-[380px] mx-auto"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={phoneRef}
                className="relative transition-transform duration-100 ease-out will-change-transform"
                style={{
                    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) rotateZ(-6deg)',
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* --- REALISTIC IPHONE FRAME --- */}
                <div className="relative w-[380px] h-[780px] rounded-[55px] mx-auto shadow-[0_50px_100px_rgba(0,0,0,0.7),0_20px_60px_rgba(0,0,0,0.5)] bg-[#1a1a1a]">

                    {/* Titanium Frame Border Gradient */}
                    <div className="absolute inset-0 rounded-[55px] bg-gradient-to-tr from-[#3a3a3a] via-[#1a1a1a] to-[#4a4a4a] p-[3px]">
                        <div className="absolute inset-0 rounded-[52px] bg-[#000000] border-[4px] border-[#252525]/80 shadow-[inset_0_0_10px_2px_rgba(0,0,0,0.8)]"></div>
                    </div>

                    {/* Side Buttons (Left) */}
                    <div className="absolute top-28 -left-[4px] w-[3px] h-8 bg-[#2a2a2a] rounded-l-md shadow-sm"></div>
                    <div className="absolute top-44 -left-[4px] w-[3px] h-16 bg-[#2a2a2a] rounded-l-md shadow-sm"></div>
                    <div className="absolute top-64 -left-[4px] w-[3px] h-16 bg-[#2a2a2a] rounded-l-md shadow-sm"></div>

                    {/* Side Button (Right) */}
                    <div className="absolute top-44 -right-[4px] w-[3px] h-24 bg-[#2a2a2a] rounded-r-md shadow-sm"></div>

                    {/* Screen Container */}
                    <div className="absolute inset-[6px] rounded-[48px] overflow-hidden bg-black z-10 border border-[#333]/30">
                        {/* Dynamic Island */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-40 flex items-center justify-between px-4 transition-all duration-300 hover:w-[130px] shadow-[0_1px_5px_rgba(255,255,255,0.05)] border border-[#1a1a1a]">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0a0a0a] to-[#222] absolute left-1 top-1/2 -translate-y-1/2 opacity-0"></div> {/* Hidden lens effect */}
                            <div className="w-1.5 h-1.5 rounded-full bg-[#111] border border-[#222]"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0500FF]/20 blur-[1px]"></div>
                        </div>

                        {/* Top Bar Info */}
                        <div className="absolute top-3 left-8 right-8 flex justify-between items-center z-30 text-white font-bold text-[13px]">
                            <span>9:41</span>
                            <div className="flex gap-1.5 items-center">
                                <Signal size={14} className="text-white" />
                                <Wifi size={14} className="text-white" />
                                <Battery size={18} className="text-white" />
                            </div>
                        </div>

                        {/* --- SCROLLING CONTENT: LEDGER --- */}
                        <div className="w-full h-full bg-[#050505] flex flex-col relative">
                            {/* Header */}
                            <div className="pt-16 pb-4 px-6 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">Verified Ledger</span>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                        <span className="text-green-500 text-xs font-bold shadow-green-500/20">LIVE</span>
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black text-white italic tracking-tight">October Recap</h2>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar relative pb-20">
                                {/* Gradient overlay at bottom fade */}
                                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10"></div>

                                {[
                                    { date: 'TODAY', match: 'LAL vs PHX', pick: 'LAL -3.5', odds: '-110', result: 'WIN', profit: '+$909' },
                                    { date: 'YESTERDAY', match: 'KC vs BAL', pick: 'Over 48.5', odds: '-110', result: 'WIN', profit: '+$1,200' },
                                    { date: 'OCT 24', match: 'MIA vs BOS', pick: 'MIA +6.5', odds: '-105', result: 'WIN', profit: '+$450' },
                                    { date: 'OCT 23', match: 'NYY vs LAD', pick: 'NYY ML', odds: '+130', result: 'LOSS', profit: '-$500' },
                                    { date: 'OCT 22', match: 'SF vs SEA', pick: 'SF -2', odds: '-110', result: 'WIN', profit: '+$880' },
                                    { date: 'OCT 21', match: 'DAL vs PHI', pick: 'DAL ML', odds: '+105', result: 'WIN', profit: '+$1,050' },
                                    { date: 'OCT 20', match: 'LIV vs CHE', pick: 'Draw', odds: '+280', result: 'WIN', profit: '+$2,800' },
                                    { date: 'OCT 19', match: 'UFC 294', pick: 'Makhachev KO', odds: '+150', result: 'WIN', profit: '+$750' },
                                ].map((bet, i) => (
                                    <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${bet.result === 'WIN' ? 'bg-[#111] border-green-500/20 hover:border-green-500/40' : 'bg-[#111] border-red-500/10'} mb-2 transition-colors relative overflow-hidden`}>
                                        {bet.result === 'WIN' && (
                                            <div className="absolute inset-0 bg-green-500/5 pointer-events-none"></div>
                                        )}
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">{bet.date}</span>
                                                {bet.result === 'WIN' ? <TrendingUp size={12} className="text-green-500" /> : null}
                                            </div>
                                            <div className="text-white font-bold text-sm">{bet.match}</div>
                                            <div className="text-gray-400 text-xs">{bet.pick} ({bet.odds})</div>
                                        </div>
                                        <div className="text-right relative z-10">
                                            <div className={`text-sm font-black ${bet.result === 'WIN' ? 'text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'text-gray-500 line-through decoration-red-500/50'}`}>
                                                {bet.result === 'WIN' ? bet.profit : bet.profit}
                                            </div>
                                            <div className={`text-[10px] font-bold tracking-wider ${bet.result === 'WIN' ? 'text-green-600' : 'text-red-900/50'}`}>{bet.result}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom Total */}
                            <div className="absolute bottom-6 left-4 right-4 p-5 bg-[#111]/90 backdrop-blur-xl rounded-3xl border border-white/10 z-20 shadow-2xl">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-gray-500 text-xs font-bold uppercase mb-1">Total Profit</div>
                                        <div className="text-3xl font-black text-white tracking-tight">$7,539</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-green-400 font-bold text-sm bg-green-900/20 px-2 py-1 rounded-lg">+24.5%</div>
                                        <div className="text-gray-600 text-[10px] mt-1 font-bold">ROI</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Realistic Glass Glare Reflection */}
                        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-white/[0.03] to-transparent pointer-events-none z-30"></div>
                        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-purple-500/10 blur-[80px] pointer-events-none z-30 rounded-full mix-blend-screen"></div>
                    </div>
                </div>

                {/* Refined Floating Badge */}
                <div className="absolute top-28 -right-16 glass-card p-4 rounded-2xl animate-float-slow border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-3 backdrop-blur-2xl z-[60]">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl"></div>
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-900/20 flex items-center justify-center border border-green-500/20 shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]">
                        <TrendingUp size={20} className="text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                    </div>
                    <div className="relative">
                        <div className="text-white font-bold text-sm">3rd Party Verified</div>
                        <div className="text-green-400 text-xs font-medium">100% Transparent</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Hero3DPhone;
