import React from 'react';

import { Star } from 'lucide-react';

const reviews = [
    {
        id: 1,
        username: "Discord User #2210",
        avatar: "D",
        avatarColor: "bg-orange-500",
        review: "Hit a massive parlay yesterday! The +EV plays are insane. Love the community here.",
        rating: 5
    },
    {
        id: 2,
        username: "Discord User #5543",
        avatar: "D",
        avatarColor: "bg-green-500",
        review: "Finally a discord that actually tracks results. Transparency is key and these guys have it.",
        rating: 5
    },
    {
        id: 3,
        username: "Discord User #7789",
        avatar: "D",
        avatarColor: "bg-pink-500",
        review: "Slow and steady wins the race. Consistent profits → lottery tickets. Thanks Propickz!",
        rating: 5
    },
    {
        id: 4,
        username: "Discord User #1122",
        avatar: "D",
        avatarColor: "bg-blue-500",
        review: "Best investment I've made. The hybrid model picks are next level accurate.",
        rating: 5
    },
    {
        id: 5,
        username: "Discord User #8834",
        avatar: "D",
        avatarColor: "bg-purple-500",
        review: "Up 15 units this month. The data-driven approach actually works!",
        rating: 5
    }
];

const AsSeenOn: React.FC = () => {


    return (
        <div className="py-12 bg-black border-y border-gray-900 overflow-hidden relative">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest font-heading mb-4">
                    Community Verified
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white">
                    Join the <span className="text-purple-400">Winning Side</span>
                </h2>
            </div>

            {/* Rotating Reviews Carousel */}
            <div className="relative flex overflow-hidden group">
                <div className="flex animate-marquee-slow whitespace-nowrap gap-6 items-stretch hover:[animation-play-state:paused] will-change-transform">
                    {/* First Set */}
                    {reviews.map((review) => (
                        <div
                            key={`a-${review.id}`}
                            className="w-[240px] md:w-[280px] flex-shrink-0 bg-[#0f1014] border border-gray-800 rounded-2xl p-4 md:p-5 hover:border-purple-500/30 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                                    {review.avatar}
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">{review.username}</div>
                                    <div className="text-gray-500 text-xs">Verified Member</div>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm whitespace-normal mb-3 leading-relaxed">"{review.review}"</p>
                            <div className="flex gap-0.5">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Duplicate Set */}
                    {reviews.map((review) => (
                        <div
                            key={`b-${review.id}`}
                            className="w-[240px] md:w-[280px] flex-shrink-0 bg-[#0f1014] border border-gray-800 rounded-2xl p-4 md:p-5 hover:border-purple-500/30 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                                    {review.avatar}
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">{review.username}</div>
                                    <div className="text-gray-500 text-xs">Verified Member</div>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm whitespace-normal mb-3 leading-relaxed">"{review.review}"</p>
                            <div className="flex gap-0.5">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Triplicate Set */}
                    {reviews.map((review) => (
                        <div
                            key={`c-${review.id}`}
                            className="w-[240px] md:w-[280px] flex-shrink-0 bg-[#0f1014] border border-gray-800 rounded-2xl p-4 md:p-5 hover:border-purple-500/30 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                                    {review.avatar}
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">{review.username}</div>
                                    <div className="text-gray-500 text-xs">Verified Member</div>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm whitespace-normal mb-3 leading-relaxed">"{review.review}"</p>
                            <div className="flex gap-0.5">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Fade Masks */}
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10"></div>
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10"></div>
            </div>
        </div>
    );
};

export default AsSeenOn;
