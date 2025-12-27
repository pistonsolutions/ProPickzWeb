'use client'; // Ensures Next.js compatibility

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import {
  TrendingUp, CheckCircle, Smartphone,
  Menu, X, ChevronDown, MessageSquare, Send,
  Zap, ArrowUpRight, Play, Star, Sparkles, BookOpen, HelpCircle, Trophy, Flame, Target, Award, Disc, Dribbble, AlertCircle, Activity, Shield, UserPlus, Clock, Wallet, LineChart, Users, Info, LayoutDashboard, Layers, Gift
} from 'lucide-react';

// Firebase Imports
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import propickzLogo from './assets/propickzlogo.png';
import learningUi from './assets/learning_ui.png';

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
      { name: 'EV+ & Arbitrage', action: () => setView('EV'), icon: <Activity size={16} /> },
      { name: 'Results', action: () => setView('Results'), icon: <CheckCircle size={16} /> },
      { name: 'How It Works', action: () => setView('HowItWorks'), icon: <Zap size={16} /> },
      { name: 'Supported Sports', action: () => setView('SupportedSports'), icon: <Trophy size={16} /> },
    ],
    Membership: [
      { name: 'Pricing', action: () => setView('Pricing'), icon: <Star size={16} /> },
      { name: 'Free Trial', action: () => setView('FreeTrial'), icon: <Zap size={16} /> },
      { name: 'Testimonials', action: () => setView('Testimonials'), icon: <MessageSquare size={16} /> },
      { name: 'Guarantee', action: () => setView('Guarantee'), icon: <Shield size={16} /> },
    ],
    Resources: [
      { name: 'About Us', action: () => setView('AboutUs'), icon: <TrendingUp size={16} /> },
      { name: 'Why Trust Us', action: () => setView('Trust'), icon: <CheckCircle size={16} /> },
      { name: 'Betting Academy', action: () => setView('BettingAcademy'), icon: <BookOpen size={16} /> },
      { name: 'FAQ', action: () => setView('FAQ'), icon: <HelpCircle size={16} /> },
      { name: 'Legal', action: () => setView('Legal'), icon: <MessageSquare size={16} /> },
    ]
  };

  return (
    <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-gray-800" onMouseLeave={() => setActiveDropdown(null)}>
      <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">

        {/* Left Side: Contact Us + Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => window.location.href = 'mailto:support@propickz.com'}
            className="text-gray-400 hover:text-purple-400 text-sm font-medium transition-colors hidden md:block"
          >
            Contact Us
          </button>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('Home')}>
            <img src={propickzLogo} alt="ProPickz" className="h-24 w-auto object-contain" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
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

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => window.open('https://discord.gg/propickz', '_blank')} className="px-5 py-2 border border-purple-500 text-purple-400 text-sm font-bold rounded-lg hover:bg-purple-500/10 transition shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            Join Free Discord
          </button>
          <button onClick={() => setView('Pricing')} className="px-5 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            View Pricing
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800 absolute w-full left-0 top-24 p-4 flex flex-col gap-4 animate-fade-in-up md:hidden h-[calc(100vh-6rem)] overflow-y-auto">
          <button onClick={() => { setView('Home'); setMobileMenuOpen(false); }} className="text-left text-white font-bold py-2 border-b border-gray-800">Home</button>

          {Object.entries(navGroups).map(([group, items]) => (
            <div key={group} className="py-2">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 px-2">{group}</div>
              <div className="flex flex-col gap-1">
                {items.map(item => (
                  <button
                    key={item.name}
                    onClick={() => { item.action(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 p-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg text-sm"
                  >
                    {item.icon}
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-gray-800 flex flex-col gap-3">
            <button onClick={() => window.open('https://discord.gg/propickz', '_blank')} className="w-full py-3 border border-purple-500 text-purple-400 font-bold rounded-xl">
              Join Free Discord
            </button>
            <button onClick={() => { setView('Pricing'); setMobileMenuOpen(false); }} className="w-full py-3 bg-white text-black font-bold rounded-xl">
              View Pricing
            </button>
          </div>
        </div>
      )}
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

      {/* 5. LEARNING SECTION */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-900/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image with Automation/Tilt */}
          <div className="order-2 lg:order-1 relative perspective-1000 group">
            <div className="relative z-10 transform transition-transform duration-700 ease-out group-hover:rotate-y-12 group-hover:rotate-x-6">
              <img src={learningUi} alt="ProPickz Education" className="w-full max-w-lg mx-auto drop-shadow-2xl rounded-3xl border border-gray-800/50" />

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-black/80 backdrop-blur border border-purple-500/50 p-4 rounded-2xl shadow-2xl animate-float delay-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">New Guide</div>
                    <div className="text-purple-300 text-xs">Bankroll Mastery 101</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-600/20 blur-[100px] pointer-events-none rounded-full"></div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Master the Game <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Behind the Picks</span>
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-gray-400 leading-relaxed">
                We don't just hand out picks—we help you become a sharper, more strategic bettor. At ProPickz, education is part of the edge. Learn the principles behind profitable betting, bankroll management, and how to think like a pro.
              </p>
            </Reveal>

            <div className="space-y-6">
              {[
                {
                  icon: <Wallet className="text-green-400" size={24} />,
                  title: "Bankroll Management",
                  desc: "Learn how to size your bets, avoid tilt, and grow your bankroll like a pro, even through losing streaks."
                },
                {
                  icon: <LineChart className="text-blue-400" size={24} />,
                  title: "Find the Edge",
                  desc: "We teach you how to identify value in the lines, not just follow trends. Understand what gives you a long term-advantage."
                },
                {
                  icon: <Users className="text-purple-400" size={24} />,
                  title: "Live Strategy Sessions",
                  desc: "Join exclusive Discord breakdowns where our analysts walk through picks, explain mistakes, and answer live questions."
                }
              ].map((feature, i) => (
                <Reveal key={i} delay={300 + (i * 100)} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-900/50 transition-colors border border-transparent hover:border-gray-800">
                  <div className="shrink-0 mt-1 w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING */}
      <section className="py-24 bg-black relative" id="pricing">
        <div className="absolute inset-0 bg-purple-900/10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Free for 7 Days. If You Don’t Profit, the Next Month is on Us.</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">No gimmicks. No guesswork. Just expert picks, performance tracking, and a community that wins together.</p>
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
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-purple-600/50">
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
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        {/* Header */}
        <Reveal>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Pick Plans That Match Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Hustle.</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            No Gimmicks. Just Gains.
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16">
            Whether you’re testing the waters or betting with conviction, profits are one click away.
          </p>
        </Reveal>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">

          {/* FREE PLAN */}
          <Reveal delay={300} className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-3xl p-6 hover:bg-gray-900 transition-colors flex flex-col text-left">
            <h3 className="text-xl font-bold text-gray-400 mb-2">Free Plan</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-300 text-sm"><Gift className="text-yellow-500 shrink-0" size={18} /> Entry to Member Lottery</li>
              <li className="flex gap-3 text-gray-300 text-sm"><LayoutDashboard className="text-blue-500 shrink-0" size={18} /> Access to Results Tracker</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Zap className="text-purple-500 shrink-0" size={18} /> Weekly free picks & previews</li>
              <li className="flex gap-3 text-gray-500 text-sm italic">Great way to test ProPickz</li>
            </ul>
            <button
              onClick={() => window.open('https://discord.gg/propickz', '_blank')}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors"
            >
              Join for Free
            </button>
          </Reveal>

          {/* PRO PLAN - GLOWING/HIGHLIGHTED */}
          <Reveal delay={400} className="bg-black border-2 border-purple-500 rounded-3xl p-6 relative shadow-[0_0_40px_rgba(147,51,234,0.3)] transform md:scale-105 z-10 flex flex-col text-left">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pro Plan</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">$74.99</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-purple-400 shrink-0" size={18} /> Full access to all picks</li>
              <li className="flex gap-3 text-white text-sm font-bold"><Layers className="text-purple-400 shrink-0" size={18} /> Parlays (Safe & Risky)</li>
              <li className="flex gap-3 text-white text-sm font-bold"><TrendingUp className="text-purple-400 shrink-0" size={18} /> Ladder Challenges</li>
              <li className="flex gap-3 text-white text-sm font-bold"><Gift className="text-yellow-400 shrink-0" size={18} /> Full Giveaway Access</li>
              <li className="flex gap-3 text-white text-sm font-bold"><BookOpen className="text-purple-400 shrink-0" size={18} /> Education Section</li>
              <li className="flex gap-3 text-gray-400 text-sm">Included in Member Lottery</li>
            </ul>
            <button
              onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-900/40"
            >
              Get Pro Access
            </button>
          </Reveal>

          {/* QUARTERLY PLAN */}
          <Reveal delay={500} className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-3xl p-6 hover:bg-gray-900 transition-colors flex flex-col text-left">
            <h3 className="text-xl font-bold text-white mb-2">Quarterly</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$189</span>
              <span className="text-gray-500">/3mo</span>
            </div>
            <p className="text-green-400 text-xs font-bold mb-6">Save $36 vs Monthly</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-green-500 shrink-0" size={18} /> Everything in Pro Plan</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Clock className="text-green-500 shrink-0" size={18} /> 3 Months Locked In</li>
              <li className="flex gap-3 text-gray-300 text-sm"><TrendingUp className="text-green-500 shrink-0" size={18} /> Ideal for consistent bettors</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Activity className="text-green-500 shrink-0" size={18} /> Stronger Value</li>
            </ul>
            <button
              onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors border border-gray-700"
            >
              Start Quarterly
            </button>
          </Reveal>

          {/* ANNUAL PLAN */}
          <Reveal delay={600} className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-3xl p-6 hover:bg-gray-900 transition-colors flex flex-col text-left">
            <div className="absolute -top-3 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Best Value
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Annual</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$649</span>
              <span className="text-gray-500">/yr</span>
            </div>
            <p className="text-green-400 text-xs font-bold mb-6">Lowest Cost Per Month ($54)</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-green-500 shrink-0" size={18} /> Full Access for 12 Months</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Trophy className="text-green-500 shrink-0" size={18} /> Perfect for serious bettors</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Target className="text-green-500 shrink-0" size={18} /> Long-term strategy focus</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Shield className="text-green-500 shrink-0" size={18} /> Maximize Bankroll Growth</li>
            </ul>
            <button
              onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
              className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Go Annual
            </button>
          </Reveal>

        </div>

        {/* Final CTA */}
        <Reveal delay={700} className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-3xl p-12 mb-16">
          <h2 className="text-3xl font-black text-white mb-4">Pick a Plan. Build a Bankroll.</h2>
          <p className="text-xl text-gray-300 mb-8 font-light">
            Be the one who wins on <span className="font-bold text-white">Purpose.</span>
          </p>
        </Reveal>

        <Reveal delay={500}>
          <div className="text-center">
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Profit or it’s free. If you don't finish the month in profit, we’ll give you the next month on us. Simple.
            </p>
          </div>
        </Reveal>

      </div>
    </div>
  );
};

// --- 9. HOW IT WORKS PAGE COMPONENT ---

const HowItWorksPage: React.FC = () => {
  const [showSamplePick, setShowSamplePick] = useState(false);

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* NEW HERO: 3-STEP FLOW */}
        <div className="mb-32 text-center">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-12">
              How Propickz Makes You a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Smarter Bettor</span>
            </h1>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: <UserPlus className="text-purple-400" size={32} />, title: "Subscribe", desc: "Choose a plan that matches your style. You will instantly get access to our Discord." },
              { icon: <Zap className="text-blue-400" size={32} />, title: "Get Picks Daily", desc: "Every day, receive our vetted, high confidence selections backed by data & discipline." },
              { icon: <TrendingUp className="text-green-400" size={32} />, title: "Track Performance", desc: "All picks are timestamped and tracked for transparency. See your profits grow day by day." },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 100} className="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl backdrop-blur-sm hover:bg-gray-900/60 transition-colors">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-900/20">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <button
              onClick={() => setShowSamplePick(true)}
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2 mx-auto"
            >
              See a Sample Pick <ChevronDown size={20} />
            </button>
          </Reveal>
        </div>

        {/* SAMPLE PICK MODAL */}
        {showSamplePick && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up" onClick={() => setShowSamplePick(false)}>
            <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-md w-full relative shadow-2xl shadow-purple-900/50" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setShowSamplePick(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-green-500/30">
                  Confirmed Win
                </div>
                <span className="text-gray-500 text-xs">Sample Preview</span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Pick</div>
                  <div className="text-2xl font-black text-white">Bills -2.5 <span className="text-gray-500 text-lg font-medium">(-110)</span></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-3 rounded-xl">
                    <div className="text-gray-500 text-xs mb-1 flex items-center gap-1"><Target size={12} /> Game</div>
                    <div className="text-white text-sm font-bold">BUF @ MIA</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-xl">
                    <div className="text-gray-500 text-xs mb-1 flex items-center gap-1"><Clock size={12} /> Date</div>
                    <div className="text-white text-sm font-bold">Sun, Sept 17</div>
                  </div>
                </div>

                <div className="pb-4 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Sportsbook</span>
                    <span className="text-blue-400 font-bold flex items-center gap-1"><Zap size={14} fill="currentColor" /> FanDuel</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-500 text-xs mb-3">Instant Analysis Logic included with every pick.</p>
                  <button onClick={() => window.open('https://discord.gg/propickz', '_blank')} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">
                    Unlock Today's Picks
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORIGINAL HERO (Pushed Down) */}
        <div className="text-center mb-24 pt-12 border-t border-gray-800/50">
          <Reveal>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 text-gray-400">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Engine</span> Behind the Edge.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
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

      {/* Intense Purple Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 w-full">

        {/* Header Section */}
        <div className="text-center mb-12">
          <Reveal>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Try ProPickz Free for 7 Days.<br />
              If You Don’t Profit, the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Next Month Is On Us.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              You win – or you don't pay. That's how confident we are in our system.
            </p>
          </Reveal>
        </div>

        {/* Dual Card Container */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">

          {/* Free Trial Card */}
          <Reveal delay={300}>
            <div className="bg-[#0f1014] border border-gray-800 rounded-3xl p-8 flex flex-col h-full hover:border-gray-700 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-8 tracking-wide">FREE TRIAL</h3>

              <ul className="space-y-6 mb-8 flex-1">
                <li className="flex items-start gap-4">
                  <CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
                  <span className="text-gray-300 text-lg">Access to daily picks for all major sports</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
                  <span className="text-gray-300 text-lg">Entry to Discord betting community</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
                  <span className="text-gray-300 text-lg">No credit card required</span>
                </li>
              </ul>

              <button
                onClick={() => window.open('https://discord.gg/propickz', '_blank')}
                className="w-full py-4 bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-lg rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
              >
                Start Free Trial
              </button>
            </div>
          </Reveal>

          {/* Pro Membership Card */}
          <Reveal delay={400}>
            <div className="bg-[#0f1014] border border-gray-800 rounded-3xl p-8 flex flex-col h-full hover:border-purple-500/50 transition-colors relative overflow-hidden group">
              {/* Subtle purple glow for Pro */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/20 transition-colors"></div>

              <h3 className="text-2xl font-bold text-white mb-8 tracking-wide">PRO MEMBERSHIP</h3>

              <ul className="space-y-6 mb-8 flex-1">
                <li className="flex items-start gap-4">
                  <Info className="text-[#5865F2] shrink-0 mt-1" size={20} />
                  <span className="text-gray-300 text-lg">Full pick archive access</span>
                </li>
                <li className="flex items-start gap-4">
                  <LayoutDashboard className="text-[#5865F2] shrink-0 mt-1" size={20} />
                  <span className="text-gray-300 text-lg">Advanced tracking dashboard</span>
                </li>
                <li className="flex items-start gap-4">
                  <Zap className="text-[#5865F2] shrink-0 mt-1" size={20} />
                  <span className="text-gray-300 text-lg">Daily Picks + 35% off DFS</span>
                </li>
                <li className="flex items-start gap-4">
                  <BookOpen className="text-[#5865F2] shrink-0 mt-1" size={20} />
                  <span className="text-gray-300 text-lg">Strategy education vault</span>
                </li>
              </ul>

              <button
                onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
                className="w-full py-4 bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-lg rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
              >
                Unlock Full Access
              </button>
            </div>
          </Reveal>

        </div>

        {/* Footer Guarantee Text */}
        <Reveal delay={500}>
          <div className="text-center">
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Profit or it’s free. If you don't finish the month in profit, we’ll give you the next month on us. Simple.
            </p>
          </div>
        </Reveal>

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

        <div className="space-y-12 text-gray-300 leading-relaxed font-light">
          <p>
            These Terms & Conditions (“Terms”) govern your access to and use of the ProPickz platform, including but not limited to our website, Discord server, bots, tools, data, models, projections, recommendations, content, communications, and any related products or services (collectively, the “Service”).
            <br /><br />
            By accessing, subscribing to, or otherwise using the Service, you acknowledge that you have read, understood, and agree to be legally bound by these Terms. If you do not agree, you must not use the Service.
          </p>

          {/* 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Informational Purposes Only – Not Financial or Gambling Advice</h2>
            <p className="mb-4">
              All content provided by ProPickz, including but not limited to betting picks, statistical models, educational material, projections, articles, Discord discussions, tools, and bot-generated outputs, is intended strictly for informational, educational, and entertainment purposes only.
            </p>
            <p className="mb-4">
              ProPickz is not a financial advisor, investment advisor, bookmaker, gambling operator, or licensed gaming provider.
            </p>
            <p className="mb-4">
              No content provided constitutes investment advice, financial guidance, legal advice, tax advice, or an inducement to gamble. Any decisions you make based on the information provided are made entirely at your own discretion and risk.
            </p>
            <p>
              You acknowledge that gambling and betting inherently involve high risk, including the potential loss of your entire stake, and you agree that you assume all responsibility and liability for how you use the Service.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. No Guarantee of Profit, Outcome, or Accuracy</h2>
            <p className="mb-4">
              ProPickz makes no guarantees, warranties, or representations — express or implied — regarding:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>The accuracy, reliability, timeliness, or completeness of any information or selections.</li>
              <li>The likelihood of achieving profit, success, or any particular outcome.</li>
              <li>Win rates, statistical advantages, or performance results.</li>
            </ul>
            <p className="mb-4">
              Historical performance, whether real, simulated, or hypothetical, is provided for reference and educational purposes only and does not guarantee future outcomes.
            </p>
            <p>
              By using the Service, you expressly acknowledge and agree that all betting and gambling decisions are inherently uncertain, and ProPickz shall not be held responsible or liable for any reliance you place on the content.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Content May Include Simulations, Hypotheticals, and Marketing Materials</h2>
            <p className="mb-4">
              Certain materials provided or displayed by ProPickz, including but not limited to illustrations, mockups, dashboards, case studies, projections, or profit examples, may be fictional, simulated, or hypothetical in nature.
            </p>
            <p className="mb-4">
              All such content is intended solely for presentation and marketing purposes and is clearly distinguished from actual performance data.
            </p>
            <p className="mb-4">
              Any resemblance to actual events, earnings, or outcomes is purely coincidental and not intended to imply real-world accuracy or guaranteed results.
            </p>
            <p>
              Where simulations or hypothetical results are displayed, they will be prominently labeled as such.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. No Client, Fiduciary, or Advisory Relationship</h2>
            <p className="mb-4">
              Your use of the Service does not establish any professional-client, fiduciary, advisory, or partnership relationship between you and ProPickz.
            </p>
            <p className="mb-4">
              ProPickz does not act in any advisory capacity, including but not limited to financial, legal, or gambling-related advisory.
            </p>
            <p className="mb-2">You are solely responsible for:</p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Complying with all local, state/provincial, federal, and international laws applicable to your activities.</li>
              <li>Determining whether sports betting or gambling is legal in your jurisdiction.</li>
              <li>Ensuring that you meet the minimum legal age requirement in your jurisdiction (in no event less than 18 years old, and in some jurisdictions 21 years old).</li>
            </ul>
            <p>
              ProPickz does not provide access to the Service in jurisdictions where doing so would violate applicable law, and we reserve the right to restrict access accordingly.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, ProPickz, its owners, employees, contractors, affiliates, and agents shall not be liable for:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Any losses or damages of any kind — including but not limited to direct, indirect, incidental, consequential, punitive, exemplary, or special damages;</li>
              <li>Loss of profits, revenues, savings, data, goodwill, or opportunity;</li>
              <li>Reliance on content, recommendations, or services provided by ProPickz;</li>
              <li>Unauthorized access to or alteration of your data, transmissions, or account;</li>
              <li>Third-party platforms, tools, bookmakers, or integrations accessed through or in connection with the Service.</li>
            </ul>
            <p className="mb-4">
              This limitation applies even if ProPickz has been advised of the possibility of such damages.
            </p>
            <p className="mb-2">Nothing in these Terms excludes liability for:</p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Fraud or fraudulent misrepresentation;</li>
              <li>Gross negligence or willful misconduct by ProPickz;</li>
              <li>Any liability that cannot be excluded under applicable law.</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Disclaimer of Warranties</h2>
            <p className="mb-4">
              The Service and all content are provided strictly “as is” and “as available” without warranties of any kind, express or implied.
            </p>
            <p className="mb-4">
              ProPickz disclaims all warranties including, but not limited to:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Merchantability, fitness for a particular purpose, accuracy, reliability, or non-infringement.</li>
            </ul>
            <p className="mb-4">
              We do not warrant that the Service will be uninterrupted, timely, secure, error-free, or free of harmful components.
            </p>
            <p>
              You acknowledge that any reliance you place on the Service is entirely at your own risk.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property and User License</h2>
            <p className="mb-4">
              All intellectual property rights in and to the Service, including but not limited to software, bots, tools, written content, logos, branding, trademarks, and design elements, are and shall remain the exclusive property of ProPickz.
            </p>
            <p className="mb-4">
              ProPickz grants you a limited, revocable, non-exclusive, non-transferable license to use the Service strictly for personal, non-commercial, lawful purposes, subject to these Terms.
            </p>
            <p className="mb-4">
              You may not copy, reproduce, distribute, modify, reverse-engineer, or publicly display any ProPickz content without prior written consent.
            </p>
            <p>
              Any unauthorized use of intellectual property may result in termination of access and legal action.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Jurisdiction, Governing Law, and Dispute Resolution</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the Province of Quebec, Canada, without regard to conflict of law principles.
            </p>
            <p className="mb-4">
              You agree that all legal actions, claims, or proceedings arising from or relating to the Service shall be brought exclusively before the provincial and federal courts located in Montreal, Quebec.
            </p>
            <p className="mb-4">
              By using the Service, you expressly and irrevocably consent to the jurisdiction of these courts.
            </p>
            <p>
              To the fullest extent permitted by law, you waive the right to participate in any class action or representative lawsuit against ProPickz. All disputes must be resolved on an individual basis.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Terms</h2>
            <p className="mb-4">
              ProPickz reserves the right to amend, update, or replace these Terms at any time.
            </p>
            <p className="mb-4">
              Material changes will be communicated through prominent notice (such as email, Discord announcements, or website updates).
            </p>
            <p className="mb-4">
              Your continued use of the Service following any such changes constitutes acceptance of the revised Terms.
            </p>
            <p>
              It is your responsibility to review these Terms regularly.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Severability</h2>
            <p>
              If any provision of these Terms is determined to be unlawful, invalid, or unenforceable, such provision shall be enforced to the maximum extent permissible, and the remainder of the Terms shall remain in full force and effect.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Entire Agreement</h2>
            <p>
              These Terms constitute the entire agreement between you and ProPickz regarding the Service and supersede any prior agreements, understandings, or representations.
            </p>
          </section>

          {/* 12 - Guarantee Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Guarantee Disclaimer</h2>

            <h3 className="text-xl font-bold text-white mt-6 mb-2">Scope of Guarantee</h3>
            <p className="mb-4">
              The guarantee described herein applies solely to the subscription fee paid by the Member for their Membership plan (monthly, yearly, or lifetime). Under no circumstances shall Propickz (“the Company”) be liable for any losses, damages, or claims beyond the limited refund amounts defined below.
            </p>

            <h3 className="text-xl font-bold text-white mt-6 mb-2">Definition of Loss and Evaluation Period</h3>
            <p className="mb-4">
              The term loss is defined exclusively as the absence of net profit within a given thirty (30) consecutive calendar-day period (“Guarantee Month”), measured from the first day of Membership activation or from any subsequent monthly cycle.
            </p>
            <p className="mb-4">
              Profit or loss shall be determined solely on the collective results of all Company-provided content, including but not limited to event picks, analyst recommendations, +EV strategies, and arbitrage tools.
            </p>
            <p className="mb-4">
              Each Guarantee Month is treated independently, and no Guarantee Month may be combined or averaged with another to establish a claim.
            </p>

            <h3 className="text-xl font-bold text-white mt-6 mb-2">Membership-Specific Guarantees</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li><strong>Monthly Memberships:</strong> If no net profit is achieved during any Guarantee Month, the Company’s sole obligation shall be to refund the subscription fee paid for that specific month.</li>
              <li><strong>Yearly Memberships:</strong> If no net profit is achieved during any Guarantee Month within the yearly term, the Company’s sole obligation shall be to refund an amount equal to one (1) month of Pro Membership fees at the then-current monthly rate, regardless of the total annual fee paid.</li>
              <li><strong>Lifetime Memberships:</strong> If no net profit is achieved during any Guarantee Month within the lifetime of the Membership (e.g., Month 37, Month 52, etc.), the Company’s sole obligation shall be to refund an amount equal to one (1) month of Pro Membership fees at the then-current monthly rate, regardless of the lifetime fee paid.</li>
            </ul>

            <h3 className="text-xl font-bold text-white mt-6 mb-2">Member-Initiated Claims</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Refunds are not proactive. It is the Member’s sole responsibility to request a refund in writing within seven (7) days following the end of the applicable Guarantee Month.</li>
              <li>Failure to make a timely request shall result in forfeiture of that month’s refund eligibility.</li>
              <li>The Company will not issue refunds automatically, nor will it notify Members of eligibility.</li>
            </ul>

            <h3 className="text-xl font-bold text-white mt-6 mb-2">Exclusions of Liability</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>The Company provides sports picks, strategies, tools, and related content strictly for informational and entertainment purposes only.</li>
              <li>The Company does not provide financial, investment, or gambling advice, and nothing on its platform shall be construed as such.</li>
              <li>The Company assumes no responsibility for any wagering outcomes, financial losses, or personal decisions made by Members in reliance upon its content.</li>
              <li>Any betting or financial activity undertaken by Members is done solely at their own risk.</li>
            </ul>

            <h3 className="text-xl font-bold text-white mt-6 mb-2">Guarantee Limitation</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Refunds are capped strictly at the amounts described in Section 3 above.</li>
              <li>The guarantee does not extend to any claimed or alleged losses beyond the subscription refund described herein, including but not limited to wagering losses, consequential damages, indirect losses, or opportunity costs.</li>
            </ul>

            <h3 className="text-xl font-bold text-white mt-6 mb-2">No Workarounds / Binding Effect</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>This guarantee is non-transferable, non-renewable, and may not be restarted by canceling and re-enrolling in any Membership plan.</li>
              <li>This guarantee cannot be circumvented by any claim, workaround, or interpretation inconsistent with the express terms stated herein.</li>
              <li>By enrolling in any Membership plan, the Member acknowledges, accepts, and agrees to be bound by this Guarantee Disclaimer in full.</li>
            </ul>
          </section>

          {/* 13 */}
          <div className="pt-8 border-t border-gray-800">
            <h3 className="text-xl font-bold text-white mb-2">13. Contact</h3>
            <p>
              For questions regarding these Terms, please contact us at: <a href="mailto:support@propickz.com" className="text-purple-400 hover:text-purple-300 transition-colors">support@propickz.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- NEW ABOUT US PAGE ---

const AboutUsPage: React.FC = () => {
  const scrollToNext = () => {
    const nextSection = document.getElementById('who-we-are');
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      {/* SECTION 1: HERO */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          <Reveal>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight">
              We’re Not Just Here to Give Picks.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">We’re Here to Change How You Bet.</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Founded by disciplined bettors. Built for those who are tired of guesswork, hype, and losing streaks.
              <br /><br />
              Welcome to <span className="font-bold text-white">ProPickz</span> — where data, transparency, and consistency come first.
            </p>
          </Reveal>

          <Reveal delay={400}>
            <button
              onClick={scrollToNext}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_50px_rgba(147,51,234,0.5)] flex items-center gap-2 mx-auto"
            >
              Explore Our Process <ChevronDown size={20} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* SECTION 2: WHO WE ARE */}
      <section id="who-we-are" className="py-24 bg-black relative border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Who We <span className="text-purple-500">Are</span>
            </h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                ProPickz is a premium betting insights platform that delivers high-confidence daily picks, transparent performance tracking, and long-term profitability tools.
              </p>
              <p>
                We’re a combination of real sports bettors with over <span className="text-white font-bold">18 years of combined experience</span>, not hype-driven influencers or generic "AI" generators. We focus on value, edge, and discipline, and we show our work.
              </p>
              <p className="border-l-4 border-purple-500 pl-4 italic text-gray-400">
                "Whether you’re a casual bettor or sharp in the making, our system is designed to give you the consistency you’re looking for."
              </p>
            </div>
          </Reveal>

          <Reveal delay={200} className="relative">
            <div className="absolute inset-0 bg-blue-600/10 rounded-3xl blur-2xl transform rotate-3"></div>
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-black/50 rounded-2xl border border-gray-800">
                  <div className="text-4xl font-black text-purple-400 mb-1">18+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Years Exp.</div>
                </div>
                <div className="text-center p-4 bg-black/50 rounded-2xl border border-gray-800">
                  <div className="text-4xl font-black text-green-400 mb-1">2.4k+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Members</div>
                </div>
                <div className="text-center p-4 bg-black/50 rounded-2xl border border-gray-800 col-span-2">
                  <div className="text-4xl font-black text-blue-400 mb-1">$214k+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Profit Generated YTD</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 3: OUR STORY */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="text-4xl font-bold text-white mb-8">Why We Built ProPickz</h2>
          </Reveal>
          <Reveal delay={200} className="bg-gray-800/30 border border-gray-700 p-10 rounded-3xl backdrop-blur-sm">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              We were tired of watching bettors lose money chasing picks from influencers with no accountability. We saw a need for a clean, disciplined, data-backed system that focused on <span className="text-white font-bold">transparency and long-term profitability</span>, not "locks" and unrealistic parlays.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              ProPickz started in a single Discord group, evolved through months of tracking, testing, and refining, and now delivers smart picks daily across all major sports. <span className="text-purple-400 font-bold">We built what we wished we had when we started betting.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* SECTION 4: WHAT MAKES US DIFFERENT */}
      <section className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">What Makes Us Different</h2>
            <p className="text-gray-400">See the difference between hype and value.</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* WHAT WE ARE NOT */}
            <Reveal delay={100} className="bg-red-900/10 border border-red-900/30 p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-red-500/20 p-3 rounded-full"><X className="text-red-500" size={24} /></div>
                <h3 className="text-2xl font-bold text-red-500">What We Are NOT</h3>
              </div>
              <ul className="space-y-4">
                {["TikTok 'Cappers' with fake lifestyles", "No tracked records or history", "Promoting unrealistic parlay lotteries", "Poor bankroll management advice"].map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-400">
                    <X className="text-red-900 shrink-0 mt-1" size={18} /> {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* WHAT WE ARE */}
            <Reveal delay={300} className="bg-green-900/10 border border-green-900/30 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle size={100} className="text-green-500" /></div>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-green-500/20 p-3 rounded-full"><CheckCircle className="text-green-500" size={24} /></div>
                <h3 className="text-2xl font-bold text-green-500">What We ARE</h3>
              </div>
              <ul className="space-y-4">
                {["Live tracked picks with verified history", "Real data-backed +EV strategies", "Bankroll-focused growth foundation", "Full refund guarantees if not profitable"].map((item, i) => (
                  <li key={i} className="flex gap-3 text-white font-medium">
                    <CheckCircle className="text-green-500 shrink-0 mt-1" size={18} /> {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA BANNER */}
      <section className="py-24 bg-black relative border-t border-gray-900">
        <div className="absolute inset-0 bg-purple-900/10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Smart Betting Starts With the <span className="text-purple-500">Right System.</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join ProPickz today and get access to our proven picks, transparent performance history, and a community that wins together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open('https://discord.gg/propickz', '_blank')}
                className="px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                Start Your Free Trial
              </button>
              <button
                onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
                className="px-10 py-5 bg-transparent border border-gray-700 text-white font-bold text-lg rounded-full hover:bg-gray-900 transition-colors"
              >
                View Membership Plans
              </button>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
};





// --- NEW TESTIMONIALS PAGE ---

const TestimonialsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 animate-fade-in-up">
          What Members <span className="text-purple-400">Say</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16 animate-fade-in-up delay-100">
          Real results from the ProPickz community.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900/50 backdrop-blur border border-gray-800 p-8 rounded-3xl text-left hover:border-purple-500/50 transition-colors animate-fade-in-up" style={{ animationDelay: `${200 + i * 100}ms` }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={16} className="text-yellow-500 fill-yellow-500" />)}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">"Honestly the transparency here is unmatched. I've tried other discords and they all delete losses. These guys own it and we still come out profitable."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {String.fromCharCode(65 + i)}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Member #{8291 + i}</div>
                  <div className="text-gray-500 text-xs">Verified Subscriber</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- NEW EV+ & ARBITRAGE PAGE ---

const EVPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Intense Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">

        {/* SECTION 1: INTRO */}
        <div className="text-center mb-24">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
              A Separate System. A Sharper Edge.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Same Membership.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
              ProPickz is powered by elite sports analysts — but we also believe in data doing its part. That’s why every Pro Membership includes access to the <strong className="text-white">ProPickz Bot</strong> — a fully automated system that tracks markets in real time and delivers its own exclusive stream of +EV and arbitrage picks, completely independent of our human team.
            </p>
          </Reveal>
        </div>

        {/* SECTION 2: +EV Picks */}
        <Reveal delay={300} className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp size={32} className="text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">+EV Picks: When the Numbers Beat the Books</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              The ProPickz Bot constantly monitors odds across major sportsbooks and compares them to our own probability models. When the bot finds a line that’s off — where the math shows positive expected value — it flags it and posts it to its own channel.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Only plays with a strong, quantifiable edge are sent out. No guesswork. No bias. Just value.
            </p>
            <div className="mt-6 flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
              <AlertCircle size={20} className="text-blue-400 shrink-0" />
              <p className="text-sm text-blue-200">
                If the edge doesn’t meet our threshold, the bot doesn’t post. Period.
              </p>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            {/* Visual simulation of bot scanning */}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>SCANNING MARKET_ID: 9942</span>
                <span className="text-green-500 font-mono">LIVE ●</span>
              </div>
              <div className="bg-black/50 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                <div>
                  <div className="text-white font-bold">KC Chiefs -3.5</div>
                  <div className="text-xs text-gray-500">Implied Prob: 52.4%</div>
                </div>
                <div className="text-right">
                  <div className="text-blue-400 font-bold">-105</div>
                  <div className="text-xs text-green-400">+4.2% EDGE</div>
                </div>
              </div>
              <div className="bg-black/50 p-4 rounded-xl border border-gray-800 flex justify-between items-center opacity-50">
                <div>
                  <div className="text-white font-bold">LAL Lakers ML</div>
                  <div className="text-xs text-gray-500">Implied Prob: 48.0%</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 font-bold">+115</div>
                  <div className="text-xs text-gray-600">NO EDGE</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* SECTION 3: Arbitrage Alerts */}
        <Reveal delay={400} className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 md:order-1 bg-gray-900/50 border border-gray-800 p-8 rounded-3xl relative overflow-hidden group hover:border-green-500/30 transition-colors">
            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">ARBITRAGE FOUND</span>
                <span className="text-gray-500 text-xs">0m 12s ago</span>
              </div>
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-gray-700">
                <div className="text-left">
                  <div className="text-gray-400 text-xs">Book A</div>
                  <div className="text-white font-bold">Over 215.5</div>
                  <div className="text-green-400 font-mono">+120</div>
                </div>
                <div className="h-8 w-px bg-gray-700"></div>
                <div className="text-right">
                  <div className="text-gray-400 text-xs">Book B</div>
                  <div className="text-white font-bold">Under 215.5</div>
                  <div className="text-green-400 font-mono">-110</div>
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg text-center">
                <span className="text-green-400 font-bold text-sm">GUARANTEED PROFIT: 3.8% ROI</span>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Activity size={32} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Arbitrage Alerts: Guaranteed Profit Across Books</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Sometimes, sportsbooks disagree enough for you to bet both sides and lock in a risk-free profit. The ProPickz Bot watches for these gaps. When it detects one, it sends an instant alert that includes:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={16} className="text-green-500" /> The books involved</li>
              <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={16} className="text-green-500" /> How to split your bets</li>
              <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={16} className="text-green-500" /> The ROI you’ll lock in</li>
              <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={16} className="text-green-500" /> How long the opportunity may last</li>
            </ul>
            <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
              <Zap size={16} /> These windows are rare and short — but when they hit, they’re pure upside.
            </div>
          </div>
        </Reveal>

        {/* SECTION 4: Full Log */}
        <Reveal delay={500} className="bg-gray-900/30 border border-gray-800 rounded-[2rem] p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard size={32} className="text-purple-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">A Full Log of Every Bot Pick</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            The bot doesn’t just post picks, it logs them all in an easily accessible table inside the server. You’ll always be able to see:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
              <span className="text-gray-300 font-bold block mb-1">Every Pick Made</span>
            </div>
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
              <span className="text-gray-300 font-bold block mb-1">Exact Odds</span>
            </div>
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
              <span className="text-gray-300 font-bold block mb-1">Timestamp</span>
            </div>
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
              <span className="text-gray-300 font-bold block mb-1">Final Result</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            This way, nothing is hidden. Every bet recommendation is fully transparent and available for review at any time.
          </p>
        </Reveal>

      </div>
    </div>
  );
};

const TrustPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-16 text-center animate-fade-in-up">
          Why You Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Trust Us.</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Transparency */}
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 p-8 rounded-3xl animate-fade-in-up delay-100 hover:border-green-500/50 transition-colors group">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Transparency</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Every pick is tracked and performance is openly reported. You see what we make. No hidden plays, no deleting history.
            </p>
            <button
              onClick={() => window.open('https://docs.google.com/spreadsheets/', '_blank')}
              className="flex items-center gap-2 text-sm font-bold text-green-400 hover:text-green-300 transition-colors border-b border-green-500/30 pb-1"
            >
              View Verified Spreadsheet <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Accountability */}
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 p-8 rounded-3xl animate-fade-in-up delay-200 hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <AlertCircle className="text-blue-500" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Accountability</h3>
            <p className="text-gray-400 leading-relaxed">
              We never hide losses. Both wins and setbacks are visible so you know exactly how we’re performing, not just the highlights. We own every result.
            </p>
          </div>

          {/* Consistency */}
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 p-8 rounded-3xl animate-fade-in-up delay-300 hover:border-purple-500/50 transition-colors group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="text-purple-500" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Consistency</h3>
            <p className="text-gray-400 leading-relaxed">
              Our system is built for the long run. Picks are logged daily with clear units, odds, and results, so you see a reliable track record instead of cherry-picked outcomes.
            </p>
          </div>

          {/* The Guarantee */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-8 rounded-3xl animate-fade-in-up delay-400 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <Shield className="text-white" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">The Guarantee</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              We back it up. If we don’t hit profit over the set timeframe, you don’t just walk away empty, you’re covered by our guarantee.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest">
              <CheckCircle size={12} /> Profit or Refund
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- 13. FREE TRIAL PAGE COMPONENT ---

const FreeTrialPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Background Glows */}
      {/* Intense Purple Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10 w-full">

        {/* Header */}
        <div className="text-center mb-16">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Try ProPickz Free for <span className="text-purple-500">7 Days.</span><br />
              If You Don’t Profit, the <span className="text-white">Next Month Is on Us.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              You win – or you don't pay. That's how confident we are in our system.
            </p>
          </Reveal>
        </div>

        {/* Dual Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">

          {/* Free Trial Card */}
          <Reveal delay={300} className="bg-[#0A0A0A] border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-colors flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gray-700 to-transparent opacity-50"></div>

            <h3 className="text-2xl font-black text-white mb-8 tracking-wide">FREE TRIAL</h3>

            <ul className="space-y-6 mb-10 flex-1">
              <li className="flex gap-4 text-gray-300">
                <CheckCircle className="text-green-500 shrink-0" size={24} />
                <span className="text-lg">Access to daily picks for all major sports</span>
              </li>
              <li className="flex gap-4 text-gray-300">
                <CheckCircle className="text-green-500 shrink-0" size={24} />
                <span className="text-lg">Entry to Discord betting community</span>
              </li>
              <li className="flex gap-4 text-gray-300">
                <CheckCircle className="text-green-500 shrink-0" size={24} />
                <span className="text-lg">No credit card required</span>
              </li>
            </ul>

            <button
              onClick={() => window.open('https://discord.gg/propickz', '_blank')}
              className="w-full py-4 bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-lg rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
            >
              Start Free Trial
            </button>
          </Reveal>

          {/* Pro Membership Card */}
          <Reveal delay={400} className="bg-[#0A0A0A] border border-purple-900/50 rounded-3xl p-8 hover:border-purple-500/50 transition-colors flex flex-col relative overflow-hidden group">
            {/* Glow Effect */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-colors"></div>

            <h3 className="text-2xl font-black text-white mb-8 tracking-wide">PRO MEMBERSHIP</h3>

            <ul className="space-y-6 mb-10 flex-1">
              <li className="flex gap-4 text-gray-300 items-start">
                <Info className="text-purple-500 shrink-0 mt-1" size={20} />
                <span className="text-lg">Full pick archive access</span>
              </li>
              <li className="flex gap-4 text-gray-300 items-start">
                <LayoutDashboard className="text-purple-500 shrink-0 mt-1" size={20} />
                <span className="text-lg">Advanced tracking dashboard</span>
              </li>
              <li className="flex gap-4 text-gray-300 items-start">
                <Zap className="text-purple-500 shrink-0 mt-1" size={20} />
                <span className="text-lg">Daily Picks + 35% off DFS</span>
              </li>
              <li className="flex gap-4 text-gray-300 items-start">
                <Layers className="text-purple-500 shrink-0 mt-1" size={20} />
                <span className="text-lg">Strategy education vault</span>
              </li>
            </ul>

            <button
              onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
              className="w-full py-4 bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-lg rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
            >
              Unlock Full Access
            </button>
          </Reveal>

        </div>

        {/* Footer Guarantee */}
        <Reveal delay={500} className="text-center">
          <p className="text-gray-400 text-lg">
            Profit or it’s free. If you don’t finish the month in profit, we’ll give you the next month on us. <span className="text-white font-bold">Simple.</span>
          </p>
        </Reveal>

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
      case 'FreeTrial': return <FreeTrialPage />;
      case 'Guarantee': return <GuaranteePage />;
      case 'Results': return <ResultsPage />;
      case 'HowItWorks': return <HowItWorksPage />;
      case 'SupportedSports': return <SupportedSportsPage />;
      case 'BettingAcademy': return <BettingAcademyPage />;
      case 'AboutUs': return <AboutUsPage />;
      case 'Trust': return <TrustPage />;
      case 'Testimonials': return <TestimonialsPage />;
      case 'EV': return <EVPage />;
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
