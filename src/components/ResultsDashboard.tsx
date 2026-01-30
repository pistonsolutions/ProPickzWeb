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
            units: t('resultsDashboard', 'Pending'),
            roi: t('resultsDashboard', 'Pending'),
            winRate: t('resultsDashboard', 'Pending'),
            color: "text-purple-400",
            bg: "bg-purple-900/20",
            border: "border-purple-500/30"
        },
        {
            name: "SAFE PARLAYS",
            units: t('resultsDashboard', 'Pending'),
            roi: t('resultsDashboard', 'Pending'),
            winRate: t('resultsDashboard', 'Pending'),
            color: "text-green-400",
            bg: "bg-green-900/20",
            border: "border-green-500/30"
        },
        {
            name: "FREE PLAYS",
            units: t('resultsDashboard', 'Pending'),
            roi: t('resultsDashboard', 'Pending'),
            winRate: t('resultsDashboard', 'Pending'),
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

    const UnitTable = ({ title, profitPoints }: { title: string, profitPoints: { unit: number, profit: number | string }[] }) => (
        <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl overflow-hidden flex flex-col shadow-lg">
            <div className="bg-[#4c1d95] p-2 text-center border-b border-white/10">
                <h3 className="text-white font-black italic uppercase tracking-wider text-xs md:text-sm">
                    {title}
                </h3>
            </div>
            <div className="p-3 bg-[#111] text-white">
                <div className="space-y-1.5">
                    {profitPoints.map((pt, i) => (
                        <div key={i} className="flex justify-between items-center text-[10px] md:text-xs font-bold border-b border-white/10 last:border-0 pb-1.5 last:pb-0">
                            <span className="text-gray-400">${pt.unit} {t('resultsDashboard', 'UnitsLabel')}</span>
                            <span className="font-black text-green-400">
                                {typeof pt.profit === 'number'
                                    ? `$${pt.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : pt.profit}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-6 bg-[#050505] rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
            {/* Grid pattern texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            {/* Noise texture overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none"></div>
            {/* Background Glows (Hidden on mobile for performance) */}
            <div className="hidden md:block absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="hidden md:block absolute bottom-0 left-0 w-64 h-64 bg-green-600/10 rounded-full blur-[80px] pointer-events-none"></div>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
                <div className="text-left">
                    <h2 className="text-xl font-black text-white mb-1 tracking-wide">{t('resultsDashboard', 'Title')}</h2>
                    <p className="text-gray-500 text-xs max-w-xl">{t('resultsDashboard', 'Subtitle')}</p>
                </div>
                <div className="mt-2 md:mt-0 px-3 py-1.5 bg-purple-600/20 border border-purple-500/50 rounded-full text-purple-400 text-[10px] font-bold uppercase tracking-wider animate-pulse hidden md:block">
                    {t('resultsDashboard', 'LiveUpdates')}
                </div>
            </div>

            {/* TOP STATS ROW (Compact on mobile) */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-3 mb-6 relative z-10">
                <div className="bg-gray-900/40 border border-gray-800 p-2 md:p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-wider mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{t('resultsDashboard', 'Last30Day')}</div>
                    <div className="text-lg md:text-3xl font-black text-purple-400">{t('resultsDashboard', 'Pending')}</div>
                    <div className="text-gray-600 text-[9px] md:text-[10px] mt-0.5">{t('resultsDashboard', 'UnitsProfit')}</div>
                </div>
                <div className="bg-gray-900/40 border border-gray-800 p-2 md:p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-wider mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{t('resultsDashboard', 'YTDUnits')}</div>
                    <div className="text-lg md:text-3xl font-black text-green-400">{t('resultsDashboard', 'Pending')}</div>
                    <div className="text-gray-600 text-[9px] md:text-[10px] mt-0.5">{t('resultsDashboard', 'TotalProfit')}</div>
                </div>
                <div className="bg-gray-900/40 border border-gray-800 p-2 md:p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-wider mb-1 whitespace-nowrap overflow-hidden text-ellipsis">ALL TIME</div>
                    <div className="text-lg md:text-3xl font-black text-white">{t('resultsDashboard', 'Pending')}</div>
                    <div className="text-gray-600 text-[9px] md:text-[10px] mt-0.5 uppercase">{t('resultsDashboard', 'WinRate')}</div>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10">

                {/* COL 1: RECAP WIDGETS - Hidden on mobile */}
                <div className="hidden lg:flex lg:col-span-1 flex-col gap-3">
                    <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-4 flex-1 flex flex-col">
                        <h3 className="text-white font-black uppercase tracking-widest mb-4 border-b border-gray-800 pb-2 text-xs">{t('resultsDashboard', 'PerformanceRecap')}</h3>

                        <div className="space-y-4 flex-1">
                            {recaps.map((recap, i) => (
                                <div key={i} className={`p-3 rounded-xl border ${recap.border} ${recap.bg}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-[10px] font-black uppercase ${recap.color}`}>{recap.name}</span>
                                        <Activity size={14} className={recap.color} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400 uppercase mb-0.5">{t('resultsDashboard', 'Profit')}</div>
                                        <div className="text-2xl font-black text-white">
                                            {recap.units === t('resultsDashboard', 'Pending') ? recap.units : `${recap.units} u`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <a
                            href="https://docs.google.com/spreadsheets/d/1nphrBl9VmISc1k5IpPQ7h4vVhcAf4Go3i5ai_WuCyRo/edit?gid=0#gid=0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full mt-4 py-3 bg-black border border-gray-700 rounded-lg text-[10px] font-bold text-white hover:bg-gray-800 transition-colors uppercase tracking-wider flex items-center justify-center gap-2 group"
                        >
                            {t('resultsDashboard', 'ViewFullLog')} <Activity size={12} className="group-hover:text-purple-400 transition-colors" />
                        </a>
                    </div>
                </div>

                {/* COL 2 & 3: GRAPH & NEW WIDGETS */}
                <div className="lg:col-span-2 flex flex-col gap-4">

                    {/* GRAPH - Reduced height */}
                    <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-4 h-[220px] flex flex-col relative">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white font-bold text-sm">{t('resultsDashboard', 'UnitsOverTime')}</h3>
                            <div className="flex gap-1.5">
                                {[t('resultsDashboard', 'Days30'), t('resultsDashboard', 'Days60'), t('resultsDashboard', 'YTD')].map(r => (
                                    <button key={r} onClick={() => setTimeRange(r)} className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${timeRange === r ? 'bg-gray-700 text-white' : 'text-gray-600 hover:text-gray-400'}`}>{r}</button>
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
                                    <text x="0" y="-18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{t('resultsDashboard', 'Pending')}</text>
                                    <circle cx="0" cy="0" r="4" fill="#fff" stroke="#a855f7" strokeWidth="2" />
                                </g>
                            </svg>
                        </div>
                    </div>

                    {/* SPLIT ROW: BET LOG & NEW UNIT BETTOR TABLES */}
                    <div className="grid md:grid-cols-2 gap-4 flex-1">

                        {/* BET LOG */}
                        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-white font-bold text-xs">{t('resultsDashboard', 'RecentBetLog')}</h3>
                                <Search size={12} className="text-gray-600" />
                            </div>
                            <div className="space-y-2">
                                {bets.slice(0, 4).map((bet, i) => (
                                    <div key={i} className="flex justify-between items-center text-[10px] p-2 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
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

                        {/* NEW UNIT BETTOR TABLES - Hidden on mobile */}
                        <div className="hidden md:flex flex-col gap-3">
                            <UnitTable
                                title={t('resultsDashboard', 'Table30Days')}
                                profitPoints={[
                                    { unit: 20, profit: t('resultsDashboard', 'Pending') },
                                    { unit: 50, profit: t('resultsDashboard', 'Pending') },
                                    { unit: 100, profit: t('resultsDashboard', 'Pending') },
                                    { unit: 250, profit: t('resultsDashboard', 'Pending') }
                                ]}
                            />
                            <UnitTable
                                title={t('resultsDashboard', 'TableYTD')}
                                profitPoints={[
                                    { unit: 20, profit: t('resultsDashboard', 'Pending') },
                                    { unit: 50, profit: t('resultsDashboard', 'Pending') },
                                    { unit: 100, profit: t('resultsDashboard', 'Pending') },
                                    { unit: 250, profit: t('resultsDashboard', 'Pending') }
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
