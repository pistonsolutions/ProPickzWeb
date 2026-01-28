import React, { useState, useEffect } from 'react';

const codeLines = [
    { type: 'code', content: 'picks = sports_picks.get_today_picks()' },
    { type: 'comment', content: '# Initialize hybrid model analysis' },
    { type: 'code', content: 'model.configure(accuracy=0.94)' },
    { type: 'blank', content: '' },
    { type: 'comment', content: '# Processing NBA matchups...' },
    { type: 'result', arrow: true, content: 'Lakers vs. Clippers' },
    { type: 'detail', content: 'Spread: -3.5 (+105)' },
    { type: 'result', arrow: true, content: 'Celtics vs. Heat' },
    { type: 'win', content: 'Moneyline: WIN (-120)' },
    { type: 'blank', content: '' },
    { type: 'comment', content: '# Processing MLB matchups...' },
    { type: 'result', arrow: true, content: 'Yankees vs. Red Sox' },
    { type: 'win', content: 'Moneyline: WIN (+110)' },
    { type: 'result', arrow: true, content: 'Dodgers vs. Padres' },
    { type: 'detail', content: 'Over 8.5 (+102)' },
    { type: 'blank', content: '' },
    { type: 'comment', content: '# Confidence scores calculated' },
    { type: 'code', content: 'total_ev = +4.7 units' },
    { type: 'code', content: 'picks_ready = True' },
];

const AlgorithmTerminal: React.FC = () => {
    const [displayedLines, setDisplayedLines] = useState<typeof codeLines>([]);
    const [currentLine, setCurrentLine] = useState(0);
    const [currentChar, setCurrentChar] = useState(0);
    const [isTyping] = useState(true);

    useEffect(() => {
        if (!isTyping) return;

        if (currentLine >= codeLines.length) {
            // Reset and loop
            setTimeout(() => {
                setDisplayedLines([]);
                setCurrentLine(0);
                setCurrentChar(0);
            }, 3000);
            return;
        }

        const line = codeLines[currentLine];
        const fullContent = line.content;

        if (currentChar < fullContent.length) {
            // Type next character
            const timeout = setTimeout(() => {
                setDisplayedLines(prev => {
                    const newLines = [...prev];
                    if (newLines.length <= currentLine) {
                        newLines.push({ ...line, content: fullContent.charAt(0) });
                    } else {
                        newLines[currentLine] = { ...line, content: fullContent.substring(0, currentChar + 1) };
                    }
                    return newLines;
                });
                setCurrentChar(prev => prev + 1);
            }, 30 + Math.random() * 20);
            return () => clearTimeout(timeout);
        } else {
            // Move to next line
            const timeout = setTimeout(() => {
                setCurrentLine(prev => prev + 1);
                setCurrentChar(0);
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [currentLine, currentChar, isTyping]);

    const renderLine = (line: typeof codeLines[0], index: number) => {
        switch (line.type) {
            case 'code':
                return (
                    <div key={index}>
                        <span className="text-blue-400">{line.content.split('=')[0]}</span>
                        {line.content.includes('=') && (
                            <>
                                <span className="text-white">=</span>
                                <span className="text-yellow-300">{line.content.split('=').slice(1).join('=')}</span>
                            </>
                        )}
                    </div>
                );
            case 'comment':
                return <div key={index} className="text-gray-500">{line.content}</div>;
            case 'result':
                return (
                    <div key={index} className="flex gap-2">
                        {line.arrow && <span className="text-green-400">➜</span>}
                        <span>{line.content}</span>
                    </div>
                );
            case 'detail':
                return <div key={index} className="pl-5 text-blue-300">{line.content}</div>;
            case 'win':
                return (
                    <div key={index} className="pl-5 text-blue-300">
                        {line.content.replace('WIN', '')}
                        <span className="bg-green-500/20 text-green-300 px-1 rounded ml-1">WIN</span>
                    </div>
                );
            case 'blank':
                return <div key={index} className="h-3"></div>;
            default:
                return <div key={index}>{line.content}</div>;
        }
    };

    return (
        <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden font-mono text-[10px] sm:text-xs shadow-2xl">
            <div className="bg-[#2d2d2d] px-3 py-2 flex gap-1.5 border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            </div>
            <div className="p-3 text-gray-300 space-y-1 overflow-hidden h-[280px]">
                {displayedLines.map((line, index) => renderLine(line, index))}
                <span className="text-green-500 animate-pulse">_</span>
            </div>
        </div>
    );
};

export default AlgorithmTerminal;
