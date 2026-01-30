import React from 'react';
import { BookOpen, TrendingUp, ShoppingCart, Brain, Wrench } from 'lucide-react';

const EducationVisual: React.FC = () => {
    const widgets = [
        // Top Left
        { icon: <TrendingUp size={18} className="text-green-400" />, title: "Bankroll Mgmt", subtitle: "Protect capital", delay: "0s", pos: "top-[10%] left-[5%] md:left-[0%]" },
        // Top Right
        { icon: <ShoppingCart size={18} className="text-blue-400" />, title: "Line Shopping", subtitle: "Best odds", delay: "1s", pos: "top-[15%] right-[5%] md:right-[-5%]" },
        // Bottom Left
        { icon: <Brain size={18} className="text-purple-400" />, title: "Strategies", subtitle: "Proven systems", delay: "2s", pos: "bottom-[15%] left-[5%] md:left-[-5%]" },
        // Bottom Right
        { icon: <Wrench size={18} className="text-orange-400" />, title: "Tools", subtitle: "Calculators", delay: "1.5s", pos: "bottom-[10%] right-[5%] md:right-[0%]" },
        // Top Center (Moved closer to avoid overlap)
        { icon: <TrendingUp size={18} className="text-red-400" />, title: "Understanding CLV", subtitle: "Closing Line Value", delay: "0.5s", pos: "top-[0%] left-1/2 -translate-x-1/2 mt-4" },
    ];

    return (
        <div className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-purple-600/5 blur-[80px] rounded-full pointer-events-none"></div>

            {/* Central Hub */}
            <div className="relative z-10 w-32 h-32 bg-[#0a0a0a] rounded-full border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)] flex flex-col items-center justify-center p-4 text-center animate-pulse-slow">
                <div className="p-2.5 bg-purple-500/10 rounded-full mb-2 border border-purple-500/20">
                    <BookOpen size={20} className="text-purple-400" />
                </div>
                <div className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-tight">ProPickz<br />Academy</div>
            </div>

            {/* Connecting Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible opacity-30">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9333ea" stopOpacity="0" />
                        <stop offset="50%" stopColor="#9333ea" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="url(#lineGradient)" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="url(#lineGradient)" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="url(#lineGradient)" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="80%" y2="85%" stroke="url(#lineGradient)" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="url(#lineGradient)" strokeWidth="1" />
            </svg>

            {/* Floating Widgets */}
            {widgets.map((widget, i) => (
                <div
                    key={i}
                    className={`absolute ${widget.pos} bg-[#0f1014]/80 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3 hover:scale-105 transition-transform cursor-pointer shadow-lg hover:border-purple-500/30 group z-20 w-max`}
                    style={{ animationDelay: widget.delay }}
                >
                    <div className="w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:bg-purple-500/10 transition-colors">
                        {widget.icon}
                    </div>
                    <div>
                        <div className="text-white text-xs font-bold leading-tight">{widget.title}</div>
                        <div className="text-gray-500 text-[9px] font-medium uppercase tracking-wide mt-0.5 group-hover:text-gray-400">{widget.subtitle}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EducationVisual;
