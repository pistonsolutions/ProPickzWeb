export interface Review {
    id: string;
    user: string;
    verified: boolean;
    avatarLetter: string;
    avatarColor: string; // formatting: e.g. "bg-blue-500" or hex
    rating: number; // 1-5
    content: string;
    highlight?: boolean; // specialized styling for top reviews
}

export const reviews: Review[] = [
    {
        id: "1",
        user: "Discord User #8821",
        verified: true,
        avatarLetter: "A",
        avatarColor: "from-purple-500 to-blue-500",
        rating: 5,
        content: "Just cashed another big win thanks to the NBA prop tool. This subscription pays for itself literally every single week."
    },
    {
        id: "2",
        user: "Discord User #4192",
        verified: true,
        avatarLetter: "B",
        avatarColor: "from-blue-500 to-cyan-500",
        rating: 5,
        content: "I was skeptical at first but the math doesn't lie. Up 15 units this month alone. Best investment I've made."
    },
    {
        id: "3",
        user: "Discord User #9931",
        verified: true,
        avatarLetter: "C",
        avatarColor: "from-green-500 to-emerald-500",
        rating: 5,
        content: "Small bankroll but growing steady. The unit sizing guide changed everything for me. No more blowing accounts."
    },
    {
        id: "4",
        user: "Discord User #2210",
        verified: true,
        avatarLetter: "D",
        avatarColor: "from-red-500 to-orange-500",
        rating: 5,
        content: "Hit a massive parlay yesterday! The +EV plays are insane. Love the community here."
    },
    {
        id: "5",
        user: "Discord User #5543",
        verified: true,
        avatarLetter: "E",
        avatarColor: "from-yellow-500 to-amber-500",
        rating: 5,
        content: "Finally a discord that actually tracks results. Transparency is key and these guys have it."
    },
    {
        id: "6",
        user: "Discord User #7789",
        verified: true,
        avatarLetter: "F",
        avatarColor: "from-pink-500 to-rose-500",
        rating: 5,
        content: "Slow and steady wins the race. Consistent profits > lottery tickets. Thanks Propickz!"
    },
    {
        id: "7",
        user: "Discord User #3321",
        verified: true,
        avatarLetter: "G",
        avatarColor: "from-indigo-500 to-violet-500",
        rating: 5,
        content: "My ROI has never been higher. The tools are super easy to use and the picks are solid."
    },
    {
        id: "8",
        user: "Discord User #6654",
        verified: true,
        avatarLetter: "H",
        avatarColor: "from-gray-500 to-slate-500",
        rating: 5,
        content: "Customer support is top notch. Had a question about bankroll management and they helped me out immediately."
    }
];
