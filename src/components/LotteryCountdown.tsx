import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const LotteryCountdown: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Calculate the next draw date (every 7 days from a fixed start date)
    const getNextDrawDate = (): Date => {
        // Set a fixed start date (e.g., January 27, 2026 at midnight UTC)
        const startDate = new Date('2026-01-27T00:00:00Z');
        const now = new Date();

        // Calculate milliseconds in 7 days
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

        // Calculate how many 7-day periods have passed since start date
        const timeSinceStart = now.getTime() - startDate.getTime();
        const periodsPassed = Math.floor(timeSinceStart / sevenDaysMs);

        // Calculate the next draw date
        const nextDrawDate = new Date(startDate.getTime() + ((periodsPassed + 1) * sevenDaysMs));

        return nextDrawDate;
    };

    useEffect(() => {
        const calculateTimeLeft = () => {
            const nextDraw = getNextDrawDate();
            const now = new Date();
            const difference = nextDraw.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                // If we've passed the draw time, recalculate for the next one
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        // Calculate immediately
        calculateTimeLeft();

        // Update every second
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatNumber = (num: number): string => {
        return num.toString().padStart(2, '0');
    };

    return (
        <span className="text-yellow-400 font-bold flex items-center gap-2">
            <Clock size={16} />
            <span className="font-mono">
                {timeLeft.days > 0 && `${timeLeft.days}d `}
                {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
            </span>
        </span>
    );
};

export default LotteryCountdown;
