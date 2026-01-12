import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', updateMousePosition);
            return () => window.removeEventListener('mousemove', updateMousePosition);
        }
    }, []);
    return mousePosition;
};

const Hero3DPhone: React.FC = () => {
    const { x, y } = useMousePosition();
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

    const rotateX = ((y - centerY) / 60).toFixed(2);
    const rotateY = ((x - centerX) / 60).toFixed(2);

    return (
        <div className="relative hidden lg:block perspective-1000 z-50">
            <div
                className="relative transition-transform duration-100 ease-out will-change-transform"
                style={{
                    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(-6deg)`,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* CSS PHONE FRAME */}
                <div className="relative w-[380px] h-[760px] bg-gray-900 rounded-[50px] p-4 border-[8px] border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.8)] mx-auto ring-1 ring-white/10">
                    {/* Inner Bezel */}
                    <div className="absolute inset-2 border-[4px] border-black rounded-[42px] pointer-events-none z-20"></div>

                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-7 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-full z-30 flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-900/50"></div>
                        <div className="w-16 h-2 rounded-full bg-gray-900/50"></div>
                    </div>

                    {/* SCREEN CONTENT: LEDGER */}
                    <div className="w-full h-full bg-[#09090b] rounded-[40px] overflow-hidden flex flex-col relative">
                        {/* Header */}
                        <div className="pt-14 pb-4 px-6 bg-gradient-to-b from-gray-900 to-[#09090b] border-b border-white/5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">Verified Ledger</span>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-green-500 text-xs font-bold">LIVE</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-white italic">October Recap</h2>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar relative">
                            {/* Gradient overlay at bottom fade */}
                            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none z-10"></div>

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
                                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${bet.result === 'WIN' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/10'} mb-2`}>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">{bet.date}</span>
                                            {bet.result === 'WIN' ? <TrendingUp size={12} className="text-green-500" /> : null}
                                        </div>
                                        <div className="text-white font-bold text-sm">{bet.match}</div>
                                        <div className="text-gray-400 text-xs">{bet.pick} ({bet.odds})</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-sm font-black ${bet.result === 'WIN' ? 'text-green-400' : 'text-gray-500 line-through decoration-red-500/50'}`}>
                                            {bet.result === 'WIN' ? bet.profit : bet.profit}
                                        </div>
                                        <div className={`text-[10px] font-bold tracking-wider ${bet.result === 'WIN' ? 'text-green-600' : 'text-red-900/50'}`}>{bet.result}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Total */}
                        <div className="p-6 bg-gray-900 mb-6 mx-4 rounded-2xl border border-gray-800">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-gray-500 text-xs font-bold uppercase mb-1">Total Profit</div>
                                    <div className="text-3xl font-black text-white">$7,539</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-green-500 font-bold text-sm">+24.5%</div>
                                    <div className="text-gray-600 text-xs">ROI</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Gloss Reflection */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none rounded-r-[42px]"></div>
                </div>

                {/* Floating "Trust" Badge */}
                <div className="absolute top-20 -right-12 glass-card p-4 rounded-xl animate-float-slow border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)] flex items-center gap-3 backdrop-blur-xl z-50">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <TrendingUp size={20} className="text-green-400" />
                    </div>
                    <div>
                        <div className="text-white font-bold text-sm">3rd Party Verified</div>
                        <div className="text-green-400/80 text-xs">100% Transparent</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Hero3DPhone;
