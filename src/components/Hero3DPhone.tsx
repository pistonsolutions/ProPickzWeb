import React, { useEffect, useState } from 'react';
import { Activity, Zap, TrendingUp } from 'lucide-react';

const Hero3DPhone: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {
        // Trigger the slide-in animation after a short delay for page load
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    return (

        <div className={`relative flex items-center justify-center h-[500px] md:h-[700px] w-full transition-all duration-1000 ease-out perspective-[2000px] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>

            {/* IPHONE 17 PRO MAX CHASSIS */}
            <div
                className="relative w-[280px] md:w-[320px] h-[580px] md:h-[650px] bg-[#0f0f0f] rounded-[45px] md:rounded-[55px] border-[6px] md:border-[8px] border-[#2a2a2a] overflow-visible z-10 transform-style-3d transition-transform duration-500 hover:scale-[1.02] hover:rotate-y-[20deg] hover:rotate-x-[5deg]"
                style={{
                    transform: 'rotateY(25deg) rotateX(10deg) rotateZ(-5deg)',
                    boxShadow: '30px 30px 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.1)'
                }}
            >
                {/* Side Buttons (Left - Volume) */}
                <div className="absolute -left-[10px] top-[120px] w-[4px] h-[30px] bg-[#333] rounded-l-md border-l border-t border-b border-gray-600"></div>
                <div className="absolute -left-[10px] top-[160px] w-[4px] h-[50px] bg-[#333] rounded-l-md border-l border-t border-b border-gray-600"></div>
                <div className="absolute -left-[10px] top-[220px] w-[4px] h-[50px] bg-[#333] rounded-l-md border-l border-t border-b border-gray-600"></div>

                {/* Side Button (Right - Power) */}
                <div className="absolute -right-[10px] top-[180px] w-[4px] h-[90px] bg-[#333] rounded-r-md border-r border-t border-b border-gray-600 shadow-lg"></div>

                {/* Screen Content */}
                <div className="absolute inset-0 bg-[#050505] flex flex-col p-4 pt-12 overflow-hidden rounded-[40px] md:rounded-[48px]">

                    {/* DYNAMIC ISLAND */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 md:w-28 h-7 bg-black rounded-full z-50 flex items-center justify-center gap-2 shadow-lg">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-green-900 rounded-full"></div>
                    </div>

                    {/* STATUS BAR (Fake) */}
                    <div className="flex justify-between items-center text-white text-[10px] px-2 mb-4 font-bold opacity-80">
                        <span>9:41</span>
                        <div className="flex gap-1">
                            <SignalStrength />
                            <BatteryIcon />
                        </div>
                    </div>

                    {/* WIDGET 1: MARKET SCANNER */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-3 mb-3 relative overflow-hidden backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan-line"></div>
                        <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-1">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Market Scanner</span>
                            <span className="text-[9px] text-gray-500 flex items-center gap-1">
                                <Activity size={10} className="text-blue-500 animate-pulse" /> Live
                            </span>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] bg-white/5 p-1.5 rounded">
                                <span className="text-gray-300">Scanning NBA...</span>
                                <span className="text-blue-300 font-mono">152 checked</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] bg-blue-500/10 border border-blue-500/20 p-1.5 rounded">
                                <span className="text-white font-bold">Target Detected</span>
                                <span className="text-green-400 font-bold">Match Found</span>
                            </div>
                        </div>
                    </div>

                    {/* WIDGET 2: HYBRID ANALYSIS */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-3 mb-3 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-1.5">
                                <div className="p-1 rounded bg-purple-500/10">
                                    <Zap size={12} className="text-purple-400" />
                                </div>
                                <span className="text-[10px] font-bold text-white">Hybrid Analysis</span>
                            </div>
                            <span className="text-[9px] text-purple-300 bg-purple-900/20 px-1.5 py-0.5 rounded">Active</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                            <div className="bg-black/30 p-2 rounded-lg">
                                <div className="text-gray-500 text-[9px] mb-0.5">Confidence</div>
                                <div className="text-white font-bold text-lg">94%</div>
                            </div>
                            <div className="bg-black/30 p-2 rounded-lg">
                                <div className="text-gray-500 text-[9px] mb-0.5">Value (EV)</div>
                                <div className="text-green-400 font-bold text-lg">+12%</div>
                            </div>
                        </div>
                        <div className="mt-2 text-[9px] text-center text-gray-500 border-t border-gray-800 pt-1.5">
                            Verifying against 24 books...
                        </div>
                    </div>

                    {/* WIDGET 3: NOTIFICATION (Whale Play) */}
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                <TrendingUp size={16} className="text-green-400" />
                            </div>
                            <div>
                                <div className="text-white font-bold text-xs">Top Play Alert</div>
                                <div className="text-gray-500 text-[9px]">Just now</div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3 border border-white/5 mb-2">
                            <div className="flex justify-between items-start mb-1">
                                <div className="text-[10px] text-gray-400 uppercase tracking-widest">Player Prop</div>
                                <div className="text-[10px] text-green-400 font-bold bg-green-500/10 px-1.5 rounded">HIGH VALUE</div>
                            </div>
                            <div className="text-white font-black text-sm mb-0.5">J. Tatum Over 26.5 Pts</div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-[10px]">Celtics vs Heat</span>
                                <span className="text-white font-bold text-xs">-110</span>
                            </div>
                        </div>

                        <button className="w-full py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-pulse">
                            View Full Analysis
                        </button>
                    </div>

                </div>

                {/* BOTTOM HOME BAR */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white rounded-full opacity-90 shadow-sm z-50"></div>
            </div>

            {/* Back Glow Effect */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[600px] bg-purple-600/20 blur-[100px] rounded-full"></div>
        </div>
    );
};

// Helper Icons
const SignalStrength = () => (
    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 4H19V20H21V4ZM17 8H15V20H17V8ZM13 12H11V20H13V12ZM9 16H7V20H9V16Z" />
    </svg>
);

const BatteryIcon = () => (
    <svg className="w-4 h-3 text-white" viewBox="0 0 24 12" fill="currentColor">
        <rect x="1" y="1" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="3" y="3" width="14" height="6" rx="1" fill="currentColor" />
        <path d="M22 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export default React.memo(Hero3DPhone);
