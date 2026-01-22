import React, { useState } from 'react';
import { Activity, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ResultsDashboard: React.FC = () => {
    const { t } = useLanguage();
    // Default to '30D' but we might want to translate these values or map them
    // For now, keeping state labels internal, but displaying translated buttons
    const [timeRange, setTimeRange] = useState('30D');

    // RECAP DATA
    const recaps = [
        {
            name: t('resultsDashboard', 'HybridModel'),
            units: "+124.6",
            roi: "12.4%",
            winRate: "58.2%",
            color: "text-purple-400",
            bg: "bg-purple-900/20",
            border: "border-purple-500/30"
        },
        {
            name: "SAFE PARLAYS",
            units: "+42.8",
            roi: "18.5%",
            winRate: "42.1%",
            color: "text-green-400",
            bg: "bg-green-900/20",
            border: "border-green-500/30"
        },
        {
            name: "FREE PLAYS",
            units: "+15.3",
            roi: "8.2%",
            winRate: "52.4%",
            color: "text-blue-400",
            bg: "bg-blue-900/20",
            border: "border-blue-500/30"
        }
    ];

    const bets = [
        { date: "Apr 15", sport: "NBA", pick: "BOS -7.5", odds: "-110", units: "2.0", result: "Win" },
        { date: "Apr 14", sport: "MLB", pick: "NYY Moneyline", odds: "-129", units: "1.5", result: "Loss" },
        { date: "Apr 14", sport: "NFL", pick: "KC -3.5", odds: "-113", units: "1.0", result: "Loss" },
        { date: "Apr 13", sport: "NBA", pick: "LAL Over 224", odds: "-110", units: "2.0", result: "Win" },
        { date: "Apr 13", sport: "NHL", pick: "EDM Puckline", odds: "+140", units: "1.0", result: "Win" },
    ];

    const UnitTable = ({ title, profitPoints }: { title: string, profitPoints: { unit: number, profit: number }[] }) => (
        <div className="bg-[#0A0A0A] border border-gray-800 rounded-3xl overflow-hidden flex flex-col shadow-lg">
            <div className="bg-[#4c1d95] p-4 text-center border-b border-white/10">
                <h3 className="text-white font-black italic uppercase tracking-wider text-sm md:text-base">
                    {title}
                </h3>
            </div>
            <div className="p-4 bg-[#111] text-white">
                <div className="space-y-2">
                    {profitPoints.map((pt, i) => (
                        <div key={i} className="flex justify-between items-center text-xs md:text-sm font-bold border-b border-white/10 last:border-0 pb-2 last:pb-0">
                            <span className="text-gray-400">${pt.unit} {t('resultsDashboard', 'UnitsLabel')}</span>
                            <span className="font-black text-green-400">${pt.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-[#050505] rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-600/10 rounded-full blur-[80px] pointer-events-none"></div>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10">
                <div className="text-left">
                    <h2 className="text-2xl font-black text-white mb-2 tracking-wide">{t('resultsDashboard', 'Title')}</h2>
                    <p className="text-gray-500 text-sm max-w-xl">{t('resultsDashboard', 'Subtitle')}</p>
                </div>
                <div className="mt-4 md:mt-0 px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-full text-purple-400 text-xs font-bold uppercase tracking-wider animate-pulse">
                    {t('resultsDashboard', 'LiveUpdates')}
                </div>
            </div>

            {/* TOP STATS ROW - REMOVED TOTAL BETS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
                <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">{t('resultsDashboard', 'Last30Day')}</div>
                    <div className="text-3xl md:text-4xl font-black text-purple-400">124.6</div>
                    <div className="text-gray-600 text-[10px] mt-1">{t('resultsDashboard', 'UnitsProfit')}</div>
                </div>
                <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">{t('resultsDashboard', 'YTDUnits')}</div>
                    <div className="text-3xl md:text-4xl font-black text-green-400">+642.3</div>
                    <div className="text-gray-600 text-[10px] mt-1">{t('resultsDashboard', 'TotalProfit')}</div>
                </div>
                <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">{t('resultsDashboard', 'WinRate')}</div>
                    <div className="text-3xl md:text-4xl font-black text-white">58.2%</div>
                    <div className="text-gray-600 text-[10px] mt-1">{t('resultsDashboard', 'Consistency')}</div>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

                {/* COL 1: RECAP WIDGETS */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-6 flex-1 flex flex-col">
                        <h3 className="text-white font-black uppercase tracking-widest mb-6 border-b border-gray-800 pb-4">{t('resultsDashboard', 'PerformanceRecap')}</h3>

                        <div className="space-y-6 flex-1">
                            {recaps.map((recap, i) => (
                                <div key={i} className={`p-4 rounded-2xl border ${recap.border} ${recap.bg}`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className={`text-xs font-black uppercase ${recap.color}`}>{recap.name}</span>
                                        <Activity size={16} className={recap.color} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400 uppercase mb-1">{t('resultsDashboard', 'Profit')}</div>
                                        <div className="text-3xl font-black text-white">{recap.units} u</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <a
                            href="https://docs.google.com/spreadsheets/d/1nphrBl9VmISc1k5IpPQ7h4vVhcAf4Go3i5ai_WuCyRo/edit?gid=0#gid=0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full mt-6 py-4 bg-black border border-gray-700 rounded-xl text-xs font-bold text-white hover:bg-gray-800 transition-colors uppercase tracking-wider flex items-center justify-center gap-2 group"
                        >
                            {t('resultsDashboard', 'ViewFullLog')} <Activity size={14} className="group-hover:text-purple-400 transition-colors" />
                        </a>
                    </div>
                </div>

                {/* COL 2 & 3: GRAPH & NEW WIDGETS */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* GRAPH - Reduced height slightly to fit new widgets */}
                    <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-6 h-[280px] flex flex-col relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold">{t('resultsDashboard', 'UnitsOverTime')}</h3>
                            <div className="flex gap-2">
                                {[t('resultsDashboard', 'Days30'), t('resultsDashboard', 'Days60'), t('resultsDashboard', 'YTD')].map(r => (
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
                                    <text x="0" y="-18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">+1,612.5 {t('resultsDashboard', 'UnitsLabel')}</text>
                                    <circle cx="0" cy="0" r="4" fill="#fff" stroke="#a855f7" strokeWidth="2" />
                                </g>
                            </svg>
                        </div>
                    </div>

                    {/* SPLIT ROW: BET LOG & NEW UNIT BETTOR TABLES */}
                    <div className="grid md:grid-cols-2 gap-6 flex-1">

                        {/* BET LOG */}
                        <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-bold text-sm">{t('resultsDashboard', 'RecentBetLog')}</h3>
                                <Search size={14} className="text-gray-600" />
                            </div>
                            <div className="space-y-3">
                                {bets.slice(0, 5).map((bet, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
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

                        {/* NEW UNIT BETTOR TABLES */}
                        <div className="flex flex-col gap-4">
                            <UnitTable
                                title={t('resultsDashboard', 'Table30Days')}
                                profitPoints={[
                                    { unit: 20, profit: 2492 },
                                    { unit: 50, profit: 6230 },
                                    { unit: 100, profit: 12460 },
                                    { unit: 250, profit: 31150 }
                                ]}
                            />
                            <UnitTable
                                title={t('resultsDashboard', 'TableYTD')}
                                profitPoints={[
                                    { unit: 20, profit: 12846 },
                                    { unit: 50, profit: 32115 },
                                    { unit: 100, profit: 64230 },
                                    { unit: 250, profit: 160575 }
                                ]}
                            />
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default ResultsDashboard;
