import React, { useEffect, useRef, useState } from 'react';

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Simple check to skip observer on mobile to save resources
        // relying on CSS for the visual 'always visible' state
        if (window.innerWidth < 768) {
            setIsVisible(true);
            return;
        }

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

    // On mobile, we want NO transition delay so it feels instant
    // We can't easily do conditional inline styles with media queries, 
    // but the delay typically only matters when the transition is happening.
    // Since mobile starts visible, the transition won't trigger ideally.

    return (
        <div
            ref={ref}
            className={`${className} transition-all duration-700 ease-out transform ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-100 translate-y-0 md:opacity-0 md:translate-y-12' // Mobile: Always visible. Desktop: Hidden initially
                }`}
            style={{
                transitionDelay: window.innerWidth >= 768 ? `${delay}ms` : '0ms'
            }}
        >
            {children}
        </div>
    );
};

// Memoize to prevent unnecessary re-renders
const MemoizedReveal = React.memo(Reveal);

export { MemoizedReveal as Reveal };
