'use client'; // Ensures Next.js compatibility

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import {
  TrendingUp, CheckCircle, Smartphone,
  Menu, X, ChevronDown, MessageSquare, Send,
  Zap, DollarSign, ArrowUpRight, Play, Users, Star, Sparkles
} from 'lucide-react';

// Firebase Imports
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// --- TYPES ---
interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface FomoData {
  name: string;
  action: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface ProfitGraphProps {
  bankroll: number;
}

interface NavbarProps {
  setView: (view: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

interface HomePageProps {
  navigateTo: (view: string) => void;
}

// --- GEMINI API CONFIGURATION ---
const apiKey: string = ""; // Set API Key via environment variable in production

const callGeminiAPI = async (prompt: string, systemInstruction: string = ""): Promise<string> => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return "I'm offline right now (Missing API Key).";
  }


  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
  } catch (error) {
    console.error("Gemini API Call Failed:", error);
    return "Sorry, I couldn't process that request right now.";
  }
};

// --- HOOKS ---

// Hook to detect when an element enters the viewport
const useOnScreen = (ref: React.RefObject<HTMLElement | null>) => {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIntersecting(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return isIntersecting;
};

// Hook to track mouse position for 3D parallax effects
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    // Check for window existence to support SSR (Next.js)
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', updateMousePosition);
      return () => window.removeEventListener('mousemove', updateMousePosition);
    }
  }, []);
  return mousePosition;
};

// Hook to animate numbers counting up
const useCountUp = (end: number, duration: number = 2000, start: number = 0): [React.RefObject<HTMLDivElement | null>, number] => {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (onScreen && !hasAnimated) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        setCount(start + ease * (end - start));
        if (progress < 1) window.requestAnimationFrame(step);
        else setHasAnimated(true);
      };
      window.requestAnimationFrame(step);
    }
  }, [onScreen, end, duration, start, hasAnimated]);

  return [ref, count];
};

// --- FIREBASE SERVICE ---

// Define global variable types if they are injected by the environment
declare global {
  interface Window {
    __firebase_config?: string;
    __initial_auth_token?: string;
  }
}

// Check if window is defined to avoid SSR errors
const firebaseConfigStr = typeof window !== 'undefined' && window.__firebase_config ? window.__firebase_config : '{}';
const firebaseConfig = JSON.parse(firebaseConfigStr);

const initFirebase = (): Promise<{ db: Firestore | null; auth: Auth | null; userId: string | null }> => {
  try {
    const app: FirebaseApp = initializeApp(firebaseConfig);
    const auth: Auth = getAuth(app);
    const db: Firestore = getFirestore(app);
    return new Promise((resolve) => {
      const token = typeof window !== 'undefined' ? window.__initial_auth_token : null;

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          resolve({ db, auth, userId: user.uid });
        } else if (token) {
          await signInWithCustomToken(auth, token);
        } else {
          const anon = await signInAnonymously(auth);
          resolve({ db, auth, userId: anon.user.uid });
        }
      });
    });
  } catch (e) {
    console.error("Firebase init error", e);
    return Promise.resolve({ db: null, auth: null, userId: null });
  }
};

// --- COMPONENTS ---

const LiveTicker: React.FC = () => (
  <div className="bg-purple-900/30 border-b border-purple-500/20 backdrop-blur-sm overflow-hidden py-2 flex relative z-50">
    <div className="animate-marquee whitespace-nowrap flex gap-8 items-center">
      {[...Array(10)].map((_, i) => (
        <React.Fragment key={i}>
          <span className="text-purple-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle size={12} className="text-green-400" /> J_Doe just won $450 on NBA Props
          </span>
          <span className="text-purple-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle size={12} className="text-green-400" /> MikeT hit a +1200 Parlay
          </span>
          <span className="text-purple-300 text-xs font-mono flex items-center gap-2">
            <Users size={12} className="text-blue-400" /> New Member Joined Discord
          </span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

const ProfitGraph: React.FC<ProfitGraphProps> = ({ bankroll }) => {
  const points: string[] = [];
  const width = 300;
  const height = 100;
  const months = 12;

  for (let i = 0; i <= months; i++) {
    const x = (i / months) * width;
    const growth = bankroll * Math.pow(1.15, i);
    const y = height - Math.min((growth / (bankroll * 5)) * height, height - 5);
    points.push(`${x},${y}`);
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
      <defs>
        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#9333ea" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,${height} ${points.map(p => `L${p}`).join(' ')} L${width},${height} Z`}
        fill="url(#gradient)"
      />
      <path
        d={`M0,${height} ${points.map(p => `L${p}`).join(' ')}`}
        fill="none"
        stroke="#a855f7"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx={width} cy={parseFloat(points[months].split(',')[1])} r="4" fill="white" className="animate-pulse" />
    </svg>
  );
};

const ROICalculator: React.FC = () => {
  const [bankroll, setBankroll] = useState<number>(1000);
  const profit = (bankroll * 0.35).toFixed(0);
  const yearly = (bankroll * 0.35 * 12).toFixed(0);

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all duration-500"></div>

      <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Potential Earnings Calculator</h3>
      <p className="text-gray-400 mb-8 text-sm relative z-10">See what happens when you follow our system.</p>

      <div className="mb-6 relative z-10">
        <div className="flex justify-between text-gray-400 mb-2 font-mono text-xs uppercase tracking-widest">
          <span>Starting Bankroll</span>
          <span className="text-purple-400 font-bold">${bankroll.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="100"
          max="10000"
          step="100"
          value={bankroll}
          onChange={(e) => setBankroll(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>$100</span>
          <span>$10,000+</span>
        </div>
      </div>

      <div className="mb-6 relative z-10">
        <ProfitGraph bankroll={bankroll} />
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-black/50 p-4 rounded-xl border border-gray-800">
          <div className="text-gray-500 text-xs font-bold uppercase mb-1">Monthly Profit</div>
          <div className="text-3xl font-bold text-green-400 animate-pulse-slow">${parseInt(profit).toLocaleString()}</div>
        </div>
        <div className="bg-black/50 p-4 rounded-xl border border-gray-800">
          <div className="text-gray-500 text-xs font-bold uppercase mb-1">Yearly Potential</div>
          <div className="text-3xl font-bold text-white">${parseInt(yearly).toLocaleString()}</div>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-4 italic text-center">*Based on average member performance. Results vary.</p>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs: FaqItem[] = [
    { q: "Is this guaranteed profit?", a: "No investment is 100% guaranteed. However, our +EV system is mathematically proven to generate profit over a large sample size of bets (300+)." },
    { q: "Do I need a large bankroll?", a: "Not at all. We recommend starting with at least $200 so you can follow our unit sizing correctly. The calculator above shows how small starts can grow." },
    { q: "Can I cancel my subscription?", a: "Yes, you can cancel anytime from your dashboard. If you're on the free trial, you won't be charged if you cancel before day 7." },
    { q: "Which sportsbooks do I need?", a: "We recommend having accounts with at least 3 major books (DraftKings, FanDuel, MGM) to ensure you can always get the best odds (line shopping)." }
  ];

  return (
    <section className="py-20 bg-black border-t border-gray-900">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className="text-white font-medium">{faq.q}</span>
                <ChevronDown className={`text-purple-500 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <div className={`px-6 text-gray-400 text-sm overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FomoNotification: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<FomoData>({ name: '', action: '' });

  const names = ['Alex M.', 'Sarah K.', 'Davon J.', 'Mike R.', 'Chris P.'];
  const actions = ['just started a Free Trial', 'hit a 5-leg parlay', 'upgraded to Lifetime', 'won $1,200 today'];

  useEffect(() => {
    const trigger = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setData({ name: randomName, action: randomAction });
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };

    const interval = setInterval(trigger, 8000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-4 md:left-8 z-50 bg-white dark:bg-gray-900 border border-purple-500/30 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-in-left max-w-sm">
      <div className="bg-green-500/20 p-2 rounded-full">
        <DollarSign size={20} className="text-green-500" />
      </div>
      <div>
        <div className="text-sm font-bold text-gray-900 dark:text-white">{data.name}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{data.action}</div>
      </div>
      <div className="text-xs text-gray-400 ml-auto">Just now</div>
    </div>
  );
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ text: "Hi! I'm the ProPickz AI Analyst. Ask me about bankroll management or +EV strategies!", sender: 'bot' }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput("");
    setIsTyping(true);

    const systemPrompt = "Expert sports betting analyst tone.";
    const aiResponse = await callGeminiAPI(userMessage, systemPrompt);

    setIsTyping(false);
    setMessages(prev => [...prev, { text: aiResponse, sender: 'bot' }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl mb-4 w-80 sm:w-96 overflow-hidden animate-fade-in-up flex flex-col h-96">
          <div className="bg-purple-600 p-4 flex justify-between items-center shrink-0">
            <span className="text-white font-bold flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-300" />
              ProPickz AI Analyst
            </span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-purple-700 rounded-full p-1"><X size={16} /></button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 dark:bg-black/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${m.sender === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-200 text-black dark:bg-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-xl rounded-bl-none flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2 shrink-0">
            <input
              className="flex-1 bg-transparent text-sm p-2 outline-none text-black dark:text-white"
              placeholder="Ask about betting strategy..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="text-purple-600 p-2 hover:bg-purple-100 dark:hover:bg-gray-800 rounded-full transition-colors" disabled={isTyping}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:animate-pulse" />}
      </button>
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({ setView, mobileMenuOpen, setMobileMenuOpen }) => {
  const navItems = ['Results', 'Pricing', 'Guarantee', 'Login'];

  return (
    <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('Home')}>
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.5)]">
            <TrendingUp className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">propickz</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button key={item} onClick={() => setView(item === 'Results' ? 'Home' : item)} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              {item}
            </button>
          ))}
          <button className="px-6 py-2.5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Get Started
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-black border-t border-gray-900 py-12 text-center text-gray-600 text-sm">
    <p>&copy; 2025 ProPickz Inc. All rights reserved. <br /> This is not gambling advice. Please bet responsibly.</p>
  </footer>
);

// --- 4. HOMEPAGE COMPONENT ---

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  const { x, y } = useMousePosition();
  // Default values for SSR/Initial render
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

  const rotateX = ((y - centerY) / 50).toFixed(2);
  const rotateY = ((x - centerX) / 50).toFixed(2);

  const [unitsRef, unitsVal] = useCountUp(214.5, 2000);
  const [membersRef, membersVal] = useCountUp(1250, 2000);

  const [aiTip, setAiTip] = useState("");
  const [loadingTip, setLoadingTip] = useState(false);

  const generateAiTip = async () => {
    setLoadingTip(true);
    const prompt = "Short, punchy betting advice about discipline. Max 2 sentences.";
    const tip = await callGeminiAPI(prompt);
    setAiTip(tip);
    setLoadingTip(false);
  };

  return (
    <div className="overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          {/* Left: Copy & CTA */}
          <div className="text-left space-y-8 pt-10 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/50 text-purple-300 text-xs font-bold uppercase tracking-widest animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Live & Tracking
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tight animate-fade-in-up delay-100">
              STOP<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 glitch-text">GAMBLING.</span><br />
              START<br />
              INVESTING.
            </h1>

            <p className="text-xl text-gray-400 max-w-lg leading-relaxed animate-fade-in-up delay-200">
              Join the <span className="text-white font-bold">top 1% of bettors</span> who treat sports betting as a math problem, not a guessing game. Guaranteed profit in 30 days or we pay you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <button
                onClick={() => navigateTo('Pricing')}
                className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group"
              >
                Start Free Trial <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button
                onClick={() => navigateTo('Pricing')}
                className="px-8 py-4 bg-transparent border border-gray-700 text-white rounded-full font-bold text-lg hover:bg-gray-900 hover:border-white transition-all flex items-center justify-center gap-2"
              >
                <Play size={20} fill="currentColor" /> Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 animate-fade-in-up delay-500">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-xs font-bold text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p><span className="text-white font-bold">2,400+</span> members winning daily.</p>
            </div>
          </div>

          {/* Right: 3D Interactive Hero */}
          <div className="relative hidden lg:block perspective-1000">
            <div
              className="relative z-20 transition-transform duration-100 ease-out will-change-transform"
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${parseFloat(rotateY) * -1}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              <img
                src="https://cdn.prod.website-files.com/683c64c4aa0f10093bc3ddc1/683f4baf9511918153fe3405_Phone%20exports-p-1080.png"
                alt="Dashboard"
                className="w-full max-w-md mx-auto drop-shadow-2xl"
              />

              {/* Floating Elements */}
              <div className="absolute top-20 -left-10 bg-black/80 backdrop-blur-md border border-purple-500/50 p-4 rounded-xl shadow-2xl animate-float" style={{ transform: 'translateZ(40px)' }}>
                <div className="text-gray-400 text-xs font-bold uppercase mb-1">Current Streak</div>
                <div className="text-green-400 font-mono text-2xl font-bold flex items-center gap-2">
                  <TrendingUp size={20} /> 7 WINS
                </div>
              </div>

              <div className="absolute bottom-40 -right-5 bg-black/80 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-2xl animate-float delay-700" style={{ transform: 'translateZ(60px)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">VP</div>
                  <div>
                    <div className="text-white text-sm font-bold">New Pick Posted</div>
                    <div className="text-gray-400 text-xs">NBA • Lakers Moneyline</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM/SOLUTION */}
      <section className="py-24 bg-black relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Most Bettors Are <span className="text-red-500">Guessing.</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The sportsbooks hire PhD mathematicians to take your money.
              Trying to beat them with "gut feeling" is financial suicide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl hover:border-red-500/50 transition-colors group">
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <X size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The "Fan" Approach</h3>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li className="flex gap-2"><X size={16} /> Bets on favorite teams</li>
                <li className="flex gap-2"><X size={16} /> Chases losses aggressively</li>
                <li className="flex gap-2"><X size={16} /> Zero bankroll management</li>
                <li className="mt-4 pt-4 border-t border-gray-800 text-red-400 font-bold">Result: Broke in 2 months.</li>
              </ul>
            </div>

            <div className="bg-purple-900/20 border border-purple-500 p-8 rounded-3xl transform md:-translate-y-6 shadow-2xl shadow-purple-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">YOU</div>
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-600/50">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">The ProPickz System</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex gap-2"><CheckCircle size={16} className="text-green-400" /> Math-based +EV edges</li>
                <li className="flex gap-2"><CheckCircle size={16} className="text-green-400" /> Strict unit sizing (1-3%)</li>
                <li className="flex gap-2"><CheckCircle size={16} className="text-green-400" /> Emotionless execution</li>
                <li className="mt-4 pt-4 border-t border-purple-500/30 text-green-400 font-bold text-lg">Result: Consistent Income.</li>
              </ul>

              {/* GEMINI INTEGRATION: MINDSET TIP */}
              <div className="mt-6 p-4 bg-purple-950/50 rounded-xl border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} /> AI Mindset Coach
                  </span>
                </div>
                <p className="text-sm text-gray-300 min-h-[40px]">
                  {loadingTip ? "Analyzing market..." : (aiTip || "Discipline is the bridge between goals and accomplishment. Stay sharp.")}
                </p>
                <button
                  onClick={generateAiTip}
                  disabled={loadingTip}
                  className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loadingTip ? "Generating..." : "✨ Generate Daily Discipline Tip"}
                </button>
              </div>

            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The "Tout" Scam</h3>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li className="flex gap-2"><X size={16} /> Deletes losing picks</li>
                <li className="flex gap-2"><X size={16} /> "Whale play of the century"</li>
                <li className="flex gap-2"><X size={16} /> No verified tracking</li>
                <li className="mt-4 pt-4 border-t border-gray-800 text-gray-400 font-bold">Result: Scammed.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE CALCULATOR */}
      <section className="py-24 bg-gradient-to-b from-black to-purple-900/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-purple-900/30 text-purple-300 font-bold text-sm mb-6 border border-purple-500/30">
              DATA DOESN'T LIE
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Calculate Your <br />Financial Freedom.</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Stop wondering "what if". Use our calculator to see the compounding power of consistent, disciplined betting using the ProPickz strategy.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="text-4xl font-bold text-white mb-1" ref={unitsRef}>+{unitsVal.toFixed(1)}u</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest">Profit YTD</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1" ref={membersRef}>{membersVal.toFixed(0)}+</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest">Active Members</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <ROICalculator />
          </div>
        </div>
      </section>

      {/* 4. SOCIAL PROOF WALL */}
      <section className="py-20 bg-black border-y border-gray-900">
        <h3 className="text-center text-2xl font-bold text-white mb-12">Join the Winning Side</h3>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-80 p-6 bg-gray-900 rounded-2xl border border-gray-800 flex-shrink-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-white font-bold text-sm">Discord User #{3920 + i}</div>
                    <div className="text-gray-500 text-xs">Verified Member</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">"Just cashed another $500 thanks to the NBA prop tool. This subscription pays for itself literally every single week."</p>
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-yellow-500 fill-yellow-500" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING */}
      <section className="py-24 bg-black relative" id="pricing">
        <div className="absolute inset-0 bg-purple-900/10 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Invest in Yourself.</h2>
            <p className="text-xl text-gray-400">Prices increase next month as we limit Discord capacity.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly */}
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-3xl p-8 hover:bg-gray-900 transition-colors">
              <h3 className="text-xl font-bold text-white mb-2">Monthly Access</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$39</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Daily +EV Picks</li>
                <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Bankroll Management Guide</li>
                <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> 24/7 Support</li>
              </ul>
              <button className="w-full py-4 border border-purple-500 text-purple-400 font-bold rounded-xl hover:bg-purple-500/10 transition-colors">Select Monthly</button>
            </div>

            {/* Yearly */}
            <div className="bg-black border border-purple-500 rounded-3xl p-8 relative shadow-2xl shadow-purple-900/50 transform md:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                Best Value
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Yearly Pro</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">$349</span>
                <span className="text-gray-500">/yr</span>
              </div>
              <p className="text-green-400 text-sm font-bold mb-6">Save $120 instantly</p>

              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> Everything in Monthly</li>
                <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> Priority Discord Access</li>
                <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> 1-on-1 Strategy Call</li>
              </ul>
              <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.4)]">Start Free 7-Day Trial</button>
              <p className="text-center text-gray-500 text-xs mt-4">No charge until day 7. Cancel anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (NEW) */}
      <FAQSection />
    </div>
  );
};

// --- 5. MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [view, setView] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    initFirebase();
  }, []);

  const renderView = () => {
    switch (view) {
      case 'Home': return <HomePage navigateTo={setView} />;
      default: return <div className="p-20 text-center text-white bg-black min-h-screen">Placeholder for {view}</div>;
    }
  };

  return (
    <div className="bg-black min-h-screen font-sans text-gray-100 selection:bg-purple-500 selection:text-white">
      <LiveTicker />
      <Navbar setView={setView} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main>
        {renderView()}
      </main>
      <FomoNotification />
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default App;
