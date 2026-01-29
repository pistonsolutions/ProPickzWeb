import React, { useState, useEffect } from 'react';

interface IPhone17FrameProps {
    children: React.ReactNode;
    className?: string;
}

const IPhone17Frame: React.FC<IPhone17FrameProps> = ({ children, className = '' }) => {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        };
        updateTime();
        const timeInterval = setInterval(updateTime, 60000); // Update every minute
        return () => clearInterval(timeInterval);
    }, []);

    return (
        <div className={`relative ${className}`}>
            {/* iPhone 17 Pro Max Chassis - Titanium Design */}
            <div
                className="relative w-full h-full rounded-[2.5rem] overflow-visible"
                style={{
                    background: 'linear-gradient(145deg, #3a3a3c 0%, #1c1c1e 50%, #2c2c2e 100%)',
                    padding: '3px',
                    boxShadow: `
                        0 25px 50px rgba(0,0,0,0.5),
                        inset 0 0 0 1px rgba(255,255,255,0.08),
                        inset 0 -1px 3px rgba(255,255,255,0.05)
                    `
                }}
            >
                {/* Titanium Frame Border Effect */}
                <div
                    className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-10"
                    style={{
                        border: '2px solid transparent',
                        background: 'linear-gradient(180deg, rgba(120,120,130,0.3) 0%, rgba(60,60,65,0.4) 50%, rgba(100,100,110,0.2) 100%) border-box',
                        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude'
                    }}
                />

                {/* Side Buttons (Left - Volume & Silent Switch) */}
                <div className="absolute -left-[2px] top-[18%] w-[2px] h-[6%] bg-gradient-to-r from-[#4a4a4c] to-[#3a3a3c] rounded-l-sm"></div>
                <div className="absolute -left-[2px] top-[26%] w-[2px] h-[10%] bg-gradient-to-r from-[#4a4a4c] to-[#3a3a3c] rounded-l-sm"></div>
                <div className="absolute -left-[2px] top-[38%] w-[2px] h-[10%] bg-gradient-to-r from-[#4a4a4c] to-[#3a3a3c] rounded-l-sm"></div>

                {/* Side Button (Right - Power) */}
                <div className="absolute -right-[2px] top-[28%] w-[2px] h-[14%] bg-gradient-to-l from-[#4a4a4c] to-[#3a3a3c] rounded-r-sm"></div>

                {/* Screen Bezel */}
                <div className="w-full h-full rounded-[2.2rem] bg-black overflow-hidden relative">

                    {/* DYNAMIC ISLAND */}
                    <div className="absolute top-[8px] left-1/2 -translate-x-1/2 z-30">
                        <div
                            className="relative w-[70px] h-[22px] bg-black rounded-full flex items-center justify-between px-2"
                            style={{
                                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)'
                            }}
                        >
                            {/* Front Camera */}
                            <div className="relative w-[7px] h-[7px]">
                                <div className="absolute inset-0 bg-[#1a1a2e] rounded-full"></div>
                                <div className="absolute inset-[1.5px] bg-[#0d0d14] rounded-full"></div>
                                <div className="absolute top-[2px] left-[2px] w-[1.5px] h-[1.5px] bg-blue-400/30 rounded-full"></div>
                            </div>
                            {/* Sensors */}
                            <div className="flex gap-1">
                                <div className="w-[4px] h-[4px] bg-[#0f0f12] rounded-full opacity-60"></div>
                                <div className="w-[2px] h-[2px] bg-[#1a1a1f] rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* STATUS BAR - iOS Style */}
                    <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-4 pt-[10px] h-[34px]">
                        {/* Left: Time */}
                        <div className="text-white text-[11px] font-semibold" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
                            {currentTime || '9:41'}
                        </div>

                        {/* Right: Status Icons */}
                        <div className="flex items-center gap-[3px]">
                            {/* Signal Bars */}
                            <div className="flex items-end gap-[1px] h-[9px]">
                                <div className="w-[2px] h-[3px] bg-white rounded-[0.5px]"></div>
                                <div className="w-[2px] h-[5px] bg-white rounded-[0.5px]"></div>
                                <div className="w-[2px] h-[6px] bg-white rounded-[0.5px]"></div>
                                <div className="w-[2px] h-[8px] bg-white rounded-[0.5px]"></div>
                            </div>

                            {/* WiFi Icon */}
                            <svg className="w-[11px] h-[8px] text-white ml-0.5" viewBox="0 0 16 12" fill="currentColor">
                                <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM8 6c-2.2 0-4.2.9-5.7 2.3l1.4 1.4C4.9 8.6 6.4 8 8 8s3.1.6 4.3 1.7l1.4-1.4C12.2 6.9 10.2 6 8 6zm0-4C4.5 2 1.3 3.4-.7 5.7l1.4 1.4C2.5 5.5 5.1 4.5 8 4.5s5.5 1 7.3 2.6l1.4-1.4C14.7 3.4 11.5 2 8 2z" />
                            </svg>

                            {/* Battery */}
                            <div className="flex items-center gap-[1px] ml-0.5">
                                <div className="relative w-[16px] h-[8px] border border-white/40 rounded-[2px] flex items-center p-[1px]">
                                    <div className="h-full w-[85%] bg-white rounded-[1px]"></div>
                                </div>
                                <div className="w-[1px] h-[3px] bg-white/40 rounded-r-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Screen Content */}
                    <div className="absolute inset-0 pt-[34px] overflow-hidden">
                        {children}
                    </div>

                    {/* Screen Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
                </div>
            </div>


        </div>
    );
};

export default IPhone17Frame;
