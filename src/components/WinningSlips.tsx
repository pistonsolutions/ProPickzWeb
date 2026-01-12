import React from 'react';

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
        <div className="w-72 flex-shrink-0 bg-[#121212] text-white rounded-2xl shadow-2xl mx-4 relative overflow-hidden flex flex-col font-sans border border-gray-800">
            {/* Mock Status Bar */}
            <div className="bg-[#1e1e1e] p-3 flex justify-between items-center border-b border-gray-800">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <div className="text-[10px] text-gray-400 font-bold tracking-widest">SPORTSBOOK</div>
            </div>

            {/* Slip Content */}
            <div className="p-5 flex-1 flex flex-col relative">
                <div className="inline-block bg-green-500/20 text-green-500 text-[10px] font-black uppercase px-2 py-0.5 rounded mb-3 self-start border border-green-500/30">
                    Wager Won
                </div>

                <div className="mb-4">
                    <div className="text-xl font-black leading-tight mb-1">{slip.team}</div>
                    <div className="text-gray-400 text-xs font-bold">{slip.sport}</div>
                </div>

                <div className="mt-auto space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Odds</span>
                        <span className="font-bold">{slip.odds}</span>
                    </div>
                    <div className="w-full h-px bg-gray-800"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-bold">Total Payout</span>
                        <span className="text-green-400 font-black text-xl">{slip.payout}</span>
                    </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
            </div>

            {/* Bottom Bar Mock */}
            <div className="h-1 bg-green-500 w-full"></div>
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
