'use client'; // Ensures Next.js compatibility

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, X, Menu, Star, Shield, Zap, TrendingUp, Users, Target, MessageSquare, AlertCircle, Clock, Activity, LayoutDashboard, Layers, BookOpen, Gift, Trophy, Globe, Sparkles, Send, ArrowUpRight, Smartphone, Wallet, LineChart, ArrowRight, Lock } from 'lucide-react';

// Firebase Imports
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import propickzLogo from './assets/propickzlogo.png';
import pIcon from './assets/p_icon.png';
import CalculatorsPage from './pages/CalculatorsPage';
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
import HeroBackgroundIcons from './components/HeroBackgroundIcons';
import { reviews } from './data/reviews';
import FeatureTiles from './components/FeatureTiles';
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
  setView: (view: string) => void;
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
  const [unitSize, setUnitSize] = useState<number>(50);
  // Assume average +25 units per month
  const monthlyProfit = (unitSize * 24.5).toFixed(0);
  const yearlyPotential = (unitSize * 24.5 * 12).toFixed(0);
  const { t } = useLanguage();

  return (
    <div className="bg-[#0f1014] border border-gray-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500">
      {/* Vibrant Background Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] group-hover:bg-purple-600/30 transition-all duration-500 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10">
        <h3 className="text-3xl font-black text-white mb-2">{t('roi', 'Title')}</h3>
        <p className="text-gray-400 mb-8 text-sm">{t('roi', 'Subtitle')}</p>

        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="text-gray-400 font-bold text-xs uppercase tracking-widest font-heading mb-1">
                {t('roi', 'UnitSize')}
              </div>
              <div className="text-xs text-gray-500">
                {t('roi', 'UnitDefinition')}
              </div>
            </div>
            <div className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              ${unitSize}
            </div>
          </div>

          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={unitSize}
            onChange={(e) => setUnitSize(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-3 font-medium">
            <span>{t('roi', 'Min')}</span>
            <span>{t('roi', 'Max')}</span>
          </div>
        </div>

        <div className="mb-8 p-1">
          <ProfitGraph bankroll={unitSize * 100} />
          {/* Scaled for graph visual */}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-gray-900 to-black p-5 rounded-2xl border border-gray-800 relative overflow-hidden group/card shadow-lg">
            <div className="absolute inset-0 bg-green-500/5 group-hover/card:bg-green-500/10 transition-colors"></div>
            <div className="relative z-10">
              <div className="text-green-500/80 text-xs font-black uppercase tracking-wider mb-2">{t('roi', 'MonthlyProfit')}</div>
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                ${parseInt(monthlyProfit).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black p-5 rounded-2xl border border-gray-800 relative overflow-hidden group/card shadow-lg">
            <div className="absolute inset-0 bg-purple-500/5 group-hover/card:bg-purple-500/10 transition-colors"></div>
            <div className="relative z-10">
              <div className="text-purple-400/80 text-xs font-black uppercase tracking-wider mb-2">{t('roi', 'YearlyPotential')}</div>
              <div className="text-3xl md:text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                ${parseInt(yearlyPotential).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-600 mt-6 text-center italic border-t border-gray-800 pt-4">
          {t('roi', 'Disclaimer')}
        </p>
      </div>
    </div>
  );
};

const FomoNotification: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<FomoData>({ name: '', action: '' });
  const { t } = useLanguage();

  const names = [
    'Alex M.', 'Sarah K.', 'Davon J.', 'Mike R.', 'Chris P.',
    'Jordan T.', 'Emily W.', 'Marcus B.', 'Jessica L.', 'Ryan H.',
    'Kevin D.', 'Amanda S.', 'Tyler C.', 'Brandon M.', 'Ashley G.',
    'Justin F.', 'Rachel P.', 'Eric L.', 'Nicole K.', 'Matthew B.',
    'Daniel R.', 'Lauren H.', 'Joshua W.', 'Megan T.', 'Andrew S.'
  ];

  useEffect(() => {
    const trigger = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      // @ts-ignore
      const randomActionKey = `Action${Math.floor(Math.random() * 8) + 1}`;
      // @ts-ignore
      const randomAction = t('fomo', randomActionKey);

      setData({ name: randomName, action: randomAction });
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };

    // Initial trigger fast
    const initialTimer = setTimeout(trigger, 5000);

    // Then interval
    const interval = setInterval(trigger, 12000 + Math.random() * 8000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [t]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-4 md:left-8 z-50 bg-white dark:bg-gray-900 border border-purple-500/30 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-in-left max-w-sm">
      <div className="bg-black p-2 rounded-full border border-gray-800">
        <img src={propickzLogo} alt="Propickz" className="w-6 h-6 object-contain" />
      </div>
      <div>
        <div className="text-sm font-bold text-gray-900 dark:text-white">{data.name}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{data.action}</div>
      </div>
      <div className="text-xs text-gray-400 ml-auto">{t('fomo', 'JustNow')}</div>
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

interface NavbarInternalProps extends NavbarProps {
  currentView: string;
}

const Navbar: React.FC<NavbarInternalProps> = ({ setView, mobileMenuOpen, setMobileMenuOpen, currentView }) => {
  const { language, setLanguage, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('');
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const toggleLanguage = () => {
    // Cycle through EN -> FR -> ES -> EN
    if (language === 'en') setLanguage('fr');
    else if (language === 'fr') setLanguage('es');
    else setLanguage('en');
  };

  const scrollToSection = (sectionId: string) => {
    // If not on home, navigate to home first
    if (currentView !== 'Home') {
      setView('Home');
      // Wait for view to change, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 96;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 96;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  // Scroll Spy Effect
  useEffect(() => {
    if (currentView !== 'Home') {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // Offset for header height

      const sections = navLinks
        .filter(link => link.type === 'scroll' && link.anchor)
        .map(link => link.anchor as string);

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            return; // Found the active section
          }
        }
      }
      // If we scroll past the last section or before the first relevant one
      // Optionally handle 'hero' or clear active section
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]); // Re-run when view changes

  const goHome = () => {
    setView('Home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: t('nav', 'Reviews'), anchor: 'testimonials', type: 'scroll' },
    { name: t('nav', 'HowItWorks'), anchor: 'how-it-works', type: 'scroll' },
    { name: t('nav', 'Guarantee'), anchor: 'guarantee', type: 'scroll' },
    { name: t('nav', 'Result'), page: 'Results', type: 'page' },
    {
      name: t('nav', 'Resources'),
      type: 'dropdown',
      subItems: [
        { name: t('nav', 'Calculators'), page: 'Calculators', type: 'page' },
        { name: t('nav', 'FAQ'), page: 'FAQ', type: 'page' },
        { name: t('nav', 'Legal'), page: 'Legal', type: 'page' },
      ]
    },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.type === 'scroll' && link.anchor) {
      scrollToSection(link.anchor);
    } else if (link.type === 'page' && link.page) {
      setView(link.page);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between relative z-10">
        {/* Left: P Icon */}
        <div className="flex items-center">
          <div className="cursor-pointer group" onClick={goHome}>
            <img src={pIcon} alt="Propickz" className="h-14 w-14 object-contain group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            if (link.type === 'dropdown' && link.subItems) {
              return (
                <div key={link.name} className="relative group">
                  <button
                    className={`text-sm font-semibold transition-all hover:scale-105 flex items-center gap-1 text-gray-300 hover:text-white group-hover:text-white`}
                  >
                    {link.name}
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex flex-col p-1">
                      {link.subItems.map((sub) => (
                        <button
                          key={sub.page}
                          onClick={() => { setView(sub.page!); }}
                          className={`text-left px-4 py-3 text-sm font-semibold hover:bg-white/10 rounded-lg transition-colors ${currentView === sub.page ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white'}`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            const isActive = link.type === 'scroll'
              ? activeSection === link.anchor
              : currentView === link.page;

            return (
              <button
                key={link.anchor || link.page}
                onClick={() => handleNavClick(link as any)}
                className={`text-sm font-semibold transition-all hover:scale-105 relative group ${isActive
                  ? 'text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                  : 'text-gray-300 hover:text-white'
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
              </button>
            );
          })}
        </div>


        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggleLanguage} className="px-3 py-1.5 text-gray-300 hover:text-white transition-all flex items-center gap-2 font-semibold text-sm uppercase bg-white/5 rounded-lg hover:bg-white/10 border border-purple-500/20">
            <Globe size={16} /> {language === 'en' ? 'EN' : language === 'fr' ? 'FR' : 'ES'}
          </button>
          <button onClick={() => window.open('https://discord.gg/propickz', '_blank')} className="px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all hover:scale-105">
            {t('nav', 'JoinDiscord')}
          </button>
          <button onClick={() => scrollToSection('pricing')} className="px-5 py-2 bg-gradient-to-r from-amber-500/10 to-yellow-600/10 backdrop-blur-sm border border-amber-500/30 text-amber-200 text-sm font-bold rounded-lg hover:bg-amber-500/20 transition-all hover:scale-105 shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]">
            {t('nav', 'ViewPricing')}
          </button>
        </div>

        <button className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-3xl border-t border-purple-500/20 absolute w-full left-0 top-20 p-6 flex flex-col gap-4 animate-fade-in-up h-[calc(100vh-5rem)] overflow-y-auto z-50">
          {navLinks.map(link => {
            if (link.type === 'dropdown' && link.subItems) {
              return (
                <div key={link.name} className="flex flex-col">
                  <button
                    onClick={() => setResourcesOpen(!resourcesOpen)}
                    className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl text-lg p-4 text-left font-bold transition-all border border-transparent hover:border-white/5 flex justify-between items-center"
                  >
                    {link.name}
                    {resourcesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {resourcesOpen && (
                    <div className="flex flex-col ml-4 border-l border-gray-800 pl-4 mt-2 gap-2">
                      {link.subItems.map(sub => (
                        <button
                          key={sub.page}
                          onClick={() => { setView(sub.page!); setMobileMenuOpen(false); }}
                          className="text-gray-400 hover:text-white text-base p-3 text-left font-semibold hover:bg-white/5 rounded-lg transition-all"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={link.anchor || link.page}
                onClick={() => handleNavClick(link as any)}
                className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl text-lg p-4 text-left font-bold transition-all border border-transparent hover:border-white/5"
              >
                {link.name}
              </button>
            );
          })}


          <div className="mt-auto pb-8 flex flex-col gap-4">
            <button onClick={toggleLanguage} className="w-full py-4 text-white font-bold bg-white/5 rounded-xl border border-white/10 flex items-center justify-center gap-2">
              <Globe size={20} /> {language === 'en' ? 'English' : language === 'fr' ? 'Français' : 'Español'}
            </button>
            <button onClick={() => window.open('https://discord.gg/propickz', '_blank')} className="w-full py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20">
              {t('nav', 'JoinDiscord')}
            </button>
            <button onClick={() => scrollToSection('pricing')} className="w-full py-4 bg-white text-black font-bold rounded-xl shadow-lg">
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
    <footer className="bg-black border-t border-gray-900 py-12 text-center">
      <div className="max-w-7xl mx-auto px-4">
        {/* Newsletter Section */}
        <div className="mb-16 border-b border-gray-800 pb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 tracking-tight">
            {t('newsletter', 'Headline')}
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            {t('newsletter', 'Subheadline')}
          </p>

          <form className="max-w-md mx-auto relative group" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder={t('newsletter', 'Placeholder')}
              className="w-full pl-6 pr-44 py-4 bg-gray-900/50 border border-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all backdrop-blur-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-full font-bold transition-all flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
            >
              {t('newsletter', 'Button')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Copyright & Disclaimer */}
        <p className="text-gray-600 text-sm">
          {t('footer', 'Copyright')}<br /> {t('footer', 'Disclaimer')}
        </p>
      </div>
    </footer>
  );
};

// --- 4. HOMEPAGE COMPONENT ---

const HomePage: React.FC<HomePageProps> = ({ setView }) => {
  const [unitsRef, unitsVal] = useCountUp(214.5, 2000);
  const [membersRef, membersVal] = useCountUp(1250, 2000);
  const { t } = useLanguage();

  return (
    <div className="overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative min-h-screen flex items-center pt-24 md:pt-20 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-600/30 rounded-full blur-[80px] md:blur-[120px] pointer-events-none animate-pulse-slow"></div>
        <HeroBackgroundIcons />

        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          {/* Left: Copy & CTA */}
          <div className="text-left space-y-6 md:space-y-8 pt-10 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-500/50 text-cyan-300 text-xs font-bold uppercase tracking-widest font-heading animate-fade-in-up shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
              {t('hero', 'SystemLive')}
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[0.95] md:leading-[0.9] tracking-tight animate-fade-in-up delay-100">
              {t('proofSection', 'HeadlineStart')} <span className="text-green-500 animate-glow-vertical">{t('proofSection', 'HeadlineProof')}</span>,<br />
              {t('proofSection', 'HeadlineNot')} <span className="text-red-500 animate-glow-vertical-red">{t('proofSection', 'HeadlinePromises')}.</span>
            </h1>

            <p className="text-xl text-purple-200 max-w-lg leading-relaxed animate-fade-in-up delay-200 animate-ambient-glow">
              {t('proofSection', 'Subheadline')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <button
                onClick={() => {
                  const el = document.getElementById('pricing');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group"
              >
                {t('hero', 'StartFreeTrial')} <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button
                onClick={() => setView('Results')}
                className="px-8 py-4 bg-transparent border border-gray-700 text-white rounded-full font-bold text-lg hover:bg-gray-900 hover:border-white transition-all flex items-center justify-center gap-2"
              >
                <Shield size={20} fill="currentColor" /> {t('hero', 'WatchDemo')}
              </button>
            </div>


          </div>

          {/* Right: 3D Interactive Hero */}
          <Hero3DPhone />
        </div>
      </section>

      {/* AS SEEN ON */}
      <AsSeenOn />



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
            <div className="flex gap-12">
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 tracking-tight" ref={unitsRef}>+{unitsVal.toFixed(1)}u</div>
                <div className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold font-heading">{t('roi', 'ProfitYTD')}</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 tracking-tight" ref={membersRef}>{Math.floor(membersVal).toLocaleString()}+</div>
                <div className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold font-heading">{t('roi', 'ActiveMembers')}</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <ROICalculator />
          </div>
        </div>
      </section>

      {/* 4. SOCIAL PROOF WALL */}
      <section id="testimonials" className="py-24 bg-black border-y border-gray-900 overflow-hidden relative">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-purple-900/10 blur-[100px] pointer-events-none"></div>

        <div className="text-center mb-16 relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-xs uppercase tracking-widest mb-4">
            {t('testimonials', 'Badge')}
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
            {t('testimonials', 'HeadlineStart')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600 animate-text-shimmer">{t('testimonials', 'HeadlineHighlight')}</span>
          </h3>
        </div>

        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex gap-8 group-hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, setIndex) => (
              <React.Fragment key={setIndex}>
                {reviews.map((review, i) => (
                  <div
                    key={`${setIndex}-${i}`}
                    className="w-[400px] p-8 bg-[#0f1014] rounded-3xl border border-gray-800 flex-shrink-0 hover:border-purple-500 hover:bg-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] cursor-default group/card"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${review.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {review.avatarLetter}
                      </div>
                      <div>
                        <div className="text-white font-bold text-base flex items-center gap-2">
                          {review.user.replace('Discord User', t('testimonials', 'DiscordUser'))}
                          {review.verified && <CheckCircle size={16} className="text-blue-500" />}
                        </div>
                        <div className="text-gray-500 text-xs uppercase tracking-wide font-bold">{t('testimonials', 'Verified')}</div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-lg leading-relaxed whitespace-normal mb-6 group-hover/card:text-white transition-colors">
                      "{t('testimonials', `Review${review.id}`)}"
                    </p>

                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} size={18} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Fade Masks */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
        </div>
      </section>

      {/* 5. FEATURE TILES */}
      <FeatureTiles />




      {/* 7. PRICING SECTION */}
      <section id="pricing" className="py-24 bg-black relative border-t border-gray-900">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                {t('membershipComparison', 'HeadlineStart')} <span className="text-green-400">{t('membershipComparison', 'HeadlineFree')}</span>. <br />
                {t('membershipComparison', 'HeadlineCommitting')} <span className="text-purple-400">{t('membershipComparison', 'HeadlineProfitable')}</span>.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-gray-400 text-lg leading-relaxed">
                {t('membershipComparison', 'Subheadline')}
              </p>
            </Reveal>
          </div>

          {/* Tiers Grid */}
          <div className="grid lg:grid-cols-3 gap-8">

            {/* TIER 1: Community Access (Free) */}
            <Reveal delay={100} className="flex flex-col h-full p-8 rounded-[2rem] border border-white/10 bg-[#0f1014] hover:border-white/20 transition-all duration-300 relative group">
              <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4">{t('membershipComparison', 'CommunityAccess')}</div>
              <div className="text-4xl font-black text-white mb-2">{t('membershipComparison', 'Free')}</div>
              <p className="text-gray-500 text-sm mb-8 h-12">{t('membershipComparison', 'FreeDesc')}</p>

              <div className="space-y-4 mb-8 flex-1">
                <div className="flex gap-3 text-sm text-gray-300">
                  <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{t('membershipComparison', 'FreeFeature1')}</span>
                </div>
                <div className="flex gap-3 text-sm text-gray-300">
                  <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{t('membershipComparison', 'FreeFeature2')}</span>
                </div>
                <div className="flex gap-3 text-sm text-gray-300">
                  <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{t('membershipComparison', 'FreeFeature3')}</span>
                </div>
              </div>

              <div className="mt-auto">
                <button className="w-full py-4 rounded-xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 hover:scale-[1.02] transition-all">
                  {t('membershipComparison', 'FreeCTA')} →
                </button>
                <p className="text-center text-[11px] text-gray-500 mt-3 font-medium">{t('membershipComparison', 'FreeFooter')}</p>
              </div>
            </Reveal>

            {/* TIER 2: Pro Access - Monthly */}
            <Reveal delay={200} className="flex flex-col h-full p-8 rounded-[2rem] border-2 border-purple-500/20 bg-[#0f1014] hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] transition-all duration-300 relative group">
              <div className="text-purple-400 font-bold uppercase tracking-wider text-xs mb-4">{t('membershipComparison', 'ProMonthly')}</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-white">{t('membershipComparison', 'ProMonthlyCost')}</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
              <p className="text-gray-400 text-sm mb-8 h-12">{t('membershipComparison', 'ProMonthlyDesc')}</p>

              <div className="space-y-4 mb-8 flex-1">
                <div className="flex gap-3 text-sm text-white font-medium">
                  <Zap size={18} className="text-purple-500 shrink-0 mt-0.5" />
                  <span>{t('membershipComparison', 'ProFeature1')}</span>
                </div>
                <div className="flex gap-3 text-sm text-white font-medium">
                  <MessageSquare size={18} className="text-purple-500 shrink-0 mt-0.5" />
                  <span>{t('membershipComparison', 'ProFeature2')}</span>
                </div>
                <div className="flex gap-3 text-sm text-white font-medium">
                  <Users size={18} className="text-purple-500 shrink-0 mt-0.5" />
                  <span>{t('membershipComparison', 'ProFeature3')}</span>
                </div>
                <div className="flex gap-3 text-sm text-white font-medium">
                  <BookOpen size={18} className="text-purple-500 shrink-0 mt-0.5" />
                  <span>{t('membershipComparison', 'ProFeature4')}</span>
                </div>
                <p className="text-xs text-purple-400 italic pt-2">{t('membershipComparison', 'ProQuote')}</p>
              </div>

              <div className="mt-auto">
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all">
                  {t('membershipComparison', 'ProMonthlyCTA')} →
                </button>
                <p className="text-center text-[11px] text-gray-500 mt-3 font-medium">{t('membershipComparison', 'ProMonthlyFooter')}</p>
              </div>
            </Reveal>

            {/* TIER 3: Pro Access - Yearly (Most Disciplined) */}
            <Reveal delay={300} className="flex flex-col h-full p-8 rounded-[2rem] border border-amber-500/20 bg-[#0f1014] hover:border-amber-500/40 hover:shadow-[0_0_40px_rgba(234,179,8,0.1)] transition-all duration-300 relative group overflow-hidden">
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-black uppercase px-3 py-1.5 rounded-bl-xl">
                {t('membershipComparison', 'ProYearlyBadge')}
              </div>

              <div className="text-amber-400 font-bold uppercase tracking-wider text-xs mb-4">{t('membershipComparison', 'ProYearly')}</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-white">{t('membershipComparison', 'ProYearlyCost')}</span>
                <span className="text-gray-500 text-sm">/yr</span>
              </div>
              <p className="text-gray-400 text-sm mb-8 h-12">{t('membershipComparison', 'ProYearlyDesc')}</p>

              <div className="space-y-4 mb-8 flex-1">
                <div className="flex gap-3 text-sm text-white font-medium">
                  <CheckCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{t('membershipComparison', 'ProYearlyFeature1')}</span>
                </div>
                <div className="flex gap-3 text-sm text-white font-medium">
                  <Lock size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{t('membershipComparison', 'ProYearlyFeature2')}</span>
                </div>
                <div className="flex gap-3 text-sm text-white font-medium">
                  <Target size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{t('membershipComparison', 'ProYearlyFeature3')}</span>
                </div>
                <p className="text-xs text-amber-500/80 italic pt-2">{t('membershipComparison', 'ProYearlyQuote')}</p>
              </div>

              <div className="mt-auto">
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-[1.02] transition-all">
                  {t('membershipComparison', 'ProYearlyCTA')} →
                </button>
                <p className="text-center text-[11px] text-gray-500 mt-3 font-medium">{t('membershipComparison', 'ProYearlyFooter')}</p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>


      {/* 8. MEMBER LOTTERY SECTION */}
      <section className="py-24 bg-black relative border-t border-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: Content */}
          <div className="space-y-8">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                {t('rewardPool', 'Title')} <span className="text-yellow-400">{t('rewardPool', 'TitleHighlight')}</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                {t('rewardPool', 'Description')}
              </p>
            </Reveal>

            <Reveal delay={200} className="space-y-6">
              <div className="bg-[#0f1014] border border-white/5 p-6 rounded-2xl group hover:border-purple-500/20 transition-colors">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Gift size={20} className="text-purple-400" /> {t('rewardPool', 'WhatItIs')}
                </h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" /> {t('rewardPool', 'WhatItIs1')}</li>
                  <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" /> {t('rewardPool', 'WhatItIs2')}</li>
                  <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" /> {t('rewardPool', 'WhatItIs3')}</li>
                </ul>
              </div>

              <div className="bg-[#0f1014] border border-white/5 p-6 rounded-2xl group hover:border-red-500/20 transition-colors">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <AlertCircle size={20} className="text-red-400" /> {t('rewardPool', 'WhatNot')}
                </h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /> {t('rewardPool', 'WhatNot1')}</li>
                  <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /> {t('rewardPool', 'WhatNot2')}</li>
                  <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /> {t('rewardPool', 'WhatNot3')}</li>
                </ul>
              </div>
            </Reveal>
          </div>

          {/* RIGHT: Live Data Card */}
          <Reveal delay={300}>
            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2rem] border border-yellow-500/20 relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.1)] group hover:shadow-[0_0_80px_rgba(234,179,8,0.2)] transition-all duration-500">
              <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-black uppercase px-3 py-1.5 rounded-bl-xl font-heading tracking-wider">
                {t('rewardPool', 'LiveTracker')}
              </div>

              <div className="text-center mb-10 pt-6">
                <div className="text-yellow-500/80 font-bold text-xs uppercase tracking-[0.2em] mb-3">{t('rewardPool', 'CurrentPot')}</div>
                <div className="text-6xl md:text-7xl font-black text-white mb-3 drop-shadow-[0_0_25px_rgba(234,179,8,0.4)] font-heading">
                  $4,250
                </div>
                <div className="text-gray-500 text-[10px] uppercase tracking-wide font-medium">{t('rewardPool', 'GrowingDaily')}</div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-gray-400 text-sm font-medium">{t('rewardPool', 'LastWinner')}</span>
                  <span className="text-white font-mono font-bold">@jason_k <span className="text-green-400 ml-1">(+$2,100)</span></span>
                </div>
                <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-gray-400 text-sm font-medium">{t('rewardPool', 'NextDraw')}</span>
                  <span className="text-yellow-400 font-bold flex items-center gap-2"><Clock size={16} /> {t('rewardPool', 'DrawTime')}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-xs text-gray-500 italic max-w-sm mx-auto leading-relaxed">
                  {t('rewardPool', 'Quote')}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>




      {/* 10. ENGINE / HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-black relative overflow-hidden text-center md:text-left">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <Reveal>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                {t('engineSection', 'Title')} <span className="text-purple-500">{t('engineSection', 'TitleHighlight')}</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-gray-400">
                {t('engineSection', 'Description')}
              </p>
            </Reveal>
          </div>

          <div className="relative">
            {/* Central Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gray-800 -translate-x-1/2 hidden md:block">
              <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-purple-500 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
            </div>

            <div className="space-y-24 md:space-y-32">

              {/* STEP 1: Smart Scanning (Right Content, Left Scan Visual) */}
              <div className="grid md:grid-cols-2 gap-12 items-center relative">
                <div className="md:order-1 relative">
                  {/* Line Node */}
                  <div className="absolute right-[-3rem] top-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,1)] hidden md:block"></div>

                  {/* Visual: Scanning Feed */}
                  <Reveal className="bg-[#0f1014] border border-gray-800 rounded-2xl p-0 relative overflow-hidden group shadow-2xl">
                    {/* Header */}
                    <div className="bg-gray-900/80 backdrop-blur-md p-3 border-b border-gray-800 flex justify-between items-center">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                      </div>
                      <div className="text-[10px] text-green-500 font-mono animate-pulse flex items-center gap-1.5 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {t('engineSection', 'Scanning')}
                      </div>
                    </div>

                    {/* Terminal Body */}
                    <div className="p-4 space-y-2 font-mono text-[10px] md:text-xs relative min-h-[160px]">
                      {/* Background Scan Lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%]"></div>

                      <div className="relative z-10 space-y-2">
                        <div className="flex justify-between text-gray-600 opacity-50">
                          <span>&gt; SCANNING MARKET: NBA</span>
                          <span>[OK]</span>
                        </div>
                        <div className="flex justify-between text-gray-600 opacity-50">
                          <span>&gt; CHECKING: LAL vs GSW</span>
                          <span>...</span>
                        </div>

                        {/* Active Hit */}
                        <div className="bg-gradient-to-r from-purple-900/20 to-transparent border-l-2 border-purple-500 pl-3 py-1 animate-pulse-slow">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">&gt; DISCREPANCY DETECTED</span>
                            <span className="text-purple-500 font-bold">98% CONFIDENCE</span>
                          </div>
                          <div className="ml-2 mt-1 text-white font-bold flex gap-2">
                            <span>LeBron James</span>
                            <span className="text-blue-400">Over 25.5 Pts</span>
                            <span className="text-gray-400">@ -110</span>
                          </div>
                        </div>

                        <div className="flex justify-between text-gray-600 opacity-50">
                          <span>&gt; CHECKING: NFL KANSAS CITY</span>
                          <span>...</span>
                        </div>
                        <div className="flex justify-between text-gray-600 opacity-50">
                          <span>&gt; ANALYSIS COMPLETE</span>
                          <span>[WAITING]</span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
                <div className="md:order-2 md:pl-12">
                  <Reveal delay={200}>
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 text-blue-400">
                      <TrendingUp size={24} />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">{t('engineSection', 'Step1Title')}</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {t('engineSection', 'Step1Desc')}
                    </p>
                  </Reveal>
                </div>
              </div>

              {/* STEP 2: Hybrid Advantage (Left Content, Right Visual) */}
              <div className="grid md:grid-cols-2 gap-12 items-center relative">
                <div className="md:order-2 relative">
                  {/* Line Node */}
                  <div className="absolute left-[-3rem] top-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,1)] hidden md:block"></div>

                  {/* Visual: AI + Analyst */}
                  <Reveal className="bg-[#0f1014] border border-gray-800 rounded-2xl p-6 relative">
                    <div className="text-center text-[10px] text-purple-400 font-mono mb-4 tracking-widest">{t('engineSection', 'HybridActive')}</div>
                    <div className="flex justify-between items-center mb-6 px-4">
                      <div className="text-center">
                        <div className="text-[10px] text-gray-500 mb-1">{t('engineSection', 'AiProjection')}</div>
                        <div className="text-white font-bold">Lakers -4</div>
                        <div className="text-[9px] text-gray-600">{t('engineSection', 'DataOnly')}</div>
                      </div>
                      <div className="h-px bg-gray-800 w-12"></div>
                      <div className="text-center">
                        <div className="text-[10px] text-gray-500 mb-1">{t('engineSection', 'AnalystAdj')}</div>
                        <div className="text-blue-400 font-bold">{t('engineSection', 'AdjValue')}</div>
                        <div className="text-[9px] text-gray-600">{t('engineSection', 'InjuryFactor')}</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 p-4 rounded-xl text-center">
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{t('engineSection', 'FinalVerdict')}</div>
                      <div className="text-xl font-black text-white mb-1">Lakers -5.5</div>
                      <div className="text-[9px] text-green-400">{t('engineSection', 'ConfirmedBy')}</div>
                    </div>
                  </Reveal>
                </div>
                <div className="md:order-1 md:pr-12 md:text-right">
                  <Reveal delay={200}>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 text-purple-400 md:ml-auto">
                      <Zap size={24} />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">{t('engineSection', 'Step2Title')}</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {t('engineSection', 'Step2Desc')}
                    </p>
                  </Reveal>
                </div>
              </div>

              {/* STEP 3: Instant Delivery (Right Content, Left Bot Visual) */}
              <div className="grid md:grid-cols-2 gap-12 items-center relative">
                <div className="md:order-1 relative">
                  {/* Line Node */}
                  <div className="absolute right-[-3rem] top-1/2 w-4 h-4 bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,1)] hidden md:block animate-pulse"></div>

                  {/* Visual: Bot Notification */}
                  <Reveal className="bg-[#0f1014] border border-gray-800 rounded-2xl p-6 relative shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-transparent overflow-hidden">
                        <img src={pIcon} alt="ProPickz Bot" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm flex items-center gap-2">
                          {t('engineSection', 'BotName')} <span className="bg-blue-600 text-[9px] px-1.5 rounded text-white">BOT</span>
                        </div>
                        <div className="text-[10px] text-gray-500">{t('engineSection', 'BotTime')}</div>
                      </div>
                    </div>
                    <div className="pl-12">
                      <div className="bg-[#1e1f25] border-l-4 border-green-500 rounded-r-lg p-3 text-sm">
                        <div className="text-green-400 font-bold mb-1 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> 💎 {t('engineSection', 'WhalePlay')}</div>
                        <div className="text-white font-bold mb-0.5">LeBron James Over 25.5 Pts</div>
                        <div className="text-gray-400 text-xs mb-1">{t('engineSection', 'OddsExample')}</div>
                        <div className="text-purple-400 text-xs font-mono">{t('engineSection', 'HybridScore')}</div>
                      </div>
                    </div>
                  </Reveal>
                </div>
                <div className="md:order-2 md:pl-12">
                  <Reveal delay={200}>
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20 text-green-400">
                      <Smartphone size={24} />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">{t('engineSection', 'Step3Title')}</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {t('engineSection', 'Step3Desc')}
                    </p>
                  </Reveal>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 11. GUARANTEE SECTION */}
      <section id="guarantee" className="py-24 bg-gradient-to-b from-black to-gray-900 border-t border-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-900/5 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              {t('guaranteeDetailed', 'Headline')}
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">
              {t('guaranteeDetailed', 'Subheadline')}
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="bg-[#0f1014] border border-gray-800 rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-2xl group hover:border-purple-500/20 transition-all duration-500">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
              <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <h3 className="text-2xl font-bold text-white mb-10 flex items-center justify-center gap-3 relative z-10">
                <Shield size={28} className="text-purple-500" /> {t('guaranteeDetailed', 'HowItWorks')}
              </h3>

              <div className="grid md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto relative z-10">
                <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-purple-500 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">1</div>
                    {t('guaranteeDetailed', 'Step1Title')}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{t('guaranteeDetailed', 'Step1Desc')}</p>
                </div>
                <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-purple-500 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">2</div>
                    {t('guaranteeDetailed', 'Step2Title')}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{t('guaranteeDetailed', 'Step2Desc')}</p>
                </div>
                <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-purple-500 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">3</div>
                    {t('guaranteeDetailed', 'Step3Title')}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{t('guaranteeDetailed', 'Step3Desc')}</p>
                </div>
                <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-purple-500 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">4</div>
                    {t('guaranteeDetailed', 'Step4Title')}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{t('guaranteeDetailed', 'Step4Desc')}</p>
                </div>
              </div>

              <div className="mt-12 bg-[#0a0a0a] rounded-xl p-6 border border-gray-800 relative z-10 text-center">
                <p className="text-gray-400 text-sm italic mb-4">{t('guaranteeDetailed', 'Quote')}</p>
                <a href="https://discord.gg/propickz" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white font-bold bg-purple-600/20 px-6 py-3 rounded-full border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:bg-purple-600/30 transition-all duration-300">
                  {t('guaranteeDetailed', 'CTA')} <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ SECTION (Placeholder or Remove?) */}
      {/* 12. TOTAL MARKET DOMINANCE SECTION */}
      <section id="dominance" className="py-24 bg-black relative border-t border-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              {t('dominanceSection', 'Headline')} <span className="text-green-500">{t('dominanceSection', 'HeadlineHighlight')}</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16">
              {t('dominanceSection', 'Subheadline')}
            </p>
          </Reveal>

          <Reveal delay={300}>
            <SportsCarousel />
          </Reveal>
        </div>
      </section>
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
              <li className="flex gap-3 text-gray-500 text-sm italic">Great way to test Propickz</li>
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

  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">



        {/* ORIGINAL HERO (Pushed Down) */}
        <div className="text-center mb-24 pt-12 border-t border-gray-800/50">
          <Reveal>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 text-gray-400">
              {t('engineSection', 'Title')} <span className="text-white">{t('engineSection', 'TitleHighlight')}</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
              {t('engineSection', 'Description')}
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
              <h3 className="text-3xl font-bold text-white mb-4">{t('engineSection', 'Step1Title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('engineSection', 'Step1Desc')}
              </p>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="absolute left-0 top-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full hidden md:block shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-slide-in-left"></div>
                <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{t('engineSection', 'LiveMarketFeed')}</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-gray-500">{t('engineSection', 'Scanning')}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded bg-gray-800/30 opacity-50">
                    <span className="text-gray-400 text-sm">NBA: LAL vs GSW</span>
                    <span className="text-gray-600 text-xs">{t('engineSection', 'Checking')}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-gray-800/30 opacity-50">
                    <span className="text-gray-400 text-sm">NFL: KC vs BUF</span>
                    <span className="text-gray-600 text-xs">{t('engineSection', 'Checking')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-blue-500/10 border border-blue-500/30 transform scale-105 transition-all">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm">LeBron James</span>
                      <span className="text-blue-300 text-xs">{t('engineSection', 'OverPoints').replace('{points}', '25.5')}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-white font-bold">-110</span>
                      <span className="text-green-400 text-xs font-bold">{t('engineSection', 'DiscrepancyFound')}</span>
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
                <div className="font-mono text-xs text-purple-300 mb-4 text-center">&gt;&gt; {t('engineSection', 'HybridActive')}</div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-gray-500 text-xs mb-1">{t('engineSection', 'AiProjection')}</div>
                      <div className="text-lg font-bold text-white">Lakers -4</div>
                      <div className="text-xs text-gray-600">{t('engineSection', 'DataOnly')}</div>
                    </div>
                    <div className="h-px w-12 bg-gray-700"></div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs mb-1">{t('engineSection', 'AnalystAdj')}</div>
                      <div className="text-lg font-bold text-blue-400">{t('engineSection', 'AdjValue')}</div>
                      <div className="text-xs text-gray-600">{t('engineSection', 'InjuryFactor')}</div>
                    </div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl text-center">
                    <div className="text-purple-400 font-bold text-sm">{t('engineSection', 'FinalVerdict')}: LAKERS -5.5</div>
                    <div className="text-gray-400 text-xs mt-1">{t('engineSection', 'ConfirmedBy')}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 mb-4">
                <Zap size={32} className="text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">{t('engineSection', 'Step2Title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('engineSection', 'Step2Desc')}
              </p>
            </div>
          </Reveal>

          {/* Step 3 */}
          <Reveal className="grid md:grid-cols-2 gap-12 items-center relative">
            <div className="md:text-right order-2 md:order-1">
              <div className="inline-block p-3 rounded-2xl bg-green-500/10 border border-green-500/30 mb-4">
                <Smartphone size={32} className="text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">{t('engineSection', 'Step3Title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('engineSection', 'Step3Desc')}
              </p>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="absolute left-0 top-1/2 -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full hidden md:block shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl backdrop-blur-sm max-w-sm mx-auto md:mx-0">
                <div className="flex items-center gap-3 mb-4">
                  <img src={pIcon} alt="Bot" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-white font-bold text-sm">{t('engineSection', 'BotName')}</div>
                    <div className="text-gray-500 text-xs">{t('engineSection', 'BotTime')}</div>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-green-500 mb-2">
                  <div className="text-green-400 font-bold text-sm mb-1">💎 {t('engineSection', 'WhalePlay')}</div>
                  <div className="text-white text-sm">LeBron James Over 25.5 Pts</div>
                  <div className="text-gray-400 text-xs mt-1">{t('engineSection', 'OddsExample')}</div>
                  <div className="text-purple-400 text-xs font-bold mt-1">{t('engineSection', 'HybridScore')}</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Trust Section */}


      </div>
    </div>
  );
};

// --- 10. SUPPORTED SPORTS PAGE COMPONENT ---

const SupportedSportsPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <div className="mb-12">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              {t('dominanceSection', 'Headline')} <span className="text-green-500">{t('dominanceSection', 'HeadlineHighlight')}</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('dominanceSection', 'Subheadline')}
            </p>
          </Reveal>
        </div>

        {/* NEW CAROUSEL WIDGET */}
        <Reveal delay={300}>
          <SportsCarousel />
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
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden flex flex-col items-center">
      {/* Background - Minimal/clean to match image */}
      <div className="absolute inset-0 bg-black z-0"></div>

      <div className="max-w-3xl mx-auto px-4 relative z-10 w-full">
        <div className="text-center mb-12">
          <Reveal>
            <h1 className="text-4xl font-bold text-white mb-2">
              {t('faq', 'Headline')}
            </h1>
          </Reveal>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 50}>
              <div
                className={`rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === i ? 'bg-[#151720]' : 'bg-[#0f1219] hover:bg-[#151720]'}`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex justify-between items-center p-5 text-left"
                >
                  <span className="text-base md:text-lg font-medium text-white">{faq.q}</span>
                  <ChevronDown className={`text-purple-500 transition-transform duration-300 transform ${openIndex === i ? 'rotate-180' : ''}`} size={20} />
                </button>
                <div
                  className={`px-5 text-gray-400 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-sm md:text-base border-t border-gray-800/50 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={600} className="mt-16 text-center">
          {/* Kept minimal contact support if needed, but low profile */}
          <p className="text-gray-500 text-sm">{t('faq', 'MoreQuestions')} <a href="mailto:support@propickz.com" className="text-white underline hover:text-purple-400 transition-colors">{t('faq', 'ContactSupport')}</a></p>
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

        {/* Content Removed */}

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
            These Terms & Conditions (“Terms”) govern your access to and use of the Propickz platform, including but not limited to our website, Discord server, bots, tools, data, models, projections, recommendations, content, communications, and any related products or services (collectively, the “Service”).
            <br /><br />
            By accessing, subscribing to, or otherwise using the Service, you acknowledge that you have read, understood, and agree to be legally bound by these Terms. If you do not agree, you must not use the Service.
          </p>

          {/* 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Informational Purposes Only - Not Financial or Gambling Advice</h2>
            <p className="mb-4">
              All content provided by Propickz, including but not limited to betting picks, statistical models, educational material, projections, articles, Discord discussions, tools, and bot-generated outputs, is intended strictly for informational, educational, and entertainment purposes only.
            </p>
            <p className="mb-4">
              Propickz is not a financial advisor, investment advisor, bookmaker, gambling operator, or licensed gaming provider.
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
              Propickz makes no guarantees, warranties, or representations - express or implied - regarding:
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
              By using the Service, you expressly acknowledge and agree that all betting and gambling decisions are inherently uncertain, and Propickz shall not be held responsible or liable for any reliance you place on the content.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Content May Include Simulations, Hypotheticals, and Marketing Materials</h2>
            <p className="mb-4">
              Certain materials provided or displayed by Propickz, including but not limited to illustrations, mockups, dashboards, case studies, projections, or profit examples, may be fictional, simulated, or hypothetical in nature.
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
              Your use of the Service does not establish any professional-client, fiduciary, advisory, or partnership relationship between you and Propickz.
            </p>
            <p className="mb-4">
              Propickz does not act in any advisory capacity, including but not limited to financial, legal, or gambling-related advisory.
            </p>
            <p className="mb-2">You are solely responsible for:</p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Complying with all local, state/provincial, federal, and international laws applicable to your activities.</li>
              <li>Determining whether sports betting or gambling is legal in your jurisdiction.</li>
              <li>Ensuring that you meet the minimum legal age requirement in your jurisdiction (in no event less than 18 years old, and in some jurisdictions 21 years old).</li>
            </ul>
            <p>
              Propickz does not provide access to the Service in jurisdictions where doing so would violate applicable law, and we reserve the right to restrict access accordingly.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, Propickz, its owners, employees, contractors, affiliates, and agents shall not be liable for:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Any losses or damages of any kind - including but not limited to direct, indirect, incidental, consequential, punitive, exemplary, or special damages;</li>
              <li>Loss of profits, revenues, savings, data, goodwill, or opportunity;</li>
              <li>Reliance on content, recommendations, or services provided by Propickz;</li>
              <li>Unauthorized access to or alteration of your data, transmissions, or account;</li>
              <li>Third-party platforms, tools, bookmakers, or integrations accessed through or in connection with the Service.</li>
            </ul>
            <p className="mb-4">
              This limitation applies even if Propickz has been advised of the possibility of such damages.
            </p>
            <p className="mb-2">Nothing in these Terms excludes liability for:</p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Fraud or fraudulent misrepresentation;</li>
              <li>Gross negligence or willful misconduct by Propickz;</li>
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
              Propickz disclaims all warranties including, but not limited to:
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
              All intellectual property rights in and to the Service, including but not limited to software, bots, tools, written content, logos, branding, trademarks, and design elements, are and shall remain the exclusive property of Propickz.
            </p>
            <p className="mb-4">
              Propickz grants you a limited, revocable, non-exclusive, non-transferable license to use the Service strictly for personal, non-commercial, lawful purposes, subject to these Terms.
            </p>
            <p className="mb-4">
              You may not copy, reproduce, distribute, modify, reverse-engineer, or publicly display any Propickz content without prior written consent.
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
              To the fullest extent permitted by law, you waive the right to participate in any class action or representative lawsuit against Propickz. All disputes must be resolved on an individual basis.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Terms</h2>
            <p className="mb-4">
              Propickz reserves the right to amend, update, or replace these Terms at any time.
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
              These Terms constitute the entire agreement between you and Propickz regarding the Service and supersede any prior agreements, understandings, or representations.
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

        {/* CTA Section */}
        <Reveal delay={200} className="mt-20 text-center border-t border-gray-800 pt-16 pb-8">
          <h2 className="text-3xl font-black text-white mb-6">Ready to Start <span className="text-green-500">Winning?</span></h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join the only community with a verified mathematical edge over the sportsbooks.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {
                // Navigate to pricing on Home view since Pricing is there
                // This assumes 'setView' isn't directly available here or we need to navigate
                // But LegalPage is a view. So we should probably use window.location or if we have access to setView via context/props?
                // LegalPage doesn't have props.
                // I'll make it redirect to home hash.
                window.location.href = '/';
                setTimeout(() => {
                  const el = document.getElementById('pricing');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 500);
              }}
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Get Started Now
            </button>
            <button
              onClick={() => window.open('https://discord.gg/propickz', '_blank')}
              className="px-8 py-4 bg-transparent border border-gray-700 text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
            >
              Join Free Discord
            </button>
          </div>
        </Reveal>
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

      {/* Content Removed */}
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
            <p className="text-purple-200 mb-6 leading-relaxed animate-ambient-glow">
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

      {/* Content Removed */}
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
      case 'Home': return <HomePage setView={setView} />;
      case 'Contact': return <ContactPage />;
      case 'Pricing': return <PricingPage />;
      case 'FreeTrial': return <FreeTrialPage />;
      case 'Guarantee': return <GuaranteePage />;
      case 'Results': return <ResultsPage />;
      case 'Calculators': return <CalculatorsPage />;
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
        <Navbar setView={setView} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} currentView={view} />

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
