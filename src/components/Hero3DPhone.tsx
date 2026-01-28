import React, { useEffect, useState } from 'react';
import { Activity, Zap, TrendingUp, CheckCircle } from 'lucide-react';

const Hero3DPhone: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [scanActive, setScanActive] = useState(true);

    useEffect(() => {
        // Trigger the slide-in animation after a short delay for page load
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    // HIGH-FIDELITY 3D GENERATION
    // Simulates a brushed titanium frame with curvature lighting
    const layerCount = 36; // Increased layer count for smoother extrusion
    const layers = Array.from({ length: layerCount }).map((_, i) => {
        // Calculate "Curve Lighting":
        // Adjust coloring to emphasize the visible Right Border thickness

        let color = '#9ca3af'; // Base Grey
        if (i < 4) color = '#e5e7eb'; // Front Highlight (Bright)
        else if (i < 15) color = '#d1d5db'; // Mid-Tone
        else if (i < 28) color = '#9ca3af'; // Shadow Curve
        else color = '#6b7280'; // Back Edge Shadow

        // Refined border logic to ensure side visibility
        return (
            <div
                key={i}
                className="absolute inset-0 rounded-[60px] md:rounded-[68px]"
                style={{
                    transform: `translateZ(-${i * 1.0}px)`, // Doubled depth step (1.0px) for maximum thickness
                    border: '1px solid',
                    borderColor: color,
                    background: i === layerCount - 1 ? '#374151' : 'transparent', // Only fill back plate
                    // Use a stacked box-shadow approach to fill the gaps between layers visually
                    boxShadow: '0 0 1px rgba(156, 163, 175, 0.3)',
                    width: '100%',
                    height: '100%'
                }}
            />
        );
    });

    return (
        <div className={`relative flex items-center justify-center h-[550px] md:h-[750px] w-full transition-all duration-1000 ease-out perspective-[2000px] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>

            {/* IPHONE 17 PRO MAX - ULTRA REALISTIC */}
            <div
                className="relative w-[320px] md:w-[360px] h-[640px] md:h-[720px] z-10 transform-style-3d transition-transform duration-500 hover:rotate-y-[-32deg] hover:rotate-x-[5deg]"
                style={{
                    transform: 'rotateY(-30deg) rotateX(10deg) rotateZ(3deg)', // Increased tilt
                }}
            >
                {/* 1. SOLID METAL EXTRUSION (The Stack) */}
                <div className="absolute inset-0 transform-style-3d pointer-events-none">
                    {layers}
                </div>

                {/* 2. MAIN FRONT CHASSIS */}
                <div
                    className="absolute inset-0 rounded-[60px] md:rounded-[68px] overflow-hidden transform-style-3d bg-[#d1d5db]"
                    style={{
                        transform: 'translateZ(0px)',
                        boxShadow: 'inset 0 0 15px rgba(255,255,255,0.9), -20px 20px 40px rgba(0,0,0,0.4)', // Deeper shadow for 3D float
                        border: '1px solid rgba(255,255,255,0.6)'
                    }}
                >
                    {/* Inner Black Bezel (Screen Border) */}
                    <div className="absolute inset-[5px] bg-black rounded-[55px] md:rounded-[63px] shadow-[inset_0_0_4px_rgba(255,255,255,0.1)]"></div>

                    {/* PHYSICAL BUTTONS (3D) */}
                    {/* Left Vol Up */}
                    <div className="absolute -left-[4px] top-[140px] w-[4px] h-[30px] bg-[#d1d5db] rounded-l-md z-20 border-l border-white/50 shadow-md"></div>
                    {/* Left Vol Down */}
                    <div className="absolute -left-[4px] top-[180px] w-[4px] h-[60px] bg-[#d1d5db] rounded-l-md z-20 border-l border-white/50 shadow-md"></div>
                    {/* Right Power */}
                    <div className="absolute -right-[4px] top-[200px] w-[4px] h-[90px] bg-[#3a3a3c] rounded-r-md z-20 border-r border-white/20 shadow-md"></div>

                    {/* SCREEN CONTAINER */}
                    <div className="absolute inset-[14px] bg-[#000] rounded-[48px] md:rounded-[56px] flex flex-col items-center relative overflow-hidden">

                        {/* CERAMIC SHIELD GLOSS (Reflection) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30 pointer-events-none z-50 rounded-[48px]"></div>

                        {/* DYNAMIC ISLAND */}
                        <div className="absolute top-5 bg-black rounded-full z-40 flex items-center justify-center gap-3 w-[120px] h-[35px] border border-white/10 shadow-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                            <div className="w-1.5 h-1.5 bg-[#3a3a3c] rounded-full"></div>
                        </div>

                        {/* STATUS BAR */}
                        <div className="w-full flex justify-between items-center text-white text-[13px] px-8 mt-4.5 mb-2 font-semibold tracking-wide opacity-90 h-[24px] z-30">
                            <span className="w-12 text-center text-shadow-sm">12:30</span>
                            <div className="w-12 flex justify-end gap-1.5 items-center">
                                <SignalStrength />
                                <BatteryIcon />
                            </div>
                        </div>

                        {/* CONTENT STACK - PERFECTLY CENTERED */}
                        <div className="w-full flex-1 flex flex-col justify-center px-4 space-y-4 pb-8 z-10">

                            {/* MARKET SCANNER */}
                            <div className="bg-[#1c1c1e]/90 border border-white/10 rounded-[26px] p-4 relative overflow-hidden shadow-2xl backdrop-blur-md">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan-line opacity-70"></div>
                                <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest pl-1">Market Scanner</span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                        <Activity size={10} className="text-blue-500 animate-pulse" /> Live
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[12px] bg-white/5 p-2.5 rounded-xl border border-white/5">
                                        <span className="text-gray-300 font-medium">Scanning NBA...</span>
                                        <span className="text-blue-300 font-mono font-bold">152 checked</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[12px] bg-blue-500/10 border border-blue-500/30 p-2.5 rounded-xl text-shadow-sm">
                                        <span className="text-white font-bold">Target Detected</span>
                                        <span className="text-green-400 font-bold">Match Found</span>
                                    </div>
                                </div>
                            </div>

                            {/* HYBRID ANALYSIS */}
                            <div className="bg-[#1c1c1e]/90 border border-white/10 rounded-[26px] p-4 shadow-2xl backdrop-blur-md">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30">
                                            <Zap size={12} className="text-purple-400" />
                                        </div>
                                        <span className="text-[12px] font-bold text-white tracking-wide">Hybrid Analysis</span>
                                    </div>
                                    <span className="text-[10px] text-purple-300 bg-purple-900/40 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]">Active</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-center text-[12px]">
                                    <div className="bg-black/40 p-3 rounded-2xl border border-white/5 shadow-inner">
                                        <div className="text-gray-400 text-[10px] mb-1 uppercase tracking-wide font-semibold">Confidence</div>
                                        <div className="text-white font-heavy text-xl tracking-tight">94%</div>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-2xl border border-white/5 shadow-inner">
                                        <div className="text-gray-400 text-[10px] mb-1 uppercase tracking-wide font-semibold">Value (EV)</div>
                                        <div className="text-green-400 font-heavy text-xl tracking-tight">+12%</div>
                                    </div>
                                </div>
                            </div>

                            {/* WHALE PLAY NOTIFICATION */}
                            <div className="bg-gradient-to-br from-[#1c1c1e] to-black border border-white/10 rounded-[26px] p-4 shadow-2xl relative">
                                {/* Top Highlight Line */}
                                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                                        <TrendingUp size={18} className="text-green-400" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-[12px] leading-tight">Top Play Alert</div>
                                        <div className="text-gray-500 text-[10px] font-medium">Just now • Premium</div>
                                    </div>
                                </div>

                                <div className="bg-[#111] rounded-2xl p-3 border border-white/5 mb-3 shadow-inner">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Player Prop</div>
                                        <div className="text-[9px] text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-1.5 py-px rounded tracking-wide">HIGH VALUE</div>
                                    </div>
                                    <div className="text-white font-black text-[14px] mb-1 tracking-tight">J. Tatum Over 26.5 Pts</div>
                                    <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-1">
                                        <span className="text-gray-400 text-[10px] font-medium">Celtics vs Heat</span>
                                        <span className="text-white font-bold text-[11px]">-110</span>
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-green-600 hover:bg-green-500 text-white text-[12px] font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse active:scale-[0.98] border border-green-400/20">
                                    View Full Analysis
                                </button>
                            </div>
                        </div>

                        {/* HOME INDICATOR */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-white rounded-full opacity-70 shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>

                    </div>
                </div>
            </div>

            {/* Back Glow Effect (Deep Purple/Titanium) */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[800px] bg-purple-600/15 blur-[150px] rounded-full"></div>
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
