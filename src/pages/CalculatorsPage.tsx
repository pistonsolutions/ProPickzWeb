import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Calculator, TrendingUp, DollarSign, Percent, PieChart, ArrowLeftRight, Target } from 'lucide-react';

const CalculatorsPage: React.FC = () => {
    const { t } = useLanguage();
    const [activeCalc, setActiveCalc] = useState('parlay');

    // Parlay Calculator State
    const [parlayLegs, setParlayLegs] = useState([{ odds: '' }, { odds: '' }]);
    const [parlayStake, setParlayStake] = useState('100');

    // Arbitrage Calculator State
    const [arbBet1Odds, setArbBet1Odds] = useState('');
    const [arbBet2Odds, setArbBet2Odds] = useState('');
    const [arbStake, setArbStake] = useState('1000');

    // Expected Value Calculator State
    const [evOdds, setEvOdds] = useState('');
    const [evProbability, setEvProbability] = useState('');
    const [evStake, setEvStake] = useState('100');

    // Implied Probability Calculator State
    const [impliedOdds, setImpliedOdds] = useState('');

    // Kelly Calculator State
    const [kellyOdds, setKellyOdds] = useState('');
    const [kellyProbability, setKellyProbability] = useState('');
    const [kellyBankroll, setKellyBankroll] = useState('10000');

    // Odds Converter State
    const [oddsValue, setOddsValue] = useState('');

    // Point Spread Calculator State
    const [spreadOdds, setSpreadOdds] = useState('');
    const [spreadPoints, setSpreadPoints] = useState('');

    // Helper Functions
    const americanToDecimal = (american: number) => {
        if (american > 0) return (american / 100) + 1;
        return (100 / Math.abs(american)) + 1;
    };

    const calculateParlayOdds = () => {
        const validLegs = parlayLegs.filter(leg => leg.odds && !isNaN(Number(leg.odds)));
        if (validLegs.length < 2) return { totalOdds: 0, payout: 0, profit: 0 };

        const decimalOdds = validLegs.map(leg => americanToDecimal(Number(leg.odds)));
        const totalDecimal = decimalOdds.reduce((acc, odd) => acc * odd, 1);
        const stake = Number(parlayStake) || 0;
        const payout = stake * totalDecimal;

        return {
            totalOdds: totalDecimal,
            payout: payout.toFixed(2),
            profit: (payout - stake).toFixed(2)
        };
    };

    const calculateArbitrage = () => {
        const odds1 = Number(arbBet1Odds);
        const odds2 = Number(arbBet2Odds);
        const stake = Number(arbStake);

        if (!odds1 || !odds2 || !stake) return { bet1: 0, bet2: 0, profit: 0, isArb: false };

        const dec1 = americanToDecimal(odds1);
        const dec2 = americanToDecimal(odds2);

        const bet1 = stake / (1 + (dec2 / (dec1 - 1)));
        const bet2 = stake - bet1;

        const payout1 = bet1 * dec1;
        const payout2 = bet2 * dec2;
        const profit = Math.min(payout1, payout2) - stake;

        return {
            bet1: bet1.toFixed(2),
            bet2: bet2.toFixed(2),
            profit: profit.toFixed(2),
            isArb: profit > 0
        };
    };

    const calculateEV = () => {
        const odds = Number(evOdds);
        const prob = Number(evProbability) / 100;
        const stake = Number(evStake);

        if (!odds || !prob || !stake) return { ev: 0, roi: 0 };

        const decimal = americanToDecimal(odds);
        const winAmount = stake * (decimal - 1);
        const ev = (prob * winAmount) - ((1 - prob) * stake);
        const roi = (ev / stake) * 100;

        return {
            ev: ev.toFixed(2),
            roi: roi.toFixed(2)
        };
    };

    const calculateImpliedProbability = () => {
        const odds = Number(impliedOdds);
        if (!odds) return { probability: 0 };

        const decimal = americanToDecimal(odds);
        const prob = (1 / decimal) * 100;

        return { probability: prob.toFixed(2) };
    };

    const calculateKelly = () => {
        const odds = Number(kellyOdds);
        const prob = Number(kellyProbability) / 100;
        const bankroll = Number(kellyBankroll);

        if (!odds || !prob || !bankroll) return { kellyStake: 0, kellyPercent: 0 };

        const decimal = americanToDecimal(odds);
        const b = decimal - 1;
        const kellyPercent = ((b * prob - (1 - prob)) / b) * 100;
        const kellyStake = (kellyPercent / 100) * bankroll;

        return {
            kellyStake: Math.max(0, kellyStake).toFixed(2),
            kellyPercent: Math.max(0, kellyPercent).toFixed(2)
        };
    };

    const calculators = [
        { id: 'parlay', name: t('calculators', 'ParlayCalc'), icon: <PieChart size={20} /> },
        { id: 'arbitrage', name: t('calculators', 'ArbitrageCalc'), icon: <ArrowLeftRight size={20} /> },
        { id: 'ev', name: t('calculators', 'EVCalc'), icon: <TrendingUp size={20} /> },
        { id: 'implied', name: t('calculators', 'ImpliedCalc'), icon: <Percent size={20} /> },
        { id: 'kelly', name: t('calculators', 'KellyCalc'), icon: <Target size={20} /> },
        { id: 'converter', name: t('calculators', 'ConverterCalc'), icon: <Calculator size={20} /> },
        { id: 'spread', name: t('calculators', 'SpreadCalc'), icon: <DollarSign size={20} /> },
    ];

    const parlayResults = calculateParlayOdds();
    const arbResults = calculateArbitrage();
    const evResults = calculateEV();
    const impliedResults = calculateImpliedProbability();
    const kellyResults = calculateKelly();

    return (
        <div className="min-h-screen bg-black text-white py-24 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black mb-6">
                        {t('calculators', 'PageTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600">{t('calculators', 'PageTitleHighlight')}</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        {t('calculators', 'PageSubtitle')}
                    </p>
                </div>

                {/* Calculator Tabs */}
                <div className="flex flex-wrap gap-3 mb-12 justify-center">
                    {calculators.map(calc => (
                        <button
                            key={calc.id}
                            onClick={() => setActiveCalc(calc.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeCalc === calc.id
                                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                                : 'bg-gray-900/50 text-gray-400 hover:bg-gray-900 hover:text-white border border-gray-800'
                                }`}
                        >
                            {calc.icon}
                            {calc.name}
                        </button>
                    ))}
                </div>

                {/* Calculator Content */}
                <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-8">

                    {/* PARLAY CALCULATOR */}
                    {activeCalc === 'parlay' && (
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-white">{t('calculators', 'ParlayTitle')}</h2>
                            <p className="text-gray-400 mb-8">{t('calculators', 'ParlayDesc')}</p>

                            <div className="space-y-5 mb-10">
                                {parlayLegs.map((leg, idx) => (
                                    <div key={idx} className="flex gap-4 items-center group">
                                        <div className="flex-1">
                                            <label className="block text-sm font-bold text-purple-300 mb-3">
                                                {t('calculators', 'Leg')} {idx + 1} {t('calculators', 'LegOdds')}
                                            </label>
                                            <input
                                                type="number"
                                                value={leg.odds}
                                                onChange={(e) => {
                                                    const newLegs = [...parlayLegs];
                                                    newLegs[idx].odds = e.target.value;
                                                    setParlayLegs(newLegs);
                                                }}
                                                placeholder="-110"
                                                className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-purple-900/20 border-2 border-purple-500/50 rounded-2xl text-white text-lg font-bold focus:border-purple-400 focus:outline-none focus:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
                                            />
                                        </div>
                                        {idx > 1 && (
                                            <button
                                                onClick={() => setParlayLegs(parlayLegs.filter((_, i) => i !== idx))}
                                                className="mt-10 px-5 py-4 bg-gradient-to-br from-red-900/40 to-rose-900/40 border-2 border-red-500/50 text-red-300 font-bold rounded-2xl hover:bg-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                                            >
                                                {t('calculators', 'Remove')}
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    onClick={() => setParlayLegs([...parlayLegs, { odds: '' }])}
                                    className="w-full py-4 border-2 border-dashed border-purple-500/50 text-purple-300 font-bold rounded-2xl hover:border-purple-400 hover:text-purple-200 hover:bg-purple-900/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
                                >
                                    + {t('calculators', 'AddLeg')}
                                </button>

                                <div>
                                    <label className="block text-sm font-bold text-cyan-300 mb-3">{t('calculators', 'Stake')}</label>
                                    <input
                                        type="number"
                                        value={parlayStake}
                                        onChange={(e) => setParlayStake(e.target.value)}
                                        className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-cyan-900/20 border-2 border-cyan-500/50 rounded-2xl text-white text-lg font-bold focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Main Results Grid */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="relative bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-2 border-purple-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative">
                                            <div className="text-xs font-bold text-purple-300 mb-3 uppercase tracking-wider">{t('calculators', 'TotalOdds')}</div>
                                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-violet-400 mb-2">
                                                {parlayResults.totalOdds.toFixed(2)}
                                            </div>
                                            <div className="text-xs text-purple-400/70 font-semibold">Decimal Format</div>
                                        </div>
                                    </div>
                                    <div className="relative bg-gradient-to-br from-emerald-900/40 to-green-900/40 border-2 border-emerald-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative">
                                            <div className="text-xs font-bold text-emerald-300 mb-3 uppercase tracking-wider">{t('calculators', 'TotalPayout')}</div>
                                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-green-400 mb-2">
                                                ${parlayResults.payout}
                                            </div>
                                            <div className="text-xs text-emerald-400/70 font-semibold">Total Return</div>
                                        </div>
                                    </div>
                                    <div className="relative bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative">
                                            <div className="text-xs font-bold text-cyan-300 mb-3 uppercase tracking-wider">{t('calculators', 'Profit')}</div>
                                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-400 mb-2">
                                                ${parlayResults.profit}
                                            </div>
                                            <div className="text-xs text-cyan-400/70 font-semibold">Net Winnings</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Insights */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 border border-orange-500/40 p-6 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-orange-300 font-bold mb-1">Number of Legs</div>
                                                <div className="text-3xl font-black text-orange-400">
                                                    {parlayLegs.filter(leg => leg.odds && !isNaN(Number(leg.odds))).length}
                                                </div>
                                            </div>
                                            <PieChart className="text-orange-500/50" size={40} />
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 border border-pink-500/40 p-6 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-pink-300 font-bold mb-1">ROI</div>
                                                <div className="text-3xl font-black text-pink-400">
                                                    {parlayResults.totalOdds > 0 ? (((parlayResults.totalOdds - 1) / 1) * 100).toFixed(1) : '0.0'}%
                                                </div>
                                            </div>
                                            <TrendingUp className="text-pink-500/50" size={40} />
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 border border-indigo-500/40 p-6 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-indigo-300 font-bold mb-1">Win Probability</div>
                                                <div className="text-3xl font-black text-indigo-400">
                                                    {parlayResults.totalOdds > 0 ? ((1 / parlayResults.totalOdds) * 100).toFixed(2) : '0.00'}%
                                                </div>
                                            </div>
                                            <Percent className="text-indigo-500/50" size={40} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ARBITRAGE CALCULATOR */}
                    {activeCalc === 'arbitrage' && (
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-white">{t('calculators', 'ArbitrageTitle')}</h2>
                            <p className="text-gray-400 mb-8">{t('calculators', 'ArbitrageDesc')}</p>

                            <div className="grid md:grid-cols-3 gap-6 mb-10">
                                <div>
                                    <label className="block text-sm font-bold text-purple-300 mb-3">{t('calculators', 'Bet1Odds')}</label>
                                    <input
                                        type="number"
                                        value={arbBet1Odds}
                                        onChange={(e) => setArbBet1Odds(e.target.value)}
                                        placeholder="+150"
                                        className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-purple-900/20 border-2 border-purple-500/50 rounded-2xl text-white text-lg font-bold focus:border-purple-400 focus:outline-none focus:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-violet-300 mb-3">{t('calculators', 'Bet2Odds')}</label>
                                    <input
                                        type="number"
                                        value={arbBet2Odds}
                                        onChange={(e) => setArbBet2Odds(e.target.value)}
                                        placeholder="-120"
                                        className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-violet-900/20 border-2 border-violet-500/50 rounded-2xl text-white text-lg font-bold focus:border-violet-400 focus:outline-none focus:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-cyan-300 mb-3">{t('calculators', 'TotalStake')}</label>
                                    <input
                                        type="number"
                                        value={arbStake}
                                        onChange={(e) => setArbStake(e.target.value)}
                                        className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-cyan-900/20 border-2 border-cyan-500/50 rounded-2xl text-white text-lg font-bold focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Arbitrage Opportunity Indicator */}
                                {arbBet1Odds && arbBet2Odds && arbStake && (
                                    <div className={`relative ${arbResults.isArb ? 'bg-gradient-to-r from-emerald-900/40 via-green-900/40 to-emerald-900/40' : 'bg-gradient-to-r from-red-900/40 via-rose-900/40 to-red-900/40'} border-2 ${arbResults.isArb ? 'border-emerald-500/50' : 'border-red-500/50'} rounded-3xl p-8 overflow-hidden shadow-[0_0_40px_rgba(${arbResults.isArb ? '16,185,129' : '239,68,68'},0.3)]`}>
                                        <div className={`absolute inset-0 bg-gradient-to-r ${arbResults.isArb ? 'from-emerald-500/10 via-transparent to-green-500/10' : 'from-red-500/10 via-transparent to-rose-500/10'} animate-pulse`}></div>
                                        <div className="relative text-center">
                                            <div className={`text-sm font-bold ${arbResults.isArb ? 'text-emerald-300' : 'text-red-300'} mb-3 uppercase tracking-widest`}>
                                                {arbResults.isArb ? '✓ ARBITRAGE OPPORTUNITY FOUND!' : '✗ NO ARBITRAGE OPPORTUNITY'}
                                            </div>
                                            <div className={`text-6xl font-black text-transparent bg-clip-text ${arbResults.isArb ? 'bg-gradient-to-br from-emerald-300 to-green-400' : 'bg-gradient-to-br from-red-300 to-rose-400'} mb-2`}>
                                                ${arbResults.profit}
                                            </div>
                                            <div className={`text-sm ${arbResults.isArb ? 'text-emerald-400/80' : 'text-red-400/80'} font-semibold`}>
                                                {arbResults.isArb ? 'Guaranteed Profit' : t('calculators', 'NoArbitrage')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Stake Distribution */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="relative bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-2 border-purple-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative">
                                            <div className="text-xs font-bold text-purple-300 mb-3 uppercase tracking-wider">{t('calculators', 'StakeOnBet1')}</div>
                                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-violet-400 mb-2">
                                                ${arbResults.bet1}
                                            </div>
                                            <div className="text-xs text-purple-400/70 font-semibold">First Outcome</div>
                                        </div>
                                    </div>
                                    <div className="relative bg-gradient-to-br from-violet-900/40 to-fuchsia-900/40 border-2 border-violet-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative">
                                            <div className="text-xs font-bold text-violet-300 mb-3 uppercase tracking-wider">{t('calculators', 'StakeOnBet2')}</div>
                                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-300 to-fuchsia-400 mb-2">
                                                ${arbResults.bet2}
                                            </div>
                                            <div className="text-xs text-violet-400/70 font-semibold">Second Outcome</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Metrics */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/40 p-6 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-cyan-300 font-bold mb-1">Profit Margin</div>
                                                <div className="text-3xl font-black text-cyan-400">
                                                    {arbStake && Number(arbStake) > 0 ? ((Number(arbResults.profit) / Number(arbStake)) * 100).toFixed(2) : '0.00'}%
                                                </div>
                                            </div>
                                            <Percent className="text-cyan-500/50" size={40} />
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 border border-orange-500/40 p-6 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-orange-300 font-bold mb-1">Total Stake</div>
                                                <div className="text-3xl font-black text-orange-400">
                                                    ${arbStake || '0'}
                                                </div>
                                            </div>
                                            <DollarSign className="text-orange-500/50" size={40} />
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 border border-pink-500/40 p-6 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-pink-300 font-bold mb-1">ROI</div>
                                                <div className="text-3xl font-black text-pink-400">
                                                    {arbStake && Number(arbStake) > 0 ? ((Number(arbResults.profit) / Number(arbStake)) * 100).toFixed(1) : '0.0'}%
                                                </div>
                                            </div>
                                            <TrendingUp className="text-pink-500/50" size={40} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EXPECTED VALUE CALCULATOR */}
                    {activeCalc === 'ev' && (
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-white">{t('calculators', 'EVTitle')}</h2>
                            <p className="text-gray-400 mb-8">{t('calculators', 'EVDesc')}</p>

                            <div className="grid md:grid-cols-3 gap-6 mb-10">
                                <div>
                                    <label className="block text-sm font-bold text-purple-300 mb-3">{t('calculators', 'Odds')}</label>
                                    <input
                                        type="number"
                                        value={evOdds}
                                        onChange={(e) => setEvOdds(e.target.value)}
                                        placeholder="+200"
                                        className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-purple-900/20 border-2 border-purple-500/50 rounded-2xl text-white text-lg font-bold focus:border-purple-400 focus:outline-none focus:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-violet-300 mb-3">{t('calculators', 'WinProbability')}</label>
                                    <input
                                        type="number"
                                        value={evProbability}
                                        onChange={(e) => setEvProbability(e.target.value)}
                                        placeholder="40"
                                        className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-violet-900/20 border-2 border-violet-500/50 rounded-2xl text-white text-lg font-bold focus:border-violet-400 focus:outline-none focus:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-cyan-300 mb-3">{t('calculators', 'Stake')}</label>
                                    <input
                                        type="number"
                                        value={evStake}
                                        onChange={(e) => setEvStake(e.target.value)}
                                        className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-cyan-900/20 border-2 border-cyan-500/50 rounded-2xl text-white text-lg font-bold focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* EV Indicator */}
                                {evOdds && evProbability && evStake && (
                                    <div className={`relative ${Number(evResults.ev) > 0 ? 'bg-gradient-to-r from-emerald-900/40 via-green-900/40 to-emerald-900/40' : 'bg-gradient-to-r from-red-900/40 via-rose-900/40 to-red-900/40'} border-2 ${Number(evResults.ev) > 0 ? 'border-emerald-500/50' : 'border-red-500/50'} rounded-3xl p-8 overflow-hidden shadow-[0_0_40px_rgba(${Number(evResults.ev) > 0 ? '16,185,129' : '239,68,68'},0.3)]`}>
                                        <div className={`absolute inset-0 bg-gradient-to-r ${Number(evResults.ev) > 0 ? 'from-emerald-500/10 via-transparent to-green-500/10' : 'from-red-500/10 via-transparent to-rose-500/10'} animate-pulse`}></div>
                                        <div className="relative text-center">
                                            <div className={`text-sm font-bold ${Number(evResults.ev) > 0 ? 'text-emerald-300' : 'text-red-300'} mb-3 uppercase tracking-widest`}>
                                                {Number(evResults.ev) > 0 ? '✓ POSITIVE EXPECTED VALUE' : '✗ NEGATIVE EXPECTED VALUE'}
                                            </div>
                                            <div className={`text-6xl font-black text-transparent bg-clip-text ${Number(evResults.ev) > 0 ? 'bg-gradient-to-br from-emerald-300 to-green-400' : 'bg-gradient-to-br from-red-300 to-rose-400'} mb-2`}>
                                                ${evResults.ev}
                                            </div>
                                            <div className={`text-sm ${Number(evResults.ev) > 0 ? 'text-emerald-400/80' : 'text-red-400/80'} font-semibold`}>
                                                {Number(evResults.ev) > 0 ? t('calculators', 'GoodBet') : t('calculators', 'BadBet')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Main Results */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className={`relative ${Number(evResults.ev) > 0 ? 'bg-gradient-to-br from-emerald-900/40 to-green-900/40 border-emerald-500/50' : 'bg-gradient-to-br from-red-900/40 to-rose-900/40 border-red-500/50'} border-2 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(${Number(evResults.ev) > 0 ? '16,185,129' : '239,68,68'},0.5)] transition-all duration-300`}>
                                        <div className={`absolute inset-0 ${Number(evResults.ev) > 0 ? 'bg-gradient-to-br from-emerald-500/20' : 'bg-gradient-to-br from-red-500/20'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                        <div className="relative">
                                            <div className={`text-xs font-bold ${Number(evResults.ev) > 0 ? 'text-emerald-300' : 'text-red-300'} mb-3 uppercase tracking-wider`}>{t('calculators', 'ExpectedValue')}</div>
                                            <div className={`text-5xl font-black text-transparent bg-clip-text ${Number(evResults.ev) > 0 ? 'bg-gradient-to-br from-emerald-300 to-green-400' : 'bg-gradient-to-br from-red-300 to-rose-400'} mb-2`}>
                                                ${evResults.ev}
                                            </div>
                                            <div className={`text-xs ${Number(evResults.ev) > 0 ? 'text-emerald-400/70' : 'text-red-400/70'} font-semibold`}>Per Bet Average</div>
                                        </div>
                                    </div>
                                    <div className="relative bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-2 border-purple-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative">
                                            <div className="text-xs font-bold text-purple-300 mb-3 uppercase tracking-wider">{t('calculators', 'ROI')}</div>
                                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-violet-400 mb-2">
                                                {evResults.roi}%
                                            </div>
                                            <div className="text-xs text-purple-400/70 font-semibold">Return on Investment</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Insights */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/40 p-6 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-cyan-300 font-bold mb-1">Win Probability</div>
                                                <div className="text-3xl font-black text-cyan-400">
                                                    {evProbability || '0'}%
                                                </div>
                                            </div>
                                            <Percent className="text-cyan-500/50" size={40} />
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 border border-orange-500/40 p-6 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-orange-300 font-bold mb-1">Potential Profit</div>
                                                <div className="text-3xl font-black text-orange-400">
                                                    ${evOdds && evStake ? ((Number(evStake) * (americanToDecimal(Number(evOdds)) - 1))).toFixed(2) : '0.00'}
                                                </div>
                                            </div>
                                            <DollarSign className="text-orange-500/50" size={40} />
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 border border-pink-500/40 p-6 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-pink-300 font-bold mb-1">Edge</div>
                                                <div className="text-3xl font-black text-pink-400">
                                                    {evOdds && evProbability ? (Number(evProbability) - ((1 / americanToDecimal(Number(evOdds))) * 100)).toFixed(2) : '0.00'}%
                                                </div>
                                            </div>
                                            <TrendingUp className="text-pink-500/50" size={40} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* IMPLIED PROBABILITY CALCULATOR */}
                    {activeCalc === 'implied' && (
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-white">{t('calculators', 'ImpliedTitle')}</h2>
                            <p className="text-gray-400 mb-8">{t('calculators', 'ImpliedDesc')}</p>

                            <div className="mb-10">
                                <label className="block text-sm font-bold text-purple-300 mb-3">{t('calculators', 'Odds')}</label>
                                <input
                                    type="number"
                                    value={impliedOdds}
                                    onChange={(e) => setImpliedOdds(e.target.value)}
                                    placeholder="-110"
                                    className="w-full max-w-2xl px-6 py-5 bg-gradient-to-br from-black/60 to-purple-900/30 border-2 border-purple-500/50 rounded-2xl text-white text-xl font-bold focus:border-purple-400 focus:outline-none focus:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
                                />
                            </div>

                            {impliedOdds && (
                                <div className="space-y-6">
                                    {/* Main Probability Display */}
                                    <div className="relative bg-gradient-to-br from-purple-900/40 via-violet-900/40 to-fuchsia-900/40 border-2 border-purple-500/50 p-10 rounded-3xl overflow-hidden group hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                                        <div className="relative text-center">
                                            <div className="text-sm font-bold text-purple-300 mb-4 uppercase tracking-widest">{t('calculators', 'ImpliedProbability')}</div>
                                            <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-300 via-violet-300 to-fuchsia-300 mb-4 drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]">
                                                {impliedResults.probability}%
                                            </div>
                                            <div className="text-sm text-purple-400/80 font-semibold">{t('calculators', 'ImpliedNote')}</div>
                                        </div>
                                    </div>

                                    {/* Additional Metrics Grid */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="relative bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500/50 p-6 rounded-2xl overflow-hidden group hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative">
                                                <div className="text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">Decimal Odds</div>
                                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-400">
                                                    {americanToDecimal(Number(impliedOdds)).toFixed(3)}
                                                </div>
                                                <div className="text-xs text-cyan-400/70 mt-2">European Format</div>
                                            </div>
                                        </div>

                                        <div className="relative bg-gradient-to-br from-emerald-900/40 to-green-900/40 border-2 border-emerald-500/50 p-6 rounded-2xl overflow-hidden group hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative">
                                                <div className="text-xs font-bold text-emerald-300 mb-2 uppercase tracking-wider">Fair Odds</div>
                                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-green-400">
                                                    {Number(impliedOdds) > 0 ? '+' : ''}{impliedOdds}
                                                </div>
                                                <div className="text-xs text-emerald-400/70 mt-2">American Format</div>
                                            </div>
                                        </div>

                                        <div className="relative bg-gradient-to-br from-orange-900/40 to-amber-900/40 border-2 border-orange-500/50 p-6 rounded-2xl overflow-hidden group hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative">
                                                <div className="text-xs font-bold text-orange-300 mb-2 uppercase tracking-wider">Break Even</div>
                                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-300 to-amber-400">
                                                    {impliedResults.probability}%
                                                </div>
                                                <div className="text-xs text-orange-400/70 mt-2">Win Rate Needed</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visual Probability Bar */}
                                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 p-6 rounded-2xl">
                                        <div className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Probability Visualization</div>
                                        <div className="relative h-8 bg-gray-800/80 rounded-full overflow-hidden border border-gray-700">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(168,85,247,0.8)]"
                                                style={{ width: `${impliedResults.probability}%` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between mt-3 text-xs font-semibold">
                                            <span className="text-gray-500">0%</span>
                                            <span className="text-purple-400">{impliedResults.probability}%</span>
                                            <span className="text-gray-500">100%</span>
                                        </div>
                                    </div>

                                    {/* Betting Insights */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 border border-pink-500/40 p-6 rounded-2xl">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs text-pink-300 font-bold mb-1">Inverse Probability</div>
                                                    <div className="text-3xl font-black text-pink-400">
                                                        {(100 - Number(impliedResults.probability)).toFixed(2)}%
                                                    </div>
                                                    <div className="text-xs text-pink-400/70 mt-1">Chance to Lose</div>
                                                </div>
                                                <Percent className="text-pink-500/50" size={40} />
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 border border-indigo-500/40 p-6 rounded-2xl">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs text-indigo-300 font-bold mb-1">Expected ROI</div>
                                                    <div className="text-3xl font-black text-indigo-400">
                                                        {(((americanToDecimal(Number(impliedOdds)) - 1) / 1) * 100).toFixed(1)}%
                                                    </div>
                                                    <div className="text-xs text-indigo-400/70 mt-1">If Bet Wins</div>
                                                </div>
                                                <TrendingUp className="text-indigo-500/50" size={40} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* KELLY CRITERION CALCULATOR */}
                    {activeCalc === 'kelly' && (
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-white">{t('calculators', 'KellyTitle')}</h2>
                            <p className="text-gray-400 mb-8">{t('calculators', 'KellyDesc')}</p>

                            <div className="grid md:grid-cols-3 gap-6 mb-10">
                                <div>
                                    <label className="block text-sm font-bold text-purple-300 mb-3">{t('calculators', 'Odds')}</label>
                                    <input
                                        type="number"
                                        value={kellyOdds}
                                        onChange={(e) => setKellyOdds(e.target.value)}
                                        placeholder="+200"
                                        className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-purple-900/20 border-2 border-purple-500/50 rounded-2xl text-white text-lg font-bold focus:border-purple-400 focus:outline-none focus:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-violet-300 mb-3">{t('calculators', 'WinProbability')}</label>
                                    <input
                                        type="number"
                                        value={kellyProbability}
                                        onChange={(e) => setKellyProbability(e.target.value)}
                                        placeholder="40"
                                        className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-violet-900/20 border-2 border-violet-500/50 rounded-2xl text-white text-lg font-bold focus:border-violet-400 focus:outline-none focus:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-cyan-300 mb-3">{t('calculators', 'TotalBankroll')}</label>
                                    <input
                                        type="number"
                                        value={kellyBankroll}
                                        onChange={(e) => setKellyBankroll(e.target.value)}
                                        className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-cyan-900/20 border-2 border-cyan-500/50 rounded-2xl text-white text-lg font-bold focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Main Results */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="relative bg-gradient-to-br from-emerald-900/40 to-green-900/40 border-2 border-emerald-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative">
                                            <div className="text-xs font-bold text-emerald-300 mb-3 uppercase tracking-wider">{t('calculators', 'RecommendedStake')}</div>
                                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-green-400 mb-2">
                                                ${kellyResults.kellyStake}
                                            </div>
                                            <div className="text-xs text-emerald-400/70 font-semibold">Optimal Bet Size</div>
                                        </div>
                                    </div>
                                    <div className="relative bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-2 border-purple-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative">
                                            <div className="text-xs font-bold text-purple-300 mb-3 uppercase tracking-wider">{t('calculators', 'PercentOfBankroll')}</div>
                                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-violet-400 mb-2">
                                                {kellyResults.kellyPercent}%
                                            </div>
                                            <div className="text-xs text-purple-400/70 font-semibold">Kelly Percentage</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Visual Bankroll Allocation */}
                                {kellyOdds && kellyProbability && kellyBankroll && Number(kellyResults.kellyPercent) > 0 && (
                                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 p-6 rounded-2xl">
                                        <div className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Bankroll Allocation</div>
                                        <div className="relative h-8 bg-gray-800/80 rounded-full overflow-hidden border border-gray-700">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.8)]"
                                                style={{ width: `${Math.min(Number(kellyResults.kellyPercent), 100)}%` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between mt-3 text-xs font-semibold">
                                            <span className="text-gray-500">$0</span>
                                            <span className="text-emerald-400">${kellyResults.kellyStake} ({kellyResults.kellyPercent}%)</span>
                                            <span className="text-gray-500">${kellyBankroll}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Additional Insights */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/40 p-6 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-cyan-300 font-bold mb-1">Remaining Bankroll</div>
                                                <div className="text-3xl font-black text-cyan-400">
                                                    ${kellyBankroll && kellyResults.kellyStake ? (Number(kellyBankroll) - Number(kellyResults.kellyStake)).toFixed(2) : '0.00'}
                                                </div>
                                            </div>
                                            <DollarSign className="text-cyan-500/50" size={40} />
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 border border-orange-500/40 p-6 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-orange-300 font-bold mb-1">Potential Profit</div>
                                                <div className="text-3xl font-black text-orange-400">
                                                    ${kellyOdds && kellyResults.kellyStake ? ((Number(kellyResults.kellyStake) * (americanToDecimal(Number(kellyOdds)) - 1))).toFixed(2) : '0.00'}
                                                </div>
                                            </div>
                                            <TrendingUp className="text-orange-500/50" size={40} />
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 border border-pink-500/40 p-6 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-pink-300 font-bold mb-1">Edge</div>
                                                <div className="text-3xl font-black text-pink-400">
                                                    {kellyOdds && kellyProbability ? (Number(kellyProbability) - ((1 / americanToDecimal(Number(kellyOdds))) * 100)).toFixed(2) : '0.00'}%
                                                </div>
                                            </div>
                                            <Percent className="text-pink-500/50" size={40} />
                                        </div>
                                    </div>
                                </div>

                                {/* Warning */}
                                <div className="relative bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border-2 border-yellow-500/40 p-6 rounded-2xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent"></div>
                                    <div className="relative flex items-start gap-4">
                                        <div className="text-yellow-400 mt-1">⚠️</div>
                                        <div>
                                            <div className="text-sm font-bold text-yellow-300 mb-2">Kelly Criterion Warning</div>
                                            <div className="text-xs text-yellow-400/90 leading-relaxed">{t('calculators', 'KellyWarning')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ODDS CONVERTER */}
                    {activeCalc === 'converter' && (
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-white">{t('calculators', 'ConverterTitle')}</h2>
                            <p className="text-gray-400 mb-8">{t('calculators', 'ConverterDesc')}</p>

                            <div className="mb-10">
                                <label className="block text-sm font-bold text-purple-300 mb-3">{t('calculators', 'EnterOdds')}</label>
                                <input
                                    type="number"
                                    value={oddsValue}
                                    onChange={(e) => setOddsValue(e.target.value)}
                                    placeholder="-110"
                                    className="w-full max-w-2xl px-6 py-5 bg-gradient-to-br from-black/60 to-purple-900/30 border-2 border-purple-500/50 rounded-2xl text-white text-xl font-bold focus:border-purple-400 focus:outline-none focus:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
                                />
                            </div>

                            {oddsValue && (
                                <div className="space-y-6">
                                    {/* Main Conversion Display */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="relative bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-2 border-purple-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative">
                                                <div className="text-xs font-bold text-purple-300 mb-3 uppercase tracking-wider">{t('calculators', 'American')}</div>
                                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-violet-400 mb-2">
                                                    {Number(oddsValue) > 0 ? '+' : ''}{oddsValue}
                                                </div>
                                                <div className="text-xs text-purple-400/70 font-semibold">US Format</div>
                                            </div>
                                        </div>
                                        <div className="relative bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative">
                                                <div className="text-xs font-bold text-cyan-300 mb-3 uppercase tracking-wider">{t('calculators', 'Decimal')}</div>
                                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-400 mb-2">
                                                    {americanToDecimal(Number(oddsValue)).toFixed(2)}
                                                </div>
                                                <div className="text-xs text-cyan-400/70 font-semibold">European Format</div>
                                            </div>
                                        </div>
                                        <div className="relative bg-gradient-to-br from-emerald-900/40 to-green-900/40 border-2 border-emerald-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative">
                                                <div className="text-xs font-bold text-emerald-300 mb-3 uppercase tracking-wider">{t('calculators', 'ImpliedProbability')}</div>
                                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-green-400 mb-2">
                                                    {((1 / americanToDecimal(Number(oddsValue))) * 100).toFixed(2)}%
                                                </div>
                                                <div className="text-xs text-emerald-400/70 font-semibold">Win Chance</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Format Conversions */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="relative bg-gradient-to-br from-orange-900/40 to-amber-900/40 border-2 border-orange-500/50 p-6 rounded-2xl overflow-hidden group hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative">
                                                <div className="text-xs font-bold text-orange-300 mb-2 uppercase tracking-wider">Fractional Odds</div>
                                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-300 to-amber-400 mb-1">
                                                    {(() => {
                                                        const decimal = americanToDecimal(Number(oddsValue));
                                                        const fractional = decimal - 1;
                                                        // Simple fraction approximation
                                                        if (fractional === 0.5) return '1/2';
                                                        if (fractional === 1) return '1/1';
                                                        if (fractional === 2) return '2/1';
                                                        if (fractional === 1.5) return '3/2';
                                                        if (fractional === 2.5) return '5/2';
                                                        return fractional.toFixed(2) + '/1';
                                                    })()}
                                                </div>
                                                <div className="text-xs text-orange-400/70 font-semibold">UK Format</div>
                                            </div>
                                        </div>
                                        <div className="relative bg-gradient-to-br from-pink-900/40 to-rose-900/40 border-2 border-pink-500/50 p-6 rounded-2xl overflow-hidden group hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative">
                                                <div className="text-xs font-bold text-pink-300 mb-2 uppercase tracking-wider">Payout Multiplier</div>
                                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-300 to-rose-400 mb-1">
                                                    {americanToDecimal(Number(oddsValue)).toFixed(2)}x
                                                </div>
                                                <div className="text-xs text-pink-400/70 font-semibold">Per $1 Wagered</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Betting Insights */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 border border-indigo-500/40 p-6 rounded-2xl">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs text-indigo-300 font-bold mb-1">Break Even %</div>
                                                    <div className="text-3xl font-black text-indigo-400">
                                                        {((1 / americanToDecimal(Number(oddsValue))) * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                                <Percent className="text-indigo-500/50" size={40} />
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 border border-violet-500/40 p-6 rounded-2xl">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs text-violet-300 font-bold mb-1">Potential ROI</div>
                                                    <div className="text-3xl font-black text-violet-400">
                                                        {(((americanToDecimal(Number(oddsValue)) - 1) / 1) * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                                <TrendingUp className="text-violet-500/50" size={40} />
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-fuchsia-900/30 to-pink-900/30 border border-fuchsia-500/40 p-6 rounded-2xl">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs text-fuchsia-300 font-bold mb-1">Odds Type</div>
                                                    <div className="text-3xl font-black text-fuchsia-400">
                                                        {Number(oddsValue) > 0 ? 'DOG' : 'FAV'}
                                                    </div>
                                                </div>
                                                <Target className="text-fuchsia-500/50" size={40} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* POINT SPREAD CALCULATOR */}
                    {activeCalc === 'spread' && (
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-white">{t('calculators', 'SpreadTitle')}</h2>
                            <p className="text-gray-400 mb-8">{t('calculators', 'SpreadDesc')}</p>

                            <div className="grid md:grid-cols-3 gap-6 mb-10">
                                <div>
                                    <label className="block text-sm font-bold text-purple-300 mb-3">{t('calculators', 'SpreadOdds')}</label>
                                    <input
                                        type="number"
                                        value={spreadOdds}
                                        onChange={(e) => setSpreadOdds(e.target.value)}
                                        placeholder="-110"
                                        className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-purple-900/20 border-2 border-purple-500/50 rounded-2xl text-white text-lg font-bold focus:border-purple-400 focus:outline-none focus:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-violet-300 mb-3">{t('calculators', 'PointSpread')}</label>
                                    <input
                                        type="number"
                                        value={spreadPoints}
                                        onChange={(e) => setSpreadPoints(e.target.value)}
                                        placeholder="-7.5"
                                        step="0.5"
                                        className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-violet-900/20 border-2 border-violet-500/50 rounded-2xl text-white text-lg font-bold focus:border-violet-400 focus:outline-none focus:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-cyan-300 mb-3">{t('calculators', 'Stake')}</label>
                                    <input
                                        type="number"
                                        value={parlayStake}
                                        onChange={(e) => setParlayStake(e.target.value)}
                                        className="w-full px-5 py-4 bg-gradient-to-br from-black/60 to-cyan-900/20 border-2 border-cyan-500/50 rounded-2xl text-white text-lg font-bold focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
                                    />
                                </div>
                            </div>

                            {spreadOdds && (
                                <div className="space-y-6">
                                    {/* Spread Visual Display */}
                                    {spreadPoints && (
                                        <div className="relative bg-gradient-to-r from-purple-900/30 via-violet-900/30 to-purple-900/30 border-2 border-purple-500/40 rounded-3xl p-8 overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-violet-500/10 animate-pulse"></div>
                                            <div className="relative flex items-center justify-center gap-8">
                                                <div className="text-center flex-1">
                                                    <div className="text-sm font-bold text-purple-300 mb-2">FAVORITE</div>
                                                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-purple-500">
                                                        {Number(spreadPoints) < 0 ? spreadPoints : `+${spreadPoints}`}
                                                    </div>
                                                </div>
                                                <div className="text-4xl font-black text-purple-400/50">VS</div>
                                                <div className="text-center flex-1">
                                                    <div className="text-sm font-bold text-violet-300 mb-2">UNDERDOG</div>
                                                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-300 to-violet-500">
                                                        {Number(spreadPoints) > 0 ? spreadPoints : `+${Math.abs(Number(spreadPoints))}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Results Grid */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="relative bg-gradient-to-br from-emerald-900/40 to-green-900/40 border-2 border-emerald-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative">
                                                <div className="text-xs font-bold text-emerald-300 mb-3 uppercase tracking-wider">{t('calculators', 'PotentialPayout')}</div>
                                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-emerald-500 mb-2">
                                                    ${(Number(parlayStake) * americanToDecimal(Number(spreadOdds))).toFixed(2)}
                                                </div>
                                                <div className="text-xs text-emerald-400/70 font-semibold">Total Return</div>
                                            </div>
                                        </div>

                                        <div className="relative bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-2 border-purple-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative">
                                                <div className="text-xs font-bold text-purple-300 mb-3 uppercase tracking-wider">{t('calculators', 'Profit')}</div>
                                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-violet-400 mb-2">
                                                    ${((Number(parlayStake) * americanToDecimal(Number(spreadOdds))) - Number(parlayStake)).toFixed(2)}
                                                </div>
                                                <div className="text-xs text-purple-400/70 font-semibold">Net Winnings</div>
                                            </div>
                                        </div>

                                        <div className="relative bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500/50 p-8 rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative">
                                                <div className="text-xs font-bold text-cyan-300 mb-3 uppercase tracking-wider">Win Probability</div>
                                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-400 mb-2">
                                                    {((1 / americanToDecimal(Number(spreadOdds))) * 100).toFixed(1)}%
                                                </div>
                                                <div className="text-xs text-cyan-400/70 font-semibold">Implied Odds</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Insights */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 border border-orange-500/40 p-6 rounded-2xl">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs text-orange-300 font-bold mb-1">ROI</div>
                                                    <div className="text-3xl font-black text-orange-400">
                                                        {(((americanToDecimal(Number(spreadOdds)) - 1) / 1) * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                                <TrendingUp className="text-orange-500/50" size={40} />
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 border border-pink-500/40 p-6 rounded-2xl">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs text-pink-300 font-bold mb-1">Decimal Odds</div>
                                                    <div className="text-3xl font-black text-pink-400">
                                                        {americanToDecimal(Number(spreadOdds)).toFixed(3)}
                                                    </div>
                                                </div>
                                                <Calculator className="text-pink-500/50" size={40} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalculatorsPage;
