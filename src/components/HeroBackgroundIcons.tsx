import React from 'react';
import { Sigma, Pi, Calculator, Binary, TrendingUp, BarChart2, Divide, Percent, Variable, Activity } from 'lucide-react';

const HeroBackgroundIcons: React.FC = () => {
    // Definining icons with their properties for a distributed layout
    const icons = [
        { Icon: Sigma, top: '10%', left: '5%', size: 48, color: 'text-purple-500', blur: 'blur-[2px]', opacity: 'opacity-20', rotate: 'rotate-12' },
        { Icon: Pi, top: '20%', left: '85%', size: 64, color: 'text-blue-500', blur: 'blur-[3px]', opacity: 'opacity-10', rotate: '-rotate-12' },
        { Icon: Binary, top: '60%', left: '15%', size: 40, color: 'text-gray-500', blur: 'blur-[1px]', opacity: 'opacity-20', rotate: 'rotate-45' },
        { Icon: Calculator, top: '15%', left: '50%', size: 56, color: 'text-purple-400', blur: 'blur-[4px]', opacity: 'opacity-15', rotate: '-rotate-6' },
        { Icon: TrendingUp, top: '80%', left: '80%', size: 72, color: 'text-green-500/50', blur: 'blur-[3px]', opacity: 'opacity-20', rotate: 'rotate-12' },
        { Icon: BarChart2, top: '40%', left: '10%', size: 50, color: 'text-indigo-500', blur: 'blur-[2px]', opacity: 'opacity-15', rotate: '-rotate-12' },
        { Icon: Divide, top: '75%', left: '40%', size: 32, color: 'text-pink-500', blur: 'blur-[1px]', opacity: 'opacity-20', rotate: 'rotate-90' },
        { Icon: Percent, top: '30%', left: '70%', size: 48, color: 'text-blue-400', blur: 'blur-[2px]', opacity: 'opacity-10', rotate: 'rotate-12' },
        { Icon: Variable, top: '85%', left: '5%', size: 56, color: 'text-purple-600', blur: 'blur-[3px]', opacity: 'opacity-15', rotate: '-rotate-45' },
        { Icon: Activity, top: '50%', left: '90%', size: 40, color: 'text-emerald-500', blur: 'blur-[2px]', opacity: 'opacity-20', rotate: 'rotate-6' },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {icons.map((item, index) => (
                <div
                    key={index}
                    className={`absolute ${item.color} ${item.blur} ${item.opacity} ${item.rotate} animate-pulse-slow`}
                    style={{
                        top: item.top,
                        left: item.left,
                        transform: `scale(${1 + Math.random() * 0.2})`,
                        animationDelay: `${index * 500}ms`
                    }}
                >
                    <item.Icon size={item.size} />
                </div>
            ))}

            {/* Additional floating particles for depth */}
            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-purple-500 rounded-full blur-[1px] opacity-40 animate-float-slow"></div>
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-blue-500 rounded-full blur-[2px] opacity-30 animate-float-slow" style={{ animationDelay: '1s' }}></div>
        </div>
    );
};

export default HeroBackgroundIcons;
