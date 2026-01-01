import React from 'react';
import { CheckCircle, Zap } from 'lucide-react';

const WinningSlips: React.FC = () => {
    // Mock Data for Slips to Generate "Digital Tickets"
    const slips = [
        { sport: "NBA", team: "Lakers -5.5", odds: "-110", payout: "$2,500" },
        { sport: "NFL", team: "Chiefs Moneyline", odds: "+130", payout: "$5,200" },
        { sport: "MLB", team: "Yankees Over 8.5", odds: "-105", payout: "$1,800" },
        { sport: "UFC", team: "O'Malley via KO", odds: "+250", payout: "$8,000" },
        { sport: "NHL", team: "Oilers Puckline", odds: "+140", payout: "$3,100" },
        { sport: "NBA", team: "Celtics -3.5", odds: "-110", payout: "$4,200" },
        { sport: "NFL", team: "Lions +3.5", odds: "-115", payout: "$1,900" },
        { sport: "MLB", team: "Dodgers RL", odds: "+110", payout: "$2,100" },
    ];

    const SlipCard = ({ slip }: { slip: any }) => (
        <div className="w-64 h-32 flex-shrink-0 bg-white text-black p-4 rounded-xl shadow-lg border-l-8 border-green-500 mx-4 relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
            <div className="absolute top-2 right-2 text-green-600">
                <CheckCircle size={20} fill="currentColor" className="text-white" />
            </div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{slip.sport}</div>
            <div className="text-lg font-black leading-tight mb-1">{slip.team}</div>
            <div className="text-sm font-bold text-gray-800 mb-2">@{slip.odds}</div>

            <div className="border-t border-dashed border-gray-300 pt-2 flex justify-between items-center">
                <div className="text-[10px] text-gray-500 uppercase">Payout</div>
                <div className="text-green-600 font-black text-lg">{slip.payout}</div>
            </div>

            {/* Watermark */}
            <div className="absolute -bottom-4 -right-4 opacity-10 pointer-events-none text-green-800">
                <Zap size={64} />
            </div>
        </div>
    );

    return (
        <div className="w-full bg-black py-12 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none"></div>

            <h3 className="text-center text-gray-500 text-sm font-bold uppercase tracking-widest mb-8">Recent Community Wins</h3>

            <div className="flex w-[200%] animate-marquee">
                {/* Loop 1 */}
                <div className="flex">
                    {slips.map((slip, i) => <SlipCard key={`s1-${i}`} slip={slip} />)}
                </div>
                {/* Loop 2 (Duplicate for smooth scroll) */}
                <div className="flex">
                    {slips.map((slip, i) => <SlipCard key={`s2-${i}`} slip={slip} />)}
                </div>
                {/* Loop 3 to be safe */}
                <div className="flex">
                    {slips.map((slip, i) => <SlipCard key={`s3-${i}`} slip={slip} />)}
                </div>
            </div>
        </div>
    );
};

export default WinningSlips;
