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
                        {t('calculators', 'PageTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{t('calculators', 'PageTitleHighlight')}</span>
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
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'
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

                            <div className="space-y-4 mb-8">
                                {parlayLegs.map((leg, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="flex-1">
                                            <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'Leg')} {idx + 1} {t('calculators', 'LegOdds')}</label>
                                            <input
                                                type="number"
                                                value={leg.odds}
                                                onChange={(e) => {
                                                    const newLegs = [...parlayLegs];
                                                    newLegs[idx].odds = e.target.value;
                                                    setParlayLegs(newLegs);
                                                }}
                                                placeholder="-110"
                                                className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                            />
                                        </div>
                                        {idx > 1 && (
                                            <button
                                                onClick={() => setParlayLegs(parlayLegs.filter((_, i) => i !== idx))}
                                                className="mt-7 px-4 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition"
                                            >
                                                {t('calculators', 'Remove')}
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    onClick={() => setParlayLegs([...parlayLegs, { odds: '' }])}
                                    className="w-full py-3 border-2 border-dashed border-gray-700 text-gray-400 rounded-xl hover:border-purple-500 hover:text-purple-400 transition"
                                >
                                    {t('calculators', 'AddLeg')}
                                </button>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'Stake')}</label>
                                    <input
                                        type="number"
                                        value={parlayStake}
                                        onChange={(e) => setParlayStake(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-2xl">
                                    <div className="text-sm text-gray-400 mb-2">{t('calculators', 'TotalOdds')}</div>
                                    <div className="text-3xl font-black text-purple-400">{parlayResults.totalOdds.toFixed(2)}</div>
                                </div>
                                <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl">
                                    <div className="text-sm text-gray-400 mb-2">{t('calculators', 'TotalPayout')}</div>
                                    <div className="text-3xl font-black text-green-400">${parlayResults.payout}</div>
                                </div>
                                <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl">
                                    <div className="text-sm text-gray-400 mb-2">{t('calculators', 'Profit')}</div>
                                    <div className="text-3xl font-black text-blue-400">${parlayResults.profit}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ARBITRAGE CALCULATOR */}
                    {activeCalc === 'arbitrage' && (
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-white">{t('calculators', 'ArbitrageTitle')}</h2>
                            <p className="text-gray-400 mb-8">{t('calculators', 'ArbitrageDesc')}</p>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'Bet1Odds')}</label>
                                    <input
                                        type="number"
                                        value={arbBet1Odds}
                                        onChange={(e) => setArbBet1Odds(e.target.value)}
                                        placeholder="+150"
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'Bet2Odds')}</label>
                                    <input
                                        type="number"
                                        value={arbBet2Odds}
                                        onChange={(e) => setArbBet2Odds(e.target.value)}
                                        placeholder="-120"
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'TotalStake')}</label>
                                    <input
                                        type="number"
                                        value={arbStake}
                                        onChange={(e) => setArbStake(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-2xl">
                                    <div className="text-sm text-gray-400 mb-2">{t('calculators', 'StakeOnBet1')}</div>
                                    <div className="text-3xl font-black text-purple-400">${arbResults.bet1}</div>
                                </div>
                                <div className="bg-pink-900/20 border border-pink-500/30 p-6 rounded-2xl">
                                    <div className="text-sm text-gray-400 mb-2">{t('calculators', 'StakeOnBet2')}</div>
                                    <div className="text-3xl font-black text-pink-400">${arbResults.bet2}</div>
                                </div>
                                <div className={`${arbResults.isArb ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'} border p-6 rounded-2xl`}>
                                    <div className="text-sm text-gray-400 mb-2">{t('calculators', 'GuaranteedProfit')}</div>
                                    <div className={`text-3xl font-black ${arbResults.isArb ? 'text-green-400' : 'text-red-400'}`}>${arbResults.profit}</div>
                                    {!arbResults.isArb && <div className="text-xs text-red-400 mt-2">{t('calculators', 'NoArbitrage')}</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EXPECTED VALUE CALCULATOR */}
                    {activeCalc === 'ev' && (
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-white">{t('calculators', 'EVTitle')}</h2>
                            <p className="text-gray-400 mb-8">{t('calculators', 'EVDesc')}</p>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'Odds')}</label>
                                    <input
                                        type="number"
                                        value={evOdds}
                                        onChange={(e) => setEvOdds(e.target.value)}
                                        placeholder="+200"
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'WinProbability')}</label>
                                    <input
                                        type="number"
                                        value={evProbability}
                                        onChange={(e) => setEvProbability(e.target.value)}
                                        placeholder="40"
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'Stake')}</label>
                                    <input
                                        type="number"
                                        value={evStake}
                                        onChange={(e) => setEvStake(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`${Number(evResults.ev) > 0 ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'} border p-6 rounded-2xl`}>
                                    <div className="text-sm text-gray-400 mb-2">{t('calculators', 'ExpectedValue')}</div>
                                    <div className={`text-4xl font-black ${Number(evResults.ev) > 0 ? 'text-green-400' : 'text-red-400'}`}>${evResults.ev}</div>
                                    <div className="text-xs text-gray-500 mt-2">{Number(evResults.ev) > 0 ? t('calculators', 'GoodBet') : t('calculators', 'BadBet')}</div>
                                </div>
                                <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-2xl">
                                    <div className="text-sm text-gray-400 mb-2">{t('calculators', 'ROI')}</div>
                                    <div className="text-4xl font-black text-purple-400">{evResults.roi}%</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* IMPLIED PROBABILITY CALCULATOR */}
                    {activeCalc === 'implied' && (
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-white">{t('calculators', 'ImpliedTitle')}</h2>
                            <p className="text-gray-400 mb-8">{t('calculators', 'ImpliedDesc')}</p>

                            <div className="mb-8">
                                <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'Odds')}</label>
                                <input
                                    type="number"
                                    value={impliedOdds}
                                    onChange={(e) => setImpliedOdds(e.target.value)}
                                    placeholder="-110"
                                    className="w-full max-w-md px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            <div className="bg-purple-900/20 border border-purple-500/30 p-8 rounded-2xl max-w-md">
                                <div className="text-sm text-gray-400 mb-2">{t('calculators', 'ImpliedProbability')}</div>
                                <div className="text-5xl font-black text-purple-400">{impliedResults.probability}%</div>
                                <div className="text-xs text-gray-500 mt-4">{t('calculators', 'ImpliedNote')}</div>
                            </div>
                        </div>
                    )}

                    {/* KELLY CRITERION CALCULATOR */}
                    {activeCalc === 'kelly' && (
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-white">{t('calculators', 'KellyTitle')}</h2>
                            <p className="text-gray-400 mb-8">{t('calculators', 'KellyDesc')}</p>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'Odds')}</label>
                                    <input
                                        type="number"
                                        value={kellyOdds}
                                        onChange={(e) => setKellyOdds(e.target.value)}
                                        placeholder="+200"
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'WinProbability')}</label>
                                    <input
                                        type="number"
                                        value={kellyProbability}
                                        onChange={(e) => setKellyProbability(e.target.value)}
                                        placeholder="40"
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'TotalBankroll')}</label>
                                    <input
                                        type="number"
                                        value={kellyBankroll}
                                        onChange={(e) => setKellyBankroll(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl">
                                    <div className="text-sm text-gray-400 mb-2">{t('calculators', 'RecommendedStake')}</div>
                                    <div className="text-4xl font-black text-green-400">${kellyResults.kellyStake}</div>
                                </div>
                                <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-2xl">
                                    <div className="text-sm text-gray-400 mb-2">{t('calculators', 'PercentOfBankroll')}</div>
                                    <div className="text-4xl font-black text-purple-400">{kellyResults.kellyPercent}%</div>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl">
                                <div className="text-xs text-yellow-400">{t('calculators', 'KellyWarning')}</div>
                            </div>
                        </div>
                    )}

                    {/* ODDS CONVERTER */}
                    {activeCalc === 'converter' && (
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-white">{t('calculators', 'ConverterTitle')}</h2>
                            <p className="text-gray-400 mb-8">{t('calculators', 'ConverterDesc')}</p>

                            <div className="mb-8">
                                <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'EnterOdds')}</label>
                                <input
                                    type="number"
                                    value={oddsValue}
                                    onChange={(e) => setOddsValue(e.target.value)}
                                    placeholder="-110"
                                    className="w-full max-w-md px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            {oddsValue && (
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-2xl">
                                        <div className="text-sm text-gray-400 mb-2">{t('calculators', 'American')}</div>
                                        <div className="text-3xl font-black text-purple-400">{oddsValue}</div>
                                    </div>
                                    <div className="bg-pink-900/20 border border-pink-500/30 p-6 rounded-2xl">
                                        <div className="text-sm text-gray-400 mb-2">{t('calculators', 'Decimal')}</div>
                                        <div className="text-3xl font-black text-pink-400">{americanToDecimal(Number(oddsValue)).toFixed(2)}</div>
                                    </div>
                                    <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl">
                                        <div className="text-sm text-gray-400 mb-2">{t('calculators', 'ImpliedProbability')}</div>
                                        <div className="text-3xl font-black text-blue-400">{((1 / americanToDecimal(Number(oddsValue))) * 100).toFixed(2)}%</div>
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

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'SpreadOdds')}</label>
                                    <input
                                        type="number"
                                        value={spreadOdds}
                                        onChange={(e) => setSpreadOdds(e.target.value)}
                                        placeholder="-110"
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'PointSpread')}</label>
                                    <input
                                        type="number"
                                        value={spreadPoints}
                                        onChange={(e) => setSpreadPoints(e.target.value)}
                                        placeholder="-7.5"
                                        step="0.5"
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">{t('calculators', 'Stake')}</label>
                                    <input
                                        type="number"
                                        value={parlayStake}
                                        onChange={(e) => setParlayStake(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {spreadOdds && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl">
                                        <div className="text-sm text-gray-400 mb-2">{t('calculators', 'PotentialPayout')}</div>
                                        <div className="text-4xl font-black text-green-400">
                                            ${(Number(parlayStake) * americanToDecimal(Number(spreadOdds))).toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-2xl">
                                        <div className="text-sm text-gray-400 mb-2">{t('calculators', 'Profit')}</div>
                                        <div className="text-4xl font-black text-purple-400">
                                            ${((Number(parlayStake) * americanToDecimal(Number(spreadOdds))) - Number(parlayStake)).toFixed(2)}
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
