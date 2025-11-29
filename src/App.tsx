'use client'; // Ensures Next.js compatibility

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import {
  TrendingUp, CheckCircle, Smartphone,
  Menu, X, ChevronDown, MessageSquare, Send,
  Zap, ArrowUpRight, Play, Star, Sparkles, BookOpen, HelpCircle, Trophy, Flame, Target, Award, Disc, Dribbble
} from 'lucide-react';

// Firebase Imports
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import propickzLogo from './assets/propickzlogo.png';

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

// Component for scroll reveal animations
const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={`${className} ${onScreen ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10 transition-all duration-700'}`}
    >
      {children}
    </div>
  );
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

    const interval = setInterval(trigger, 30000 + Math.random() * 15000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-4 md:left-8 z-50 bg-white dark:bg-gray-900 border border-purple-500/30 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-in-left max-w-sm">
      <div className="bg-black p-2 rounded-full border border-gray-800">
        <img src={propickzLogo} alt="ProPickz" className="w-6 h-6 object-contain" />
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navGroups = {
    Platform: [
      { name: 'Home', action: () => setView('Home'), icon: <TrendingUp size={16} /> },
      { name: 'Results', action: () => setView('Results'), icon: <CheckCircle size={16} /> },
      { name: 'How It Works', action: () => setView('HowItWorks'), icon: <Zap size={16} /> },
      { name: 'Supported Sports', action: () => setView('SupportedSports'), icon: <Trophy size={16} /> },
    ],
    Membership: [
      { name: 'Pricing', action: () => setView('Pricing'), icon: <Star size={16} /> },
      { name: 'Guarantee', action: () => setView('Guarantee'), icon: <Sparkles size={16} /> },
    ],
    Resources: [
      { name: 'Betting Academy', action: () => setView('BettingAcademy'), icon: <BookOpen size={16} /> },
      { name: 'FAQ', action: () => setView('FAQ'), icon: <HelpCircle size={16} /> },
      { name: 'Legal', action: () => setView('Legal'), icon: <MessageSquare size={16} /> },
    ]
  };

  return (
    <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-gray-800" onMouseLeave={() => setActiveDropdown(null)}>
      <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">

        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('Home')}>
            <img src={propickzLogo} alt="ProPickz" className="h-24 w-auto object-contain" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {Object.entries(navGroups).map(([group, items]) => (
              <div
                key={group}
                className="relative"
                onMouseEnter={() => setActiveDropdown(group)}
              >
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-1 transition-colors ${activeDropdown === group ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                >
                  {group}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === group ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === group && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up z-50">
                    <div className="p-2 space-y-1">
                      {items.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            item.action();
                            setActiveDropdown(null);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-left group"
                        >
                          <span className="text-gray-500 group-hover:text-purple-400 transition-colors">{item.icon}</span>
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => window.open('https://www.winible.com/propickz', '_blank')} className="px-5 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
              <span className="text-red-500 shake-text">GAMBLING.</span><br />
              START<br />
              <span className="text-green-500">INVESTING.</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-lg leading-relaxed animate-fade-in-up delay-200">
              Join the <span className="text-white font-bold">top 1% of bettors</span> who treat sports betting as a math problem, not a guessing game. Guaranteed profit in 30 days or we pay you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <button
                onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
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

            <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl hover:border-red-500/50 transition-colors group">
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
            {[...Array(2)].map((_, setIndex) => (
              <React.Fragment key={setIndex}>
                {[
                  { user: "Discord User #8821", amount: 450, msg: "Just cashed another big win thanks to the NBA prop tool. This subscription pays for itself literally every single week." },
                  { user: "Discord User #4192", amount: 1200, msg: "I was skeptical at first but the math doesn't lie. Up 15 units this month alone. Best investment I've made." },
                  { user: "Discord User #9931", amount: 85, msg: "Small bankroll but growing steady. The unit sizing guide changed everything for me. No more blowing accounts." },
                  { user: "Discord User #2210", amount: 2100, msg: "Hit a massive parlay yesterday! The +EV plays are insane. Love the community here." },
                  { user: "Discord User #5543", amount: 320, msg: "Finally a discord that actually tracks results. Transparency is key and these guys have it." },
                  { user: "Discord User #7789", amount: 150, msg: "Slow and steady wins the race. Consistent profits > lottery tickets. Thanks ProPickz!" },
                  { user: "Discord User #3321", amount: 940, msg: "My ROI has never been higher. The tools are super easy to use and the picks are solid." },
                  { user: "Discord User #6654", amount: 580, msg: "Customer support is top notch. Had a question about bankroll management and they helped me out immediately." }
                ].map((testimonial, i) => (
                  <div key={`${setIndex}-${i}`} className="w-80 p-6 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 flex-shrink-0 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{testimonial.user}</div>
                        <div className="text-gray-500 text-xs">Verified Member</div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-normal">"{testimonial.msg.replace('another big win', `another $${testimonial.amount}`)}"</p>
                    <div className="mt-4 flex gap-1">
                      {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-yellow-500 fill-yellow-500" />)}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING */}
      <section className="py-24 bg-black relative" id="pricing">
        <div className="absolute inset-0 bg-purple-900/10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Invest in Yourself.</h2>
            <p className="text-xl text-gray-400">Prices increase next month as we limit Discord capacity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Monthly */}
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-3xl p-8 hover:bg-gray-900 transition-colors flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">Monthly</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$39.99</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Daily bet recommendations for all sports</li>
                <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Full Discord lounge access</li>
                <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> +EV and Arbitrage</li>
                <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Access to results, streaks, and units</li>
                <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Betting basics & bankroll tools</li>
              </ul>
              <button onClick={() => window.open('https://www.winible.com/propickz', '_blank')} className="w-full py-4 bg-purple-600/20 border border-purple-500 text-purple-300 font-bold rounded-xl hover:bg-purple-600 hover:text-white transition-all">Start Monthly Access</button>
            </div>

            {/* Yearly */}
            <div className="bg-black border border-purple-500 rounded-3xl p-8 relative shadow-2xl shadow-purple-900/50 transform md:scale-105 z-10 flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Yearly</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">$349</span>
                <span className="text-gray-500">/yr</span>
              </div>
              <p className="text-green-400 text-sm font-bold mb-6">Just $29.08/mo equivalent</p>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> 12 Months of full access</li>
                <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> Save $130 vs monthly billing</li>
                <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> Includes private breakdown threads</li>
                <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> Beta invites to new data tools</li>
                <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> Priority role in Discord</li>
                <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> Locked-in price - keep your rate</li>
              </ul>
              <button onClick={() => window.open('https://www.winible.com/propickz', '_blank')} className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.4)]">Go Yearly - Lock In Value</button>
            </div>

            {/* Lifetime */}
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-3xl p-8 hover:bg-gray-900 transition-colors flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">Lifetime</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$699</span>
                <span className="text-gray-500">/once</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Unlimited lifetime access</li>
                <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> VIP label in Discord</li>
                <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Access to long-term models</li>
                <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Founding member distinction</li>
                <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> No recurring charges - ever</li>
              </ul>
              <button onClick={() => window.open('https://www.winible.com/propickz', '_blank')} className="w-full py-4 bg-purple-600/20 border border-purple-500 text-purple-300 font-bold rounded-xl hover:bg-purple-600 hover:text-white transition-all">Claim Lifetime Access</button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (NEW) */}
      <FAQSection />
    </div>
  );
};

// --- 5. PRICING PAGE COMPONENT ---

const PricingPage: React.FC = () => {
  const [capacity, setCapacity] = useState(0);

  useEffect(() => {
    // Animate capacity bar on mount
    setTimeout(() => setCapacity(87), 500);
  }, []);

  return (
    <div className="min-h-screen bg-black pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Invest in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Yourself.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Professional sports betting tools, daily +EV picks, and a community of winners.
          </p>

          {/* Progress Indicator / FOMO */}
          <div className="max-w-md mx-auto bg-gray-900 rounded-full h-4 relative overflow-hidden border border-gray-800">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000 ease-out"
              style={{ width: `${capacity}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs font-mono text-gray-500 mt-2 max-w-md mx-auto">
            <span>Discord Capacity</span>
            <span className="text-green-400 font-bold">{capacity}% Full</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Monthly */}
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-3xl p-8 hover:bg-gray-900 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/20 flex flex-col animate-fade-in-up delay-100 group">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Monthly</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">$39.99</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Daily bet recommendations</li>
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Full Discord lounge access</li>
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> +EV and Arbitrage tools</li>
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Results & unit tracking</li>
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Bankroll management guide</li>
            </ul>
            <button
              onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
              className="w-full py-4 bg-purple-600/10 border border-purple-500/50 text-purple-300 font-bold rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Start Monthly Access</span>
              <div className="absolute inset-0 bg-purple-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
          </div>

          {/* Yearly */}
          <div className="bg-black border border-purple-500 rounded-3xl p-8 relative shadow-[0_0_50px_rgba(147,51,234,0.3)] transform md:scale-105 z-10 flex flex-col animate-fade-in-up delay-200 hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg animate-pulse-slow">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Yearly</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">$349</span>
              <span className="text-gray-500">/yr</span>
            </div>
            <p className="text-green-400 text-sm font-bold mb-6 flex items-center gap-2">
              <span className="bg-green-500/20 px-2 py-0.5 rounded text-xs">SAVE $130</span>
              Just $29.08/mo
            </p>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> 12 Months full access</li>
              <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> Private breakdown threads</li>
              <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> Beta invites to new tools</li>
              <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> Priority Discord role</li>
              <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-green-400 shrink-0" size={18} /> Locked-in renewal rate</li>
            </ul>
            <button
              onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transform hover:scale-[1.02]"
            >
              Go Yearly - Lock In Value
            </button>
          </div>

          {/* Lifetime */}
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-3xl p-8 hover:bg-gray-900 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/20 flex flex-col animate-fade-in-up delay-300 group">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Lifetime</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">$699</span>
              <span className="text-gray-500">/once</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Unlimited lifetime access</li>
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> VIP "Founder" Label</li>
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Long-term strategy models</li>
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Future exclusives included</li>
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> No recurring charges ever</li>
            </ul>
            <button
              onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
              className="w-full py-4 bg-purple-600/20 border border-purple-500/50 text-purple-300 font-bold rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Claim Lifetime Access</span>
              <div className="absolute inset-0 bg-purple-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
          </div>
        </div>

        {/* Guarantee Badge */}
        <div className="mt-16 text-center animate-fade-in-up delay-500">
          <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-6 py-3">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-gray-300 text-sm">30-Day Profit Guarantee applied to all plans</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 9. HOW IT WORKS PAGE COMPONENT ---

const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Hero */}
        <div className="text-center mb-24">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Engine</span> Behind the Edge.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We don't guess. We scrape millions of data points in real-time to find where the books are wrong. Here is exactly how we print money.
            </p>
          </Reveal>
        </div>

        {/* Steps */}
        <div className="space-y-32 relative">
          {/* Connecting Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent hidden md:block"></div>

          {/* Step 1 */}
          <Reveal className="grid md:grid-cols-2 gap-12 items-center relative">
            <div className="md:text-right order-2 md:order-1">
              <div className="inline-block p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 mb-4">
                <TrendingUp size={32} className="text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">1. Smart Scanning</h3>
              <p className="text-gray-400 leading-relaxed">
                Imagine having 1,000 eyes watching every sportsbook at once. Our system scans millions of odds in real-time, looking for lines that are "off" compared to the rest of the market.
              </p>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="absolute left-0 top-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full hidden md:block shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-slide-in-left"></div>
                <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Live Market Feed</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-gray-500">Scanning...</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded bg-gray-800/30 opacity-50">
                    <span className="text-gray-400 text-sm">NBA: LAL vs GSW</span>
                    <span className="text-gray-600 text-xs">Checking...</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-gray-800/30 opacity-50">
                    <span className="text-gray-400 text-sm">NFL: KC vs BUF</span>
                    <span className="text-gray-600 text-xs">Checking...</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-blue-500/10 border border-blue-500/30 transform scale-105 transition-all">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm">LeBron James</span>
                      <span className="text-blue-300 text-xs">Over 25.5 Points</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-white font-bold">-110</span>
                      <span className="text-green-400 text-xs font-bold">DISCREPANCY FOUND</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Step 2 */}
          <Reveal className="grid md:grid-cols-2 gap-12 items-center relative">
            <div className="order-2">
              <div className="absolute right-0 top-1/2 translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full hidden md:block shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
              <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl backdrop-blur-sm">
                <div className="font-mono text-xs text-purple-300 mb-4 text-center">&gt;&gt; ANALYZING_TRUE_PROBABILITY...</div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-gray-500 text-xs mb-1">Sharp Book Odds</div>
                      <div className="text-xl font-bold text-white">-150</div>
                      <div className="text-xs text-gray-600">(60% Probability)</div>
                    </div>
                    <div className="h-px w-12 bg-gray-700"></div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs mb-1">Your Book Odds</div>
                      <div className="text-xl font-bold text-green-400">-110</div>
                      <div className="text-xs text-gray-600">(52% Implied)</div>
                    </div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl text-center">
                    <div className="text-purple-400 font-bold text-sm">EDGE DETECTED: 8%</div>
                    <div className="text-gray-400 text-xs mt-1">The math says this bet wins more often than the odds imply.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 mb-4">
                <Zap size={32} className="text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">2. +EV Identification</h3>
              <p className="text-gray-400 leading-relaxed">
                We don't rely on gut feelings. We compare lines against the sharpest bookmakers in the world. When a regular sportsbook gives you better odds than the true probability of the event, that is <strong>Positive Expected Value (+EV)</strong>. That is how you win long-term.
              </p>
            </div>
          </Reveal>

          {/* Step 3 */}
          <Reveal className="grid md:grid-cols-2 gap-12 items-center relative">
            <div className="md:text-right order-2 md:order-1">
              <div className="inline-block p-3 rounded-2xl bg-green-500/10 border border-green-500/30 mb-4">
                <Smartphone size={32} className="text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">3. Instant Delivery</h3>
              <p className="text-gray-400 leading-relaxed">
                The second an edge is found, our bot blasts it to the Discord. You get the notification, place the bet, and lock in the value before the line moves. Speed is everything.
              </p>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="absolute left-0 top-1/2 -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full hidden md:block shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl backdrop-blur-sm max-w-sm mx-auto md:mx-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">ProPickz Bot</div>
                    <div className="text-gray-500 text-xs">Today at 7:42 PM</div>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-green-500 mb-2">
                  <div className="text-green-400 font-bold text-sm mb-1">💎 WHALE PLAY DETECTED</div>
                  <div className="text-white text-sm">LeBron James Over 25.5 Pts</div>
                  <div className="text-gray-400 text-xs mt-1">Odds: -110 (Implied: -145)</div>
                  <div className="text-purple-400 text-xs font-bold mt-1">EV: +12.4%</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Trust Section */}
        <div className="mt-32 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-white mb-8">Why This Isn't Gambling</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900/30 p-8 rounded-2xl border border-gray-800">
                <h4 className="text-xl font-bold text-white mb-2">Law of Large Numbers</h4>
                <p className="text-gray-400 text-sm">In the short term, anything happens. In the long term, math always wins. We play the long game.</p>
              </div>
              <div className="bg-gray-900/30 p-8 rounded-2xl border border-gray-800">
                <h4 className="text-xl font-bold text-white mb-2">Closing Line Value</h4>
                <p className="text-gray-400 text-sm">We consistently beat the closing line. If you beat the closing line, you are guaranteed to profit over time.</p>
              </div>
              <div className="bg-gray-900/30 p-8 rounded-2xl border border-gray-800">
                <h4 className="text-xl font-bold text-white mb-2">Bankroll Management</h4>
                <p className="text-gray-400 text-sm">We teach you strictly how to size your bets so you never blow up your account, even on a bad day.</p>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </div>
  );
};

// --- 10. SUPPORTED SPORTS PAGE COMPONENT ---

const SupportedSportsPage: React.FC = () => {
  const sports = [
    { name: 'NFL', full: 'National Football League', icon: <Trophy className="text-blue-500" size={40} />, color: 'from-blue-600 to-blue-800', desc: 'Spreads, Totals, Player Props' },
    { name: 'NBA', full: 'National Basketball Association', icon: <Dribbble className="text-orange-500" size={40} />, color: 'from-orange-600 to-red-600', desc: 'Moneyline, Quarter Bets, Player Performance' },
    { name: 'MLB', full: 'Major League Baseball', icon: <Disc className="text-red-500" size={40} />, color: 'from-red-600 to-blue-900', desc: 'Run Lines, First 5 Innings, Pitcher Props' },
    { name: 'NHL', full: 'National Hockey League', icon: <Flame className="text-cyan-500" size={40} />, color: 'from-cyan-600 to-blue-500', desc: 'Puck Line, Goal Totals, Period Bets' },
    { name: 'NCAAF', full: 'College Football', icon: <Award className="text-yellow-500" size={40} />, color: 'from-yellow-600 to-orange-600', desc: 'Saturday Slates, Bowl Games, Heisman Futures' },
    { name: 'UFC', full: 'Ultimate Fighting Championship', icon: <Target className="text-red-600" size={40} />, color: 'from-red-700 to-black', desc: 'Fight Winner, Method of Victory, Round Betting' },
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Total Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Dominance.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We don't just stick to one lane. Our algorithms scan every major league to find value wherever it hides.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport, index) => (
            <Reveal key={sport.name} delay={index * 100}>
              <div className="group relative bg-gray-900/40 border border-gray-800 rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl">
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${sport.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                <div className="p-8 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-gray-800/50 rounded-2xl border border-gray-700 group-hover:border-gray-600 transition-colors">
                      {sport.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-500 border border-gray-800 px-2 py-1 rounded-full group-hover:text-white group-hover:border-gray-600 transition-colors">
                      ACTIVE
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-1">{sport.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{sport.full}</p>

                  <div className="h-px w-full bg-gray-800 mb-4 group-hover:bg-gray-700 transition-colors"></div>

                  <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">
                    {sport.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={600} className="mt-20 text-center bg-gray-900/30 border border-gray-800 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">More Leagues Added Constantly</h3>
          <p className="text-gray-400 mb-8">
            Our team is constantly building models for new markets including Tennis, Soccer (EPL, La Liga), and E-Sports. If there's an edge, we will find it.
          </p>
          <button
            onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Get All Access
          </button>
        </Reveal>

      </div>
    </div>
  );
};

// --- 11. FAQ PAGE COMPONENT ---

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "What exactly is +EV betting?", a: "Positive Expected Value (+EV) betting is mathematically beating the sportsbooks. It means placing bets where the probability of winning is higher than the implied probability of the odds offered. Over time, this mathematical edge guarantees profit, similar to being the house in a casino." },
    { q: "How much bankroll do I need to start?", a: "We recommend a starting bankroll of at least $500 to comfortably follow our unit sizing strategy. However, we have members who started with $100 and built it up. The key is consistency and following the system." },
    { q: "Do I need to know sports to win?", a: "Absolutely not. In fact, knowing sports can sometimes hurt you if you rely on 'gut feelings'. Our system is 100% data-driven. You are following math, not teams. We tell you exactly what to bet, when, and how much." },
    { q: "How do I receive the picks?", a: "All picks are delivered instantly via our private Discord server. You can enable push notifications to ensure you never miss a +EV opportunity. Speed is key, and Discord is the fastest delivery method available." },
    { q: "Is there a guarantee?", a: "Yes. We offer the industry's strongest guarantee. If you don't profit in your first week, you get 30 days free. If you don't profit in your first month, you get a full refund. We are that confident in our math." },
    { q: "Can I cancel my subscription anytime?", a: "Yes, you have full control. You can cancel your subscription instantly from your dashboard with one click. No hidden fees, no jumping through hoops." },
    { q: "Which sportsbooks do I need?", a: "To maximize your edge, we recommend having accounts with at least 3 major sportsbooks (e.g., FanDuel, DraftKings, MGM, Caesars). This allows you to 'line shop' and always get the best odds available." },
    { q: "Is this legal?", a: "Yes, sports betting is legal in many jurisdictions. However, it is your responsibility to ensure you are complying with the local laws and regulations of your specific location." },
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Frequently Asked <span className="text-purple-500">Questions.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-400">
              Everything you need to know about the system, the math, and the money.
            </p>
          </Reveal>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-colors">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className="text-lg font-bold text-white">{faq.q}</span>
                  <ChevronDown className={`text-purple-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`px-6 text-gray-400 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  {faq.a}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={600} className="mt-20 text-center">
          <p className="text-gray-500 mb-6">Still have questions?</p>
          <button
            onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
            className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-700 transition"
          >
            Contact Support
          </button>
        </Reveal>
      </div>
    </div>
  );
};

// --- 12. BETTING ACADEMY PAGE COMPONENT ---

const BettingAcademyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Animated Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>

      <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">

        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-purple-500/50 bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest mb-8 animate-bounce">
            Live Education 24/7
          </div>
        </Reveal>

        <Reveal delay={200}>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight">
            THE REAL CLASSROOM <br />
            IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse">LIVE.</span>
          </h1>
        </Reveal>

        <Reveal delay={400}>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Static courses are dead. The market moves too fast. Join the <span className="text-white font-bold">Discord</span> to learn directly from the pros, watch live analysis, and see the edge happen in real-time.
          </p>
        </Reveal>

        <Reveal delay={600}>
          <div className="grid md:grid-cols-3 gap-6 mb-16 text-left">
            <div className="bg-gray-900/60 backdrop-blur border border-gray-800 p-6 rounded-2xl hover:border-purple-500 transition-colors group">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Q&A Sessions</h3>
              <p className="text-gray-500 text-sm">Ask questions and get answers instantly from our lead analysts. No waiting for email support.</p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur border border-gray-800 p-6 rounded-2xl hover:border-blue-500 transition-colors group">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Play className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Video Breakdowns</h3>
              <p className="text-gray-500 text-sm">Watch us break down the board every morning. See exactly why we are taking a position.</p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur border border-gray-800 p-6 rounded-2xl hover:border-green-500 transition-colors group">
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="text-green-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bankroll Coaching</h3>
              <p className="text-gray-500 text-sm">Learn the strict money management rules that separate the pros from the gamblers.</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={800}>
          <button
            onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
            className="group relative px-12 py-6 bg-[#5865F2] text-white font-black text-xl rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(88,101,242,0.4)] hover:shadow-[0_0_60px_rgba(88,101,242,0.6)] transition-all hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative flex items-center gap-3">
              JOIN THE ACADEMY ON DISCORD <ArrowUpRight size={24} />
            </span>
          </button>
          <p className="mt-6 text-sm text-gray-500 animate-pulse">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></span>
            1,420+ Members Online Now
          </p>
        </Reveal>

      </div>
    </div>
  );
};

// --- 8. GUARANTEE PAGE COMPONENT ---

const GuaranteePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 w-full">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
            ZERO <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">RISK.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We don't just promise results. We engineer them.
          </p>
        </div>

        {/* The Monolith Card */}
        <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl">
          {/* Glowing Top Border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70"></div>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 p-8 md:p-12 items-center relative">

            {/* Left Side: The Logic */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700">
                  <span className="text-purple-400 font-bold text-xl">01</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">The 7-Day Proof</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    If you don't see green in your first week, we extend your trial for <span className="text-white font-bold">30 days FREE.</span> We prove the system works before you pay a dime.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700">
                  <span className="text-green-400 font-bold text-xl">02</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">The 30-Day Assurance</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Finish your first month down? We refund <span className="text-white font-bold">100% of your subscription.</span> No questions. No loopholes. Just math.
                  </p>
                </div>
              </div>
            </div>

            {/* Center Divider (Desktop) */}
            <div className="hidden md:flex flex-col items-center justify-center h-full gap-2">
              <div className="w-px h-20 bg-gradient-to-b from-transparent to-gray-700"></div>
              <div className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center bg-black">
                <CheckCircle size={16} className="text-green-500" />
              </div>
              <div className="w-px h-20 bg-gradient-to-t from-transparent to-gray-700"></div>
            </div>

            {/* Right Side: The CTA */}
            <div className="text-center md:text-left bg-gradient-to-br from-purple-900/20 to-black p-8 rounded-2xl border border-purple-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-purple-600/5 group-hover:bg-purple-600/10 transition-colors duration-500"></div>

              <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Protected by Math.</h3>
              <p className="text-gray-400 text-sm mb-6 relative z-10">
                Our +EV edge is so strong, we can afford to take the risk. Can you afford not to?
              </p>

              <button
                onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] relative z-10 flex items-center justify-center gap-2"
              >
                Activate Guarantee <ArrowUpRight size={18} />
              </button>

              <div className="mt-4 flex items-center justify-center md:justify-start gap-2 text-xs text-gray-500 relative z-10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                System Active & Monitoring
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="bg-black/40 p-4 text-center border-t border-gray-800">
            <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
              Protocol ID: PRO-GUARANTEE-V2 // Status: ENFORCED
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- 7. RESULTS PAGE COMPONENT ---

const ResultsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
          Proven <span className="text-green-500">Results.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16">
          Real wins from real members. The math speaks for itself.
        </p>

        {/* Placeholder for Gallery */}
        <div className="border-2 border-dashed border-gray-800 rounded-3xl p-20 flex flex-col items-center justify-center bg-gray-900/30 backdrop-blur-sm">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <TrendingUp size={40} className="text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-500 mb-2">Gallery Coming Soon</h3>
          <p className="text-gray-600">We are compiling our latest big wins and member success stories.</p>
        </div>
      </div>
    </div>
  );
};

// --- 6. LEGAL PAGE COMPONENT ---

const LegalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Legal</h1>
        <p className="text-gray-400 mb-12">Effective Date: June 1, 2025</p>

        <div className="space-y-12 text-gray-300 leading-relaxed">
          <p>
            These Terms of Use ("Terms") govern your access to and use of the ProPickz website, Discord server, platform tools (including the “ProPickz Bot”), and any other content, products, or services provided (collectively, the "Service"). By accessing or using any part of the Service, you acknowledge that you have read, understood, and agreed to be bound by these Terms in full. If you do not agree, you are not authorized to access or use the Service.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Informational Purposes Only – Not Financial Advice</h2>
            <p className="mb-4">
              All content provided by ProPickz, including but not limited to betting picks, data, projections, models, articles, server discussions, and bot-generated outputs, is intended strictly for informational and entertainment purposes only.
            </p>
            <p className="mb-4">
              We are not financial advisors, bookmakers, or licensed gaming operators, and none of the information provided should be interpreted as investment advice, financial guidance, or an inducement to gamble.
            </p>
            <p>
              You are solely responsible for how you use the information. Betting and gambling involve significant risk, including the loss of your entire stake, and you acknowledge that you act entirely at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. No Guarantee of Profit or Outcome</h2>
            <p className="mb-4">
              ProPickz makes no guarantee of success, profitability, win rate, or accuracy of any content or selections published on our platform or communicated through our tools. Historical performance — whether real or simulated — is not indicative of future results.
            </p>
            <p>
              You understand and accept that betting outcomes are inherently uncertain, and that ProPickz, its team, affiliates, and technology providers will not be liable for any financial losses, emotional distress, or damages of any kind incurred through use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Content May Include Simulations and Fictional Representations</h2>
            <p className="mb-4">
              Some information displayed on this website and/or its related marketing materials — including but not limited to drawings, mockups, illustrations, profit examples, projections, dashboards, and rendering images — are fictional, simulated, or hypothetical in nature. They are intended solely for presentation purposes and do not reflect actual financial performance or guaranteed results.
            </p>
            <p>
              Any resemblance to real earnings, gains, or events is purely coincidental and not meant to imply a guaranteed outcome.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. No Client or Fiduciary Relationship</h2>
            <p className="mb-4">
              Accessing or subscribing to the Service does not create a professional-client, fiduciary, or advisory relationship of any kind. You are solely responsible for complying with your local laws, including laws surrounding sports betting, internet gambling, and financial risk.
            </p>
            <p>
              You must be at least 21 years old and legally permitted to participate in sports betting activities in your jurisdiction to access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by applicable law, ProPickz, its owners, employees, contractors, affiliates, or agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Use or inability to use the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access to or alteration of your transmissions or data</li>
              <li>Third-party platforms, integrations, or bookmakers you interact with through or outside our platform</li>
            </ul>
            <p>
              All content is provided “as is” and “as available” without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
            <p>
              All intellectual property, branding, code, bots, written content, designs, and trademarks on the ProPickz platform are the sole property of ProPickz and protected under copyright and trademark law. Any unauthorized reproduction, distribution, modification, or public display of this content is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Jurisdiction and Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the Province of Quebec, Canada, without regard to its conflict of law principles.
            </p>
            <p>
              You agree that any legal action or proceeding related to the Service must be filed exclusively in the provincial or federal courts located in Montreal, Quebec, and you irrevocably consent to the jurisdiction of such courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Changes to These Terms</h2>
            <p>
              We reserve the right to modify or update these Terms at any time. Continued use of the Service after such changes constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining Terms remain in full force and effect.
            </p>
          </section>

          <div className="pt-8 border-t border-gray-800">
            <h3 className="text-xl font-bold text-white mb-2">Get in touch</h3>
            <p>
              For questions regarding these Terms, please contact us at: <a href="mailto:support@propickz.com" className="text-purple-400 hover:text-purple-300 transition-colors">support@propickz.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 7. MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [view, setView] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    initFirebase();
  }, []);

  const renderView = () => {
    switch (view) {
      case 'Home': return <HomePage navigateTo={setView} />;
      case 'Pricing': return <PricingPage />;
      case 'Guarantee': return <GuaranteePage />;
      case 'Results': return <ResultsPage />;
      case 'HowItWorks': return <HowItWorksPage />;
      case 'SupportedSports': return <SupportedSportsPage />;
      case 'BettingAcademy': return <BettingAcademyPage />;
      case 'FAQ': return <FAQPage />;
      case 'Legal': return <LegalPage />;
      default: return <div className="p-20 text-center text-white bg-black min-h-screen">Placeholder for {view}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
      <Navbar setView={setView} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content */}
      <main className="relative z-10">
        {renderView()}
      </main>

      <Footer />

      {/* Notifications - Only on Home */}
      {view === 'Home' && <FomoNotification />}

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default App;
