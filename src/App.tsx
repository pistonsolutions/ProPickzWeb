'use client'; // Ensures Next.js compatibility

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { ChevronDown, CheckCircle, X, Menu, Star, Shield, Zap, TrendingUp, Users, Target, MessageSquare, AlertCircle, Clock, Activity, LayoutDashboard, Layers, BookOpen, UserPlus, Gift, Trophy, Globe, Sparkles, Send, HelpCircle, ArrowUpRight, Smartphone, Wallet, LineChart, Info } from 'lucide-react';

// Firebase Imports
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import propickzLogo from './assets/propickzlogo.png';
import EarningsPopup from './components/EarningsPopup';
import ContactPage from './components/ContactPage';
import AsSeenOn from './components/AsSeenOn';
import Hero3DPhone from './components/Hero3DPhone';
import EducationVisual from './components/EducationVisual';
import ResultsDashboard from './components/ResultsDashboard';
import WinningSlips from './components/WinningSlips';
import SportsCarousel from './components/SportsCarousel';
import { Reveal } from './utils/Reveal';
import CommunityBenefits from './components/CommunityBenefits';
import AboutUsPage from './components/AboutUsPage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

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
  const { t } = useLanguage();

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all duration-500"></div>

      <h3 className="text-2xl font-bold text-white mb-2 relative z-10">{t('roi', 'Title')}</h3>
      <p className="text-gray-400 mb-8 text-sm relative z-10">{t('roi', 'Subtitle')}</p>

      <div className="mb-6 relative z-10">
        <div className="flex justify-between text-gray-400 mb-2 font-mono text-xs uppercase tracking-widest font-heading">
          <span>{t('roi', 'StartingBankroll')}</span>
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
          <div className="text-gray-500 text-xs font-bold uppercase mb-1">{t('roi', 'MonthlyProfit')}</div>
          <div className="text-3xl font-bold text-green-400 animate-pulse-slow">${parseInt(profit).toLocaleString()}</div>
        </div>
        <div className="bg-black/50 p-4 rounded-xl border border-gray-800">
          <div className="text-gray-500 text-xs font-bold uppercase mb-1">{t('roi', 'YearlyPotential')}</div>
          <div className="text-3xl font-bold text-white">${parseInt(yearly).toLocaleString()}</div>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-4 italic text-center">{t('roi', 'Disclaimer')}</p>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const faqs: FaqItem[] = [
    { q: t('faq', 'q1'), a: t('faq', 'a1') },
    { q: t('faq', 'q2'), a: t('faq', 'a2') },
    { q: t('faq', 'q3'), a: t('faq', 'a3') },
    { q: t('faq', 'q4'), a: t('faq', 'a4') },
    { q: t('faq', 'q5'), a: t('faq', 'a5') },
    { q: t('faq', 'q6'), a: t('faq', 'a6') },
    { q: t('faq', 'q7'), a: t('faq', 'a7') },
    { q: t('faq', 'q8'), a: t('faq', 'a8') },
  ];

  return (
    <section className="py-20 bg-black border-t border-gray-900">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-12">{t('faq', 'Headline')}</h2>
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
  const actions = ['joined the Free Server', 'hit a 5-leg parlay', 'upgraded to Lifetime', 'won $1,200 today'];

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
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([{ text: t('chat', 'Welcome'), sender: 'bot' }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Update initial message when language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return [{ text: t('chat', 'Welcome'), sender: 'bot' }];
      }
      return prev;
    });
  }, [t]);

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
              {t('chat', 'Analyst')}
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
              placeholder={t('chat', 'Placeholder')}
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
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const navGroups = {
    Platform: [
      { name: t('nav', 'Home'), action: () => setView('Home'), icon: <TrendingUp size={16} /> },
      // { name: 'EV+ & Arbitrage', action: () => setView('EV'), icon: <Activity size={16} /> },
      { name: t('nav', 'Result'), action: () => setView('Results'), icon: <CheckCircle size={16} /> },
      { name: t('nav', 'HowItWorks'), action: () => setView('HowItWorks'), icon: <Zap size={16} /> },
      { name: t('nav', 'SupportedSports'), action: () => setView('SupportedSports'), icon: <Trophy size={16} /> },
    ],
    Membership: [
      { name: t('nav', 'Pricing'), action: () => setView('Pricing'), icon: <Star size={16} /> },
      { name: t('nav', 'FreeTrial'), action: () => setView('FreeTrial'), icon: <Zap size={16} /> },
      { name: t('nav', 'Testimonials'), action: () => setView('Testimonials'), icon: <MessageSquare size={16} /> },
      { name: t('nav', 'Guarantee'), action: () => setView('Guarantee'), icon: <Shield size={16} /> },
    ],
    Resources: [
      { name: t('nav', 'AboutUs'), action: () => setView('AboutUs'), icon: <TrendingUp size={16} /> },
      { name: t('nav', 'Trust'), action: () => setView('Trust'), icon: <CheckCircle size={16} /> },
      { name: t('nav', 'FAQ'), action: () => setView('FAQ'), icon: <HelpCircle size={16} /> },
      { name: t('nav', 'Legal'), action: () => setView('Legal'), icon: <MessageSquare size={16} /> },
    ]
  };

  return (
    <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-gray-800" onMouseLeave={() => setActiveDropdown(null)}>
      <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">

        {/* Left Side: Contact Us + Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setView('Contact')}
            className="text-gray-400 hover:text-purple-400 text-sm font-medium transition-colors hidden md:block"
          >
            {t('nav', 'Contact')}
          </button>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setView('Home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
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
                {t('nav', group as any) || group}
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
          <button onClick={toggleLanguage} className="p-2 text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-heading text-sm uppercase">
            <Globe size={18} /> {language}
          </button>
          <button onClick={() => window.open('https://discord.gg/propickz', '_blank')} className="px-5 py-2 border border-purple-500 text-purple-400 text-sm font-bold rounded-lg hover:bg-purple-500/10 transition shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            {t('nav', 'JoinDiscord')}
          </button>
          <button onClick={() => setView('Pricing')} className="px-5 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            {t('nav', 'ViewPricing')}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800 absolute w-full left-0 top-24 p-4 flex flex-col gap-4 animate-fade-in-up h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <button onClick={() => { setView('Home'); setMobileMenuOpen(false); }} className="text-left text-white font-bold">{t('nav', 'Home')}</button>
            <button onClick={toggleLanguage} className="p-2 text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-heading text-sm uppercase border border-gray-700 rounded-lg">
              <Globe size={16} /> {language === 'en' ? 'English' : 'Français'}
            </button>
          </div>

          {Object.entries(navGroups).map(([group, items]) => (
            <div key={group} className="py-2">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest font-heading mb-2 px-2">{t('nav', group as any) || group}</div>
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
              {t('nav', 'JoinDiscord')}
            </button>
            <button onClick={() => { setView('Pricing'); setMobileMenuOpen(false); }} className="w-full py-3 bg-white text-black font-bold rounded-xl">
              {t('nav', 'ViewPricing')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-black border-t border-gray-900 py-12 text-center text-gray-600 text-sm">
      <p>{t('footer', 'Copyright')}<br /> {t('footer', 'Disclaimer')}</p>
    </footer>
  );
};

// --- 4. HOMEPAGE COMPONENT ---

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  const [unitsRef, unitsVal] = useCountUp(214.5, 2000);
  const [membersRef, membersVal] = useCountUp(1250, 2000);

  const [aiTip, setAiTip] = useState("");
  const [loadingTip, setLoadingTip] = useState(false);
  const { t } = useLanguage();

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/50 text-purple-300 text-xs font-bold uppercase tracking-widest font-heading animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {t('hero', 'SystemLive')}
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tight animate-fade-in-up delay-100">
              {t('hero', 'Stop')}<br />
              <span className="text-red-500 shake-text drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">{t('hero', 'Gambling')}</span><br />
              {t('hero', 'Start')}<br />
              <span className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">{t('hero', 'Investing')}</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-lg leading-relaxed animate-fade-in-up delay-200">
              {t('hero', 'Subheadline')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <button
                onClick={() => navigateTo('Pricing')}
                className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group"
              >
                {t('hero', 'StartFreeTrial')} <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button
                onClick={() => navigateTo('Guarantee')}
                className="px-8 py-4 bg-transparent border border-gray-700 text-white rounded-full font-bold text-lg hover:bg-gray-900 hover:border-white transition-all flex items-center justify-center gap-2"
              >
                <Shield size={20} fill="currentColor" /> {t('hero', 'WatchDemo')}
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
              <p><span className="text-white font-bold">2,400+</span> {t('hero', 'MembersWinning')}</p>
            </div>
          </div>

          {/* Right: 3D Interactive Hero */}
          <Hero3DPhone />
        </div>
      </section>

      {/* AS SEEN ON */}
      <AsSeenOn />

      {/* 2. THE PROBLEM/SOLUTION */}
      <section className="py-24 bg-black relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('features', 'MostBettors')} <span className="text-red-500">{t('features', 'Guessing')}</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('features', 'ProblemSub')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card glass-card-hover p-8 rounded-3xl group relative overflow-hidden">
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <X size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('features', 'Fan')}</h3>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li className="flex gap-2"><X size={16} /> {t('features', 'Fan1')}</li>
                <li className="flex gap-2"><X size={16} /> {t('features', 'Fan2')}</li>
                <li className="flex gap-2"><X size={16} /> {t('features', 'Fan3')}</li>
                <li className="mt-4 pt-4 border-t border-gray-800 text-red-400 font-bold">{t('features', 'FanResult')}</li>
              </ul>
            </div>

            <div className="glass-card border-purple-500/50 p-8 rounded-3xl transform md:-translate-y-6 shadow-[0_0_50px_rgba(147,51,234,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">YOU</div>
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-600/50">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{t('features', 'ProSystem')}</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex gap-2"><CheckCircle size={16} className="text-green-400" /> {t('features', 'Pro1')}</li>
                <li className="flex gap-2"><CheckCircle size={16} className="text-green-400" /> {t('features', 'Pro2')}</li>
                <li className="flex gap-2"><CheckCircle size={16} className="text-green-400" /> {t('features', 'Pro3')}</li>
                <li className="mt-4 pt-4 border-t border-purple-500/30 text-green-400 font-bold text-lg">{t('features', 'ProResult')}</li>
              </ul>

              {/* GEMINI INTEGRATION: MINDSET TIP */}
              <div className="mt-6 p-4 bg-purple-950/50 rounded-xl border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} /> {t('features', 'AiCoach')}
                  </span>
                </div>
                <p className="text-sm text-gray-300 min-h-[40px]">
                  {loadingTip ? t('features', 'AiAnalyzing') : (aiTip || t('features', 'AiDefault'))}
                </p>
                <button
                  onClick={generateAiTip}
                  disabled={loadingTip}
                  className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loadingTip ? t('features', 'Generating') : t('features', 'GenerateTip')}
                </button>
              </div>

            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl hover:border-red-500/50 transition-colors group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('features', 'Tout')}</h3>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li className="flex gap-2"><X size={16} /> {t('features', 'Tout1')}</li>
                <li className="flex gap-2"><X size={16} /> {t('features', 'Tout2')}</li>
                <li className="flex gap-2"><X size={16} /> {t('features', 'Tout3')}</li>
                <li className="mt-4 pt-4 border-t border-gray-800 text-gray-400 font-bold">{t('features', 'ToutResult')}</li>
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
              {t('roi', 'Badge')}
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 whitespace-pre-line">{t('roi', 'Headline')}</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              {t('roi', 'Subheadline')}
            </p>
            <div className="flex gap-8">
              <div>
                <div className="text-4xl font-bold text-white mb-1" ref={unitsRef}>+{unitsVal.toFixed(1)}u</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest font-heading">{t('roi', 'ProfitYTD')}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1" ref={membersRef}>{membersVal.toFixed(0)}+</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest font-heading">{t('roi', 'ActiveMembers')}</div>
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
        <h3 className="text-center text-2xl font-bold text-white mb-12">{t('testimonials', 'Headline')}</h3>
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
                        <div className="text-gray-500 text-xs">{t('testimonials', 'Verified')}</div>
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
          <div className="order-2 lg:order-1 relative group">
            <EducationVisual />
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight whitespace-pre-line">
                {t('learning', 'Headline')}
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-gray-400 leading-relaxed">
                {t('learning', 'Subheadline')}
              </p>
            </Reveal>

            <div className="space-y-6">
              {[
                {
                  icon: <Wallet className="text-green-400" size={24} />,
                  title: t('learning', 'BankrollTitle'),
                  desc: t('learning', 'BankrollDesc')
                },
                {
                  icon: <LineChart className="text-blue-400" size={24} />,
                  title: t('learning', 'EdgeTitle'),
                  desc: t('learning', 'EdgeDesc')
                },
                {
                  icon: <Users className="text-purple-400" size={24} />,
                  title: t('learning', 'StrategyTitle'),
                  desc: t('learning', 'StrategyDesc')
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">30-Day Money Back Guarantee. If You Don’t Profit, We Pay You.</h2>
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
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-heading shadow-lg shadow-purple-600/50">
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
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        {/* Header */}
        <Reveal>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            {t('pricing', 'HeadlineStart')} <span className="text-green-500">{t('pricing', 'HeadlineGreen')}</span><br className="hidden md:block" /> {t('pricing', 'HeadlineMid')} <span className="text-purple-500">{t('pricing', 'HeadlinePurple')}</span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16">
            {t('pricing', 'Subheadline')}
          </p>
        </Reveal>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">

          {/* FREE PLAN */}
          <Reveal delay={300} className="glass-card glass-card-hover flex flex-col text-left p-6 rounded-3xl">
            <h3 className="text-xl font-bold text-gray-400 mb-2">{t('pricing', 'FreePlan')}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-300 text-sm"><Gift className="text-yellow-500 shrink-0" size={18} /> Entry to Monthly Lottery (Win Cash)</li>
              <li className="flex gap-3 text-gray-300 text-sm"><TrendingUp className="text-green-500 shrink-0" size={18} /> Access to 5-0 Free Picks Run</li>
              <li className="flex gap-3 text-gray-300 text-sm"><LayoutDashboard className="text-blue-500 shrink-0" size={18} /> Access to Results Tracker</li>
              <li className="flex gap-3 text-gray-500 text-sm italic">Great way to test ProPickz</li>
            </ul>
            <button
              onClick={() => window.open('https://discord.gg/propickz', '_blank')}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors"
            >
              {t('pricing', 'FreeCTA')}
            </button>
          </Reveal>

          {/* PRO PLAN - GLOWING/HIGHLIGHTED */}
          <Reveal delay={400} className="bg-black border border-purple-500 rounded-3xl p-6 relative shadow-[0_0_40px_rgba(147,51,234,0.3)] transform md:scale-105 z-10 flex flex-col text-left animate-border-beam">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-heading shadow-lg">
              {t('pricing', 'MostPopular')}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t('pricing', 'ProPlan')}</h3>
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
              {t('pricing', 'MonthlyCTA')}
            </button>
          </Reveal>

          {/* QUARTERLY PLAN */}
          <Reveal delay={500} className="glass-card glass-card-hover flex flex-col text-left p-6 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-2">{t('pricing', 'Quarterly')}</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$189</span>
              <span className="text-gray-500">/qtr</span>
            </div>
            <p className="text-green-400 text-xs font-bold mb-6">Save 15% vs Monthly</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> All Pro Features included</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Star className="text-purple-500 shrink-0" size={18} /> Priority Support</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Users className="text-purple-500 shrink-0" size={18} /> Exclusive Discord Channels</li>
            </ul>
            <button
              onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
              className="w-full py-3 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-colors"
            >
              {t('pricing', 'QuarterlyCTA')}
            </button>
          </Reveal>

          {/* ANNUAL PLAN */}
          <Reveal delay={600} className="glass-card glass-card-hover flex flex-col text-left p-6 rounded-3xl border border-yellow-500/20">
            <div className="absolute top-0 right-0 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-wider">
              Best Value
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t('pricing', 'Yearly')}</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$649</span>
              <span className="text-gray-500">/yr</span>
            </div>
            <p className="text-green-400 text-xs font-bold mb-6">Save 33% vs Monthly</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Full Access for 12 Months</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Trophy className="text-green-500 shrink-0" size={18} /> Perfect for serious bettors</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Target className="text-green-500 shrink-0" size={18} /> Long-term strategy focus</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Shield className="text-green-500 shrink-0" size={18} /> Maximize Bankroll Growth</li>
            </ul>
            <button
              onClick={() => window.open('https://www.winible.com/propickz', '_blank')}
              className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              {t('pricing', 'AnnualCTA')}
            </button>
          </Reveal>

        </div>

        {/* Benefits / Lottery Widget */}
        <Reveal delay={700}>
          <CommunityBenefits />
        </Reveal>

        <Reveal delay={500}>
          <div className="text-center">
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('pricing', 'Guarantee')}
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
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* NEW HERO: 3-STEP FLOW */}
        <div className="mb-32 text-center">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-12">
              {t('steps', 'Title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{t('steps', 'TitleHighlight')}</span>
            </h1>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: <UserPlus className="text-purple-400" size={32} />, title: t('steps', 'Sub1'), desc: t('steps', 'Desc1') },
              { icon: <Zap className="text-blue-400" size={32} />, title: t('steps', 'Sub2'), desc: t('steps', 'Desc2') },
              { icon: <TrendingUp className="text-green-400" size={32} />, title: t('steps', 'Sub3'), desc: t('steps', 'Desc3') },
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
              {t('steps', 'SamplePick')} <ChevronDown size={20} />
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
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-heading border border-green-500/30">
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
              {t('steps', 'EngineTitle')}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
              {t('steps', 'EngineDesc')}
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
              <h3 className="text-3xl font-bold text-white mb-4">{t('steps', 'Step1Title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('steps', 'Step1Desc')}
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
                <div className="font-mono text-xs text-purple-300 mb-4 text-center">&gt;&gt; HYBRID_MODEL_ACTIVE...</div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-gray-500 text-xs mb-1">AI Projection</div>
                      <div className="text-lg font-bold text-white">Lakers -4</div>
                      <div className="text-xs text-gray-600">(Data Only)</div>
                    </div>
                    <div className="h-px w-12 bg-gray-700"></div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs mb-1">Analyst Adjustment</div>
                      <div className="text-lg font-bold text-blue-400">-1.5 Adjustment</div>
                      <div className="text-xs text-gray-600">(Injury Factor)</div>
                    </div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl text-center">
                    <div className="text-purple-400 font-bold text-sm">FINAL VERDICT: LAKERS -5.5</div>
                    <div className="text-gray-400 text-xs mt-1">Confirmed by Data & Human Expertise.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 mb-4">
                <Zap size={32} className="text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">{t('steps', 'Step2Title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('steps', 'Step2Desc')}
              </p>
            </div>
          </Reveal>

          {/* Step 3 */}
          <Reveal className="grid md:grid-cols-2 gap-12 items-center relative">
            <div className="md:text-right order-2 md:order-1">
              <div className="inline-block p-3 rounded-2xl bg-green-500/10 border border-green-500/30 mb-4">
                <Smartphone size={32} className="text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">{t('steps', 'Step3Title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('steps', 'Step3Desc')}
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
                  <div className="text-purple-400 text-xs font-bold mt-1">Hybrid Score: 9.8/10</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Trust Section */}
        <div className="mt-32 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-white mb-8">{t('trust', 'Title')}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900/30 p-8 rounded-2xl border border-gray-800">
                <h4 className="text-xl font-bold text-white mb-2">{t('trust', 'Card1Title')}</h4>
                <p className="text-gray-400 text-sm">{t('trust', 'Card1Desc')}</p>
              </div>
              <div className="bg-gray-900/30 p-8 rounded-2xl border border-gray-800">
                <h4 className="text-xl font-bold text-white mb-2">{t('trust', 'Card2Title')}</h4>
                <p className="text-gray-400 text-sm">{t('trust', 'Card2Desc')}</p>
              </div>
              <div className="bg-gray-900/30 p-8 rounded-2xl border border-gray-800">
                <h4 className="text-xl font-bold text-white mb-2">{t('trust', 'Card3Title')}</h4>
                <p className="text-gray-400 text-sm">{t('trust', 'Card3Desc')}</p>
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
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <div className="mb-12">
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

        {/* NEW CAROUSEL WIDGET */}
        <Reveal delay={300}>
          <SportsCarousel />
        </Reveal>

        <Reveal delay={600} className="mt-20 text-center bg-gray-900/30 border border-gray-800 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">More Leagues Added Constantly</h3>
          <p className="text-gray-400 mb-8">
            Our team is constantly building models for new markets including Horse Racing, E-Sports, and International Leagues. If there's an edge, we will find it.
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
  const { t } = useLanguage();

  const faqs: FaqItem[] = [
    { q: t('faq', 'q1'), a: t('faq', 'a1') },
    { q: t('faq', 'q2'), a: t('faq', 'a2') },
    { q: t('faq', 'q3'), a: t('faq', 'a3') },
    { q: t('faq', 'q4'), a: t('faq', 'a4') },
    { q: t('faq', 'q5'), a: t('faq', 'a5') },
    { q: t('faq', 'q6'), a: t('faq', 'a6') },
    { q: t('faq', 'q7'), a: t('faq', 'a7') },
    { q: t('faq', 'q8'), a: t('faq', 'a8') },
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              {t('faq', 'Headline').split(' ').map((word, i, arr) =>
                i === arr.length - 1 ? <span key={i} className="text-purple-500">{word}</span> : word + ' '
              )}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-400">
              {t('faq', 'Subtitle')}
            </p>
          </Reveal>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-colors group">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{faq.q}</span>
                  <ChevronDown className={`text-purple-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`px-6 text-gray-400 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="border-t border-gray-800 pt-4 mt-2">
                    {faq.a}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={600} className="mt-20 text-center">
          <p className="text-gray-500 mb-6">{t('faq', 'MoreQuestions')}</p>
          <button
            onClick={() => window.location.href = 'mailto:support@propickz.com'}
            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
          >
            {t('faq', 'ContactSupport')}
          </button>
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
              You win - or you don't pay. That's how confident we are in our system.
            </p>
          </Reveal>
        </div>

        {/* Dual Card Container */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">

          {/* Free Server Card */}
          <Reveal delay={300}>
            <div className="bg-[#0f1014] border border-gray-800 rounded-3xl p-8 flex flex-col h-full hover:border-gray-700 transition-colors">
              <h3 className="text-2xl font-black text-white mb-8 tracking-wide">FREE SERVER</h3>

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
                Join Free Community
              </button>
            </div>
          </Reveal>

          {/* Pro Membership Card */}
          <Reveal delay={400}>
            <div className="bg-[#0f1014] border border-gray-800 rounded-3xl p-8 flex flex-col h-full hover:border-purple-500/50 transition-colors relative overflow-hidden group">
              {/* Subtle purple glow for Pro */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/20 transition-colors"></div>

              <h3 className="text-2xl font-black text-white mb-8 tracking-wide">PRO MEMBERSHIP</h3>

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
                  <span className="text-gray-300 text-lg">Daily Picks + Exclusive Insights</span>
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

        {/* 1. Live Dashboard */}
        <div className="mb-24">
          <ResultsDashboard />
        </div>

        {/* 2. Winning Slips */}
        <div>
          <WinningSlips />
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
            <h2 className="text-2xl font-bold text-white mb-4">1. Informational Purposes Only - Not Financial or Gambling Advice</h2>
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
              ProPickz makes no guarantees, warranties, or representations - express or implied - regarding:
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
              <li>Any losses or damages of any kind - including but not limited to direct, indirect, incidental, consequential, punitive, exemplary, or special damages;</li>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest font-heading">
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
              30-Day <span className="text-purple-500">Money Back Guarantee.</span><br />
              <span className="text-white">Profit or We Refund You.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              You win - or you don't pay. That's how confident we are in our system.
            </p>
          </Reveal>
        </div>

        {/* Dual Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">

          {/* Free Trial Card */}
          <Reveal delay={300} className="bg-[#0A0A0A] border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-colors flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gray-700 to-transparent opacity-50"></div>

            <h3 className="text-2xl font-black text-white mb-8 tracking-wide">FREE SERVER</h3>

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
              Join Free Community
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
                <span className="text-lg">Daily Picks + Exclusive Insights</span>
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
      case 'Contact': return <ContactPage />;
      case 'Pricing': return <PricingPage />;
      case 'FreeTrial': return <FreeTrialPage />;
      case 'Guarantee': return <GuaranteePage />;
      case 'Results': return <ResultsPage />;
      case 'HowItWorks': return <HowItWorksPage />;
      case 'SupportedSports': return <SupportedSportsPage />;
      case 'AboutUs': return <AboutUsPage />;
      case 'Trust': return <TrustPage />;
      case 'Testimonials': return <TestimonialsPage />;
      // case 'EV': return <EVPage />;
      case 'FAQ': return <FAQPage />;
      case 'Legal': return <LegalPage />;
      default: return <div className="p-20 text-center text-white bg-black min-h-screen">Placeholder for {view}</div>;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
        <Navbar setView={setView} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        {/* Main Content */}
        <main className="relative z-10">
          {renderView()}
        </main>

        <Footer />


        {/* Earnings Popup */}
        <EarningsPopup />

        {/* Notifications - Only on Home */}
        {view === 'Home' && <FomoNotification />}

        {/* Chat Widget */}
        <ChatWidget />
      </div>
    </LanguageProvider>
  );
};

export default App;
