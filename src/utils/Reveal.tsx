import React, { useEffect, useRef, useState } from 'react';

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => window.innerWidth < 768;
        setIsMobile(checkMobile());

        // Use IntersectionObserver for both mobile and desktop
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, {
            threshold: 0.1,
            rootMargin: '20px'
        });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // Mobile: Fast drop-down animation (300ms, no delay)
    // Desktop: Slower smooth animation with optional delay
    const mobileDelay = Math.min(delay, 100); // Cap delay at 100ms on mobile

    return (
        <div
            ref={ref}
            className={`${className} transition-all transform ${isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
                }`}
            style={{
                transitionDuration: isMobile ? '300ms' : '700ms',
                transitionDelay: isMobile ? `${mobileDelay}ms` : `${delay}ms`,
                transitionTimingFunction: 'ease-out'
            }}
        >
            {children}
        </div>
    );
};

// Memoize to prevent unnecessary re-renders
const MemoizedReveal = React.memo(Reveal);

export { MemoizedReveal as Reveal };
