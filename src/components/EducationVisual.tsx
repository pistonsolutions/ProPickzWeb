import React from 'react';
import { BookOpen, TrendingUp, ShoppingCart, Brain, Wrench } from 'lucide-react';

const EducationVisual: React.FC = () => {
    const widgets = [
        { icon: <TrendingUp size={18} className="text-green-400" />, title: "Bankroll Management", subtitle: "Protect your capital", delay: "0s", pos: "top-0 left-10 md:-left-4" },
        { icon: <ShoppingCart size={18} className="text-blue-400" />, title: "Line Shopping", subtitle: "Get the best odds", delay: "1s", pos: "top-20 -right-4 md:-right-12" },
        { icon: <Brain size={18} className="text-purple-400" />, title: "Betting Strategies", subtitle: " Proven systems", delay: "2s", pos: "bottom-32 left-0 md:-left-8" },
        { icon: <Wrench size={18} className="text-orange-400" />, title: "Tools & Resources", subtitle: "Calculators & Trackers", delay: "1.5s", pos: "bottom-10 right-0 md:-right-8" },
        { icon: <TrendingUp size={18} className="text-red-400" />, title: "Understanding CLV", subtitle: "Beat the closing line", delay: "0.5s", pos: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[180px]" },
    ];

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-purple-600/10 blur-[100px] rounded-full"></div>

            {/* Central Hub */}
            <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 bg-black rounded-full border border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.4)] flex flex-col items-center justify-center p-4 text-center animate-pulse-slow">
                <div className="p-3 bg-purple-900/30 rounded-full mb-2">
                    <BookOpen size={24} className="text-purple-400" />
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">ProPickz<br />Academy</div>
            </div>

            {/* Connecting Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9333ea" stopOpacity="0" />
                        <stop offset="50%" stopColor="#9333ea" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Lines generated relative to center 50% 50% */}
                {/* To Top Left */}
                <line x1="50%" y1="50%" x2="20%" y2="15%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-pulse" />
                {/* To Top Right */}
                <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-pulse delay-700" />
                {/* To Bottom Left */}
                <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-pulse delay-1000" />
                {/* To Bottom Right */}
                <line x1="50%" y1="50%" x2="80%" y2="85%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-pulse delay-500" />
                {/* To Top Center */}
                <line x1="50%" y1="50%" x2="50%" y2="10%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-pulse delay-200" />

            </svg>

            {/* Floating Widgets */}
            {widgets.map((widget, i) => (
                <div
                    key={i}
                    className={`absolute ${widget.pos} glass-card p-4 rounded-xl flex items-center gap-3 animate-float-slow hover:scale-105 transition-transform cursor-default z-20`}
                    style={{ animationDelay: widget.delay, maxWidth: '200px' }}
                >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                        {widget.icon}
                    </div>
                    <div>
                        <div className="text-white text-sm font-bold leading-tight">{widget.title}</div>
                        <div className="text-gray-400 text-[10px] font-medium mt-0.5">{widget.subtitle}</div>
                    </div>
                </div>
            ))}

        </div>
    );
};

export default EducationVisual;
