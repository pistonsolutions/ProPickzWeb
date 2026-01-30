'use client'; // Ensures Next.js compatibility

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, X, Menu, Star, Shield, Zap, TrendingUp, Users, Target, MessageSquare, AlertCircle, LayoutDashboard, Layers, BookOpen, Gift, Trophy, Globe, ArrowUpRight, Smartphone, ArrowRight, Lock } from 'lucide-react';

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
import ResultsDashboard from './components/ResultsDashboard';
import WinningSlips from './components/WinningSlips';
import SportsCarousel from './components/SportsCarousel';
import { Reveal } from './utils/Reveal';
import CommunityBenefits from './components/CommunityBenefits';
import AboutUsPage from './components/AboutUsPage';

import FeatureTiles from './components/FeatureTiles';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LotteryCountdown from './components/LotteryCountdown';
import ScrollProgressIndicator from './components/ScrollProgressIndicator';

interface FomoData {
  name: string;
  action: string;
}

interface FaqItem {
  q: string;
  a: string;
}



interface NavbarProps {
  setView: (view: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

interface HomePageProps {
  setView: (view: string) => void;
}

// --- HOOKS ---

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

declare global {
  interface Window {
    __firebase_config?: string;
    __initial_auth_token?: string;
  }
}

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

const ROICalculator: React.FC = () => {
  const [unitSize, setUnitSize] = useState<number>(50);
  const monthlyProfit = (unitSize * 24.5).toFixed(0);
  const yearlyPotential = (unitSize * 24.5 * 12).toFixed(0);
  const { t } = useLanguage();
  const sliderPercent = ((unitSize - 10) / (500 - 10)) * 100;

  return (
    <div className="bg-[#12141a] border border-purple-500/30 p-6 md:p-8 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.15)] relative overflow-hidden max-w-md mx-auto">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-black text-white mb-2">{t('roi', 'Title')}</h3>
        <p className="text-gray-500 mb-8 text-sm">{t('roi', 'Subtitle')}</p>
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">{t('roi', 'UnitSize')}</div>
              <div className="text-xs text-gray-600">{t('roi', 'UnitDefinition')}</div>
            </div>
            <div className="text-4xl font-black text-white">${unitSize}</div>
          </div>
          <div className="relative">
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={unitSize}
              onChange={(e) => setUnitSize(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #22c55e ${sliderPercent}%, #2a2d35 ${sliderPercent}%)` }}
            />
            <style>{`
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #a855f7;
                cursor: pointer;
                border: 3px solid #c084fc;
                box-shadow: 0 0 12px rgba(168, 85, 247, 0.6);
              }
            `}</style>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>{t('roi', 'Min')}</span>
            <span>{t('roi', 'Max')}</span>
          </div>
        </div>
        <div className="mb-8 h-40 relative">
          <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="chartAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <path d="M20,100 C80,98 140,95 200,85 Q280,65 340,35 Q370,20 380,15 L380,120 L20,120 Z" fill="url(#chartAreaGradient)" />
            <path d="M20,100 C80,98 140,95 200,85 Q280,65 340,35 Q370,20 380,15" fill="none" stroke="url(#chartLineGradient)" strokeWidth="3" filter="url(#glow)" vectorEffect="non-scaling-stroke" />
            <circle cx="380" cy="15" r="5" fill="white" filter="url(#glow)" />
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1a1d24] p-5 rounded-xl border border-gray-700/50">
            <div className="text-green-400 text-[11px] font-bold uppercase tracking-wider mb-2">{t('roi', 'MonthlyProfit')}</div>
            <div className="text-3xl md:text-4xl font-black text-green-400">${parseInt(monthlyProfit).toLocaleString()}</div>
          </div>
          <div className="bg-[#1a1d24] p-5 rounded-xl border border-gray-700/50">
            <div className="text-purple-400 text-[11px] font-bold uppercase tracking-wider mb-2">{t('roi', 'YearlyPotential')}</div>
            <div className="text-3xl md:text-4xl font-black text-white">${parseInt(yearlyPotential).toLocaleString()}</div>
          </div>
        </div>
        <p className="text-[11px] text-gray-600 mt-6 text-center italic border-t border-gray-800 pt-4">{t('roi', 'Disclaimer')}</p>
      </div>
    </div>
  );
};

const FomoNotification: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<FomoData>({ name: '', action: '' });
  const { t } = useLanguage();
  const FOMO_CONFIG = { MAX_POPUPS: 4, DISPLAY_DURATION: 5000, INITIAL_DELAYS: [5000, 15000, 30000, 60000], INTERVALS: [15000, 25000, 40000, 60000] };

  useEffect(() => {
    const popupCount = parseInt(sessionStorage.getItem('fomoPopupCount') || '0');
    if (popupCount >= FOMO_CONFIG.MAX_POPUPS) return;

    const trigger = () => {
      const currentCount = parseInt(sessionStorage.getItem('fomoPopupCount') || '0');
      if (currentCount >= FOMO_CONFIG.MAX_POPUPS) return;

      const randomName = "User";
      // @ts-ignore
      const randomActionKey = `Action${Math.floor(Math.random() * 8) + 1}`;
      // @ts-ignore
      const randomAction = t('fomo', randomActionKey);
      setData({ name: randomName, action: randomAction });
      setVisible(true);
      sessionStorage.setItem('fomoPopupCount', String(currentCount + 1));
      setTimeout(() => setVisible(false), FOMO_CONFIG.DISPLAY_DURATION);
    };

    const delay = FOMO_CONFIG.INITIAL_DELAYS[popupCount] || FOMO_CONFIG.INITIAL_DELAYS[FOMO_CONFIG.INITIAL_DELAYS.length - 1];
    const randomInterval = Math.random() * (FOMO_CONFIG.INTERVALS[popupCount] || FOMO_CONFIG.INTERVALS[FOMO_CONFIG.INTERVALS.length - 1]);
    const timer = setTimeout(trigger, delay + randomInterval);
    return () => clearTimeout(timer);
  }, [t]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-4 md:left-8 z-50 bg-white dark:bg-gray-900 border border-purple-500/30 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-in-left max-w-sm">
      <div className="bg-black p-2 rounded-full border border-gray-800"><img src={propickzLogo} alt="Propickz" className="w-6 h-6 object-contain" /></div>
      <div><div className="text-sm font-bold text-gray-900 dark:text-white">{data.name}</div><div className="text-xs text-gray-500 dark:text-gray-400">{data.action}</div></div>
      <div className="text-xs text-gray-400 ml-auto">{t('fomo', 'JustNow')}</div>
    </div>
  );
};

interface NavbarInternalProps extends NavbarProps { currentView: string; }

const Navbar: React.FC<NavbarInternalProps> = ({ setView, mobileMenuOpen, setMobileMenuOpen, currentView }) => {
  const { language, setLanguage, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('');
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const toggleLanguage = () => { if (language === 'en') setLanguage('fr'); else if (language === 'fr') setLanguage('es'); else setLanguage('en'); };

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'Home') {
      setView('Home');
      setTimeout(() => { const element = document.getElementById(sectionId); if (element) { const offset = 96; const elementPosition = element.getBoundingClientRect().top + window.pageYOffset; window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' }); } }, 100);
    } else {
      const element = document.getElementById(sectionId); if (element) { const offset = 96; const elementPosition = element.getBoundingClientRect().top + window.pageYOffset; window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' }); }
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (currentView !== 'Home') { setActiveSection(''); return; }
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      const sections = navLinks.filter(link => link.type === 'scroll' && link.anchor).map(link => link.anchor as string);
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) { const top = element.offsetTop; const height = element.offsetHeight; if (scrollPosition >= top && scrollPosition < top + height) { setActiveSection(sectionId); return; } }
      }
    };
    window.addEventListener('scroll', handleScroll); handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const goHome = () => { setView('Home'); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const navLinks = [
    { name: t('nav', 'Reviews'), anchor: 'testimonials', type: 'scroll' },
    { name: t('nav', 'HowItWorks'), anchor: 'how-it-works', type: 'scroll' },
    { name: t('nav', 'Guarantee'), anchor: 'guarantee', type: 'scroll' },
    { name: t('nav', 'Result'), page: 'Results', type: 'page' },
    { name: t('nav', 'Resources'), type: 'dropdown', subItems: [{ name: t('nav', 'Calculators'), page: 'Calculators', type: 'page' }, { name: t('nav', 'FAQ'), page: 'FAQ', type: 'page' }, { name: t('nav', 'Legal'), page: 'Legal', type: 'page' },] },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => { if (link.type === 'scroll' && link.anchor) { scrollToSection(link.anchor); } else if (link.type === 'page' && link.page) { setView(link.page); setMobileMenuOpen(false); } };

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <button onClick={() => setView('Contact')} className="text-sm font-semibold text-gray-300 hover:text-white transition-all hover:scale-105">{t('nav', 'Contact')}</button>
          <div className="cursor-pointer group" onClick={goHome}>
            <img src={pIcon} alt="Propickz" className="h-14 w-14 object-contain group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            if (link.type === 'dropdown' && link.subItems) {
              return (
                <div key={link.name} className="relative group">
                  <button className={`text-sm font-semibold transition-all hover:scale-105 flex items-center gap-1 text-gray-300 hover:text-white group-hover:text-white`}>{link.name} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" /></button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex flex-col p-1">
                      {link.subItems.map((sub) => (<button key={sub.page} onClick={() => { setView(sub.page!); }} className={`text-left px-4 py-3 text-sm font-semibold hover:bg-white/10 rounded-lg transition-colors ${currentView === sub.page ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white'}`}>{sub.name}</button>))}
                    </div>
                  </div>
                </div>
              );
            }
            const isActive = link.type === 'scroll' ? activeSection === link.anchor : currentView === link.page;
            return (
              <button key={link.anchor || link.page} onClick={() => handleNavClick(link as any)} className={`text-sm font-semibold transition-all hover:scale-105 relative group ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'text-gray-300 hover:text-white'}`}>{link.name}<span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span></button>
            );
          })}
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggleLanguage} className="px-3 py-1.5 text-gray-300 hover:text-white transition-all flex items-center gap-2 font-semibold text-sm uppercase bg-white/5 rounded-lg hover:bg-white/10 border border-purple-500/20"><Globe size={16} /> {language === 'en' ? 'EN' : language === 'fr' ? 'FR' : 'ES'}</button>
          <button onClick={() => window.open('https://discord.gg/wEKnBrvZUF', '_blank')} className="px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all hover:scale-105">{t('nav', 'JoinDiscord')}</button>
          <button onClick={() => scrollToSection('pricing')} className="px-5 py-2 bg-gradient-to-r from-amber-500/10 to-yellow-600/10 backdrop-blur-sm border border-amber-500/30 text-amber-200 text-sm font-bold rounded-lg hover:bg-amber-500/20 transition-all hover:scale-105 shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]">{t('nav', 'ViewPricing')}</button>
        </div>
        <button className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <Menu />}</button>
      </div>
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-3xl border-t border-purple-500/20 absolute w-full left-0 top-20 p-6 flex flex-col gap-4 animate-fade-in-up h-[calc(100vh-5rem)] overflow-y-auto z-50">
          {navLinks.map(link => {
            if (link.type === 'dropdown' && link.subItems) {
              return (
                <div key={link.name} className="flex flex-col">
                  <button onClick={() => setResourcesOpen(!resourcesOpen)} className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl text-lg p-4 text-left font-bold transition-all border border-transparent hover:border-white/5 flex justify-between items-center">{link.name} {resourcesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>
                  {resourcesOpen && (<div className="flex flex-col ml-4 border-l border-gray-800 pl-4 mt-2 gap-2">{link.subItems.map(sub => (<button key={sub.page} onClick={() => { setView(sub.page!); setMobileMenuOpen(false); }} className="text-gray-400 hover:text-white text-base p-3 text-left font-semibold hover:bg-white/5 rounded-lg transition-all">{sub.name}</button>))}</div>)}
                </div>
              );
            }
            return (<button key={link.anchor || link.page} onClick={() => handleNavClick(link as any)} className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl text-lg p-4 text-left font-bold transition-all border border-transparent hover:border-white/5">{link.name}</button>);
          })}
          <div className="mt-auto pb-8 flex flex-col gap-4">
            <button onClick={toggleLanguage} className="w-full py-4 text-white font-bold bg-white/5 rounded-xl border border-white/10 flex items-center justify-center gap-2"><Globe size={20} /> {language === 'en' ? 'English' : language === 'fr' ? 'Français' : 'Español'}</button>
            <button onClick={() => window.open('https://discord.gg/wEKnBrvZUF', '_blank')} className="w-full py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20">{t('nav', 'JoinDiscord')}</button>
            <button onClick={() => scrollToSection('pricing')} className="w-full py-4 bg-white text-black font-bold rounded-xl shadow-lg">{t('nav', 'ViewPricing')}</button>
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
        <div className="mb-16 border-b border-gray-800 pb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 tracking-tight">{t('newsletter', 'Headline')}</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">{t('newsletter', 'Subheadline')}</p>
          <form className="max-w-md mx-auto relative group flex flex-col gap-4 md:block" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder={t('newsletter', 'Placeholder')} className="w-full pl-6 pr-6 md:pr-44 py-4 bg-gray-900/50 border border-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.15)]" />
            <button type="submit" className="w-full md:w-auto md:mt-0 relative md:absolute md:right-2 md:top-2 md:bottom-2 px-8 md:px-6 py-4 md:py-0 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-full font-bold transition-all flex items-center justify-center md:inline-flex gap-2 text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98]">
              <span className="md:hidden">Send My Discount</span><span className="hidden md:inline">{t('newsletter', 'Button')}</span><ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
        <p className="text-gray-600 text-sm">{t('footer', 'Copyright')}<br /> {t('footer', 'Disclaimer')}</p>
      </div>
    </footer>
  );
};

// --- 4. HOMEPAGE COMPONENT ---

const HomePage: React.FC<HomePageProps> = ({ setView }) => {
  const [unitsRef, unitsVal] = useCountUp(214.5, 2000);
  const [membersRef, membersVal] = useCountUp(900, 2000);
  const { t } = useLanguage();

  return (
    <div className="overflow-x-hidden">
      <section id="hero" className="relative min-h-screen flex items-center pt-24 md:pt-20 overflow-hidden bg-matt-black">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-600/30 rounded-full blur-[80px] md:blur-[120px] pointer-events-none animate-pulse-slow"></div>
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <div className="text-left space-y-6 md:space-y-8 pt-10 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-500/50 text-cyan-300 text-xs font-bold uppercase tracking-widest font-heading animate-fade-in-up shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>{t('hero', 'SystemLive')}
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[0.95] md:leading-[0.9] tracking-tight animate-fade-in-up delay-100 font-heading">
              {t('proofSection', 'HeadlineStart')} <span className="text-green-500 animate-glow-vertical">{t('proofSection', 'HeadlineProof')}</span>,<br />
              {t('proofSection', 'HeadlineNot')} <span className="text-red-500 animate-glow-vertical-red">{t('proofSection', 'HeadlinePromises')}.</span>
            </h1>
            <p className="text-sm md:text-lg text-gray-400 max-w-lg leading-relaxed font-code animate-[dropIn_0.6s_ease-out_0.3s_both] md:animate-fade-in-up md:delay-200">{t('proofSection', 'Subheadline')}</p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <button onClick={() => { const el = document.getElementById('pricing'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group">{t('hero', 'StartFreeTrial')} <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></button>
              <button onClick={() => setView('Results')} className="px-8 py-4 bg-transparent border border-gray-700 text-white rounded-full font-bold text-lg hover:bg-gray-900 hover:border-white transition-all flex items-center justify-center gap-2"><Shield size={20} fill="currentColor" /> {t('hero', 'WatchDemo')}</button>
            </div>
          </div>
          <Hero3DPhone />
        </div>
      </section>

      <AsSeenOn />

      <section className="py-24 bg-gradient-to-b from-textured-black to-purple-900/20 overflow-hidden bg-textured-black">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-purple-900/30 text-purple-300 font-bold text-sm mb-6 border border-purple-500/30">{t('roi', 'Badge')}</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 whitespace-pre-line">{t('roi', 'Headline')}</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">{t('roi', 'Subheadline')}</p>
            <div className="flex gap-12">
              <div><div className="text-4xl sm:text-5xl font-black text-white mb-1 tracking-tight" ref={unitsRef}>+{unitsVal.toFixed(1)}u</div><div className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold font-heading">{t('roi', 'ProfitYTD')}</div></div>
              <div><div className="text-4xl sm:text-5xl font-black text-white mb-1 tracking-tight" ref={membersRef}>{Math.floor(membersVal).toLocaleString()}+</div><div className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold font-heading">{t('roi', 'DaysTracked')}</div></div>
            </div>
          </div>
          <div className="relative"><ROICalculator /></div>
        </div>
      </section>

      <FeatureTiles />

      <section id="pricing" className="py-24 bg-matt-black relative border-t border-gray-900">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal><h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">{t('membershipComparison', 'HeadlineStart')} <span className="text-green-400">{t('membershipComparison', 'HeadlineFree')}</span>. <br />{t('membershipComparison', 'HeadlineCommitting')} <span className="text-purple-400">{t('membershipComparison', 'HeadlineProfitable')}</span>.</h2></Reveal>
            <Reveal delay={200}><p className="text-gray-400 text-lg leading-relaxed">{t('membershipComparison', 'Subheadline')}</p></Reveal>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <Reveal delay={100} className="flex flex-col h-full p-8 rounded-[2rem] border border-white/10 bg-[#0f1014] hover:border-white/20 transition-all duration-300 relative group">
              <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4">{t('membershipComparison', 'CommunityAccess')}</div>
              <div className="text-4xl font-black text-white mb-2">{t('membershipComparison', 'Free')}</div>
              <p className="text-gray-500 text-sm mb-8 h-12">{t('membershipComparison', 'FreeDesc')}</p>
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex gap-3 text-sm text-gray-300"><CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" /><span>{t('membershipComparison', 'FreeFeature1')}</span></div>
                <div className="flex gap-3 text-sm text-gray-300"><CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" /><span>{t('membershipComparison', 'FreeFeature2')}</span></div>
                <div className="flex gap-3 text-sm text-gray-300"><CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" /><span>{t('membershipComparison', 'FreeFeature3')}</span></div>
              </div>
              <div className="mt-auto"><button onClick={() => window.open('https://discord.gg/wEKnBrvZUF', '_blank')} className="w-full py-4 rounded-xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 hover:scale-[1.02] transition-all">{t('membershipComparison', 'FreeCTA')} →</button><p className="text-center text-[11px] text-gray-500 mt-3 font-medium">{t('membershipComparison', 'FreeFooter')}</p></div>
            </Reveal>

            <Reveal delay={200} className="flex flex-col h-full p-8 rounded-[2rem] border-2 border-purple-500/20 bg-[#0f1014] hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] transition-all duration-300 relative group">
              <div className="text-purple-400 font-bold uppercase tracking-wider text-xs mb-4">{t('membershipComparison', 'ProMonthly')}</div>
              <div className="flex items-baseline gap-1 mb-2"><span className="text-4xl font-black text-white">{t('membershipComparison', 'ProMonthlyCost')}</span><span className="text-gray-500 text-sm">/mo</span></div>
              <p className="text-gray-400 text-sm mb-8 h-12">{t('membershipComparison', 'ProMonthlyDesc')}</p>
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex gap-3 text-sm text-white font-medium"><Zap size={18} className="text-purple-500 shrink-0 mt-0.5" /><span>{t('membershipComparison', 'ProFeature1')}</span></div>
                <div className="flex gap-3 text-sm text-white font-medium"><MessageSquare size={18} className="text-purple-500 shrink-0 mt-0.5" /><span>{t('membershipComparison', 'ProFeature2')}</span></div>
                <div className="flex gap-3 text-sm text-white font-medium"><Users size={18} className="text-purple-500 shrink-0 mt-0.5" /><span>{t('membershipComparison', 'ProFeature3')}</span></div>
                <div className="flex gap-3 text-sm text-white font-medium"><BookOpen size={18} className="text-purple-500 shrink-0 mt-0.5" /><span>{t('membershipComparison', 'ProFeature4')}</span></div>
                <p className="text-xs text-purple-400 italic pt-2">{t('membershipComparison', 'ProQuote')}</p>
              </div>
              <div className="mt-auto"><button onClick={() => window.open('https://whop.com/propickzofficial/propickz-all-access/', '_blank')} className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all">{t('membershipComparison', 'ProMonthlyCTA')} →</button><p className="text-center text-[11px] text-gray-500 mt-3 font-medium">{t('membershipComparison', 'ProMonthlyFooter')}</p></div>
            </Reveal>

            <Reveal delay={300} className="flex flex-col h-full p-8 rounded-[2rem] border border-amber-500/20 bg-[#0f1014] hover:border-amber-500/40 hover:shadow-[0_0_40px_rgba(234,179,8,0.1)] transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-black uppercase px-3 py-1.5 rounded-bl-xl">{t('membershipComparison', 'ProYearlyBadge')}</div>
              <div className="text-amber-400 font-bold uppercase tracking-wider text-xs mb-4">{t('membershipComparison', 'ProYearly')}</div>
              <div className="flex items-baseline gap-1 mb-2"><span className="text-4xl font-black text-white">{t('membershipComparison', 'ProYearlyCost')}</span><span className="text-gray-500 text-sm">/yr</span></div>
              <p className="text-gray-400 text-sm mb-8 h-12">{t('membershipComparison', 'ProYearlyDesc')}</p>
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex gap-3 text-sm text-white font-medium"><CheckCircle size={18} className="text-amber-500 shrink-0 mt-0.5" /><span>{t('membershipComparison', 'ProYearlyFeature1')}</span></div>
                <div className="flex gap-3 text-sm text-white font-medium"><Lock size={18} className="text-amber-500 shrink-0 mt-0.5" /><span>{t('membershipComparison', 'ProYearlyFeature2')}</span></div>
                <div className="flex gap-3 text-sm text-white font-medium"><Target size={18} className="text-amber-500 shrink-0 mt-0.5" /><span>{t('membershipComparison', 'ProYearlyFeature3')}</span></div>
                <p className="text-xs text-amber-500/80 italic pt-2">{t('membershipComparison', 'ProYearlyQuote')}</p>
              </div>
              <div className="mt-auto"><button onClick={() => window.open('https://whop.com/propickzofficial/propickz-all-access/', '_blank')} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-[1.02] transition-all">{t('membershipComparison', 'ProYearlyCTA')} →</button><p className="text-center text-[11px] text-gray-500 mt-3 font-medium">{t('membershipComparison', 'ProYearlyFooter')}</p></div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24 bg-textured-black relative border-t border-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <Reveal><h2 className="text-4xl md:text-5xl font-black text-white mb-4">{t('rewardPool', 'Title')} <span className="text-yellow-400">{t('rewardPool', 'TitleHighlight')}</span></h2><p className="text-lg text-gray-400 leading-relaxed">{t('rewardPool', 'Description')}</p></Reveal>
            <Reveal delay={200} className="space-y-6">
              <div className="relative overflow-hidden bg-green-500/10 border border-green-500/20 p-6 rounded-2xl group transition-colors">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Gift size={20} className="text-green-400" /> {t('rewardPool', 'WhatItIs')}</h3>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" /> {t('rewardPool', 'WhatItIs1')}</li>
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" /> {t('rewardPool', 'WhatItIs2')}</li>
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" /> {t('rewardPool', 'WhatItIs3')}</li>
                  </ul>
                </div>
              </div>
              <div className="relative overflow-hidden bg-red-500/10 border border-red-500/20 p-6 rounded-2xl group transition-colors">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2"><AlertCircle size={20} className="text-red-400" /> {t('rewardPool', 'WhatNot')}</h3>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /> {t('rewardPool', 'WhatNot1')}</li>
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /> {t('rewardPool', 'WhatNot2')}</li>
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /> {t('rewardPool', 'WhatNot3')}</li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={300}>
            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2rem] border border-yellow-500/20 relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.1)] group hover:shadow-[0_0_80px_rgba(234,179,8,0.2)] transition-all duration-500">
              <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-black uppercase px-3 py-1.5 rounded-bl-xl font-heading tracking-wider">{t('rewardPool', 'LiveTracker')}</div>
              <div className="text-center mb-10 pt-6">
                <div className="text-yellow-500/80 font-bold text-xs uppercase tracking-[0.2em] mb-3">{t('rewardPool', 'CurrentPot')}</div>
                <div className="text-6xl md:text-7xl font-black text-white mb-3 drop-shadow-[0_0_25px_rgba(234,179,8,0.4)] font-heading">$4,250</div>
                <div className="text-gray-500 text-[10px] uppercase tracking-wide font-medium">{t('rewardPool', 'GrowingDaily')}</div>
              </div>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/5 hover:bg-white/10 transition-colors"><span className="text-gray-400 text-sm font-medium">{t('rewardPool', 'LastWinner')}</span><span className="text-white font-mono font-bold">@jason_k <span className="text-green-400 ml-1">(+$2,100)</span></span></div>
                <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/5 hover:bg-white/10 transition-colors"><span className="text-gray-400 text-sm font-medium">{t('rewardPool', 'NextDraw')}</span><LotteryCountdown /></div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 text-center"><p className="text-xs text-gray-500 italic max-w-sm mx-auto leading-relaxed">{t('rewardPool', 'Quote')}</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10. ENGINE / HOW IT WORKS SECTION - HOME PAGE VERSION */}
      <section id="how-it-works" className="py-24 bg-matt-black relative overflow-hidden text-center md:text-left">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <Reveal><h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">{t('engineSection', 'Title')} <span className="text-purple-500">{t('engineSection', 'TitleHighlight')}</span></h1></Reveal>
            <Reveal delay={200}><p className="text-xl text-gray-400">{t('engineSection', 'Description')}</p></Reveal>
          </div>
          <div className="space-y-16 md:space-y-32 relative">

            {/* FIXED: Removed the moving bar entirely. Just the static track line remains. */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent block"></div>

            {/* Steps Content */}
            <Reveal className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative pl-12 md:pl-0">
              <div className="md:order-1 relative">
                <div className="absolute right-[-3rem] top-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,1)] hidden md:block"></div>
                <Reveal className="bg-[#0f1014] border border-gray-800 rounded-2xl p-0 relative overflow-hidden group shadow-2xl">
                  <div className="bg-gray-900/80 backdrop-blur-md p-3 border-b border-gray-800 flex justify-between items-center"><div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div><div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div></div><div className="text-[10px] text-green-500 font-mono animate-pulse flex items-center gap-1.5 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {t('engineSection', 'Scanning')}</div></div>
                  <div className="p-4 space-y-2 font-mono text-[10px] md:text-xs relative min-h-[160px]">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%]"></div>
                    <div className="relative z-10 space-y-2">
                      <div className="flex justify-between text-gray-600 opacity-50"><span>&gt; SCANNING MARKET: NBA</span><span>[OK]</span></div>
                      <div className="flex justify-between text-gray-600 opacity-50"><span>&gt; CHECKING: LAL vs GSW</span><span>...</span></div>
                      <div className="bg-gradient-to-r from-purple-900/20 to-transparent border-l-2 border-purple-500 pl-3 py-1 animate-pulse-slow"><div className="flex justify-between items-center"><span className="text-purple-300">&gt; DISCREPANCY DETECTED</span><span className="text-purple-500 font-bold">98% CONFIDENCE</span></div><div className="ml-2 mt-1 text-white font-bold flex gap-2"><span>LeBron James</span><span className="text-blue-400">Over 25.5 Pts</span><span className="text-gray-400">@ -110</span></div></div>
                      <div className="flex justify-between text-gray-600 opacity-50"><span>&gt; CHECKING: NFL KANSAS CITY</span><span>...</span></div>
                      <div className="flex justify-between text-gray-600 opacity-50"><span>&gt; ANALYSIS COMPLETE</span><span>[WAITING]</span></div>
                    </div>
                  </div>
                </Reveal>
              </div>
              <div className="md:order-2 md:pl-12">
                <Reveal delay={200}><div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 text-blue-400"><TrendingUp size={24} /></div><h3 className="text-3xl font-black text-white mb-4">{t('engineSection', 'Step1Title')}</h3><p className="text-gray-400 leading-relaxed">{t('engineSection', 'Step1Desc')}</p></Reveal>
              </div>
            </Reveal>

            <Reveal className="grid md:grid-cols-2 gap-12 items-center relative">
              <div className="md:order-2 relative">
                <div className="absolute left-[-3rem] top-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,1)] hidden md:block"></div>
                <Reveal className="bg-[#0f1014] border border-gray-800 rounded-2xl p-6 relative">
                  <div className="text-center text-[10px] text-purple-400 font-mono mb-4 tracking-widest">{t('engineSection', 'HybridActive')}</div>
                  <div className="flex justify-between items-center mb-6 px-4">
                    <div className="text-center"><div className="text-[10px] text-gray-500 mb-1">{t('engineSection', 'AiProjection')}</div><div className="text-white font-bold">Lakers -4</div><div className="text-[9px] text-gray-600">{t('engineSection', 'DataOnly')}</div></div>
                    <div className="h-px bg-gray-800 w-12"></div>
                    <div className="text-center"><div className="text-[10px] text-gray-500 mb-1">{t('engineSection', 'AnalystAdj')}</div><div className="text-blue-400 font-bold">{t('engineSection', 'AdjValue')}</div><div className="text-[9px] text-gray-600">{t('engineSection', 'InjuryFactor')}</div></div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 p-4 rounded-xl text-center"><div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{t('engineSection', 'FinalVerdict')}</div><div className="text-xl font-black text-white mb-1">Lakers -5.5</div><div className="text-[9px] text-green-400">{t('engineSection', 'ConfirmedBy')}</div></div>
                </Reveal>
              </div>
              <div className="md:order-1 md:pr-12 md:text-right">
                <Reveal delay={200}><div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 text-purple-400 md:ml-auto"><Zap size={24} /></div><h3 className="text-3xl font-black text-white mb-4">{t('engineSection', 'Step2Title')}</h3><p className="text-gray-400 leading-relaxed">{t('engineSection', 'Step2Desc')}</p></Reveal>
              </div>
            </Reveal>

            <Reveal className="grid md:grid-cols-2 gap-12 items-center relative">
              <div className="md:order-1 relative">
                <div className="absolute right-[-3rem] top-1/2 w-4 h-4 bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,1)] hidden md:block animate-pulse"></div>
                <Reveal className="bg-[#0f1014] border border-gray-800 rounded-2xl p-6 relative shadow-lg">
                  <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-full bg-transparent overflow-hidden"><img src={pIcon} alt="ProPickz Bot" className="w-full h-full object-cover" /></div><div><div className="text-white font-bold text-sm flex items-center gap-2">{t('engineSection', 'BotName')} <span className="bg-blue-600 text-[9px] px-1.5 rounded text-white">BOT</span></div><div className="text-[10px] text-gray-500">{t('engineSection', 'BotTime')}</div></div></div>
                  <div className="pl-12"><div className="bg-[#1e1f25] border-l-4 border-green-500 rounded-r-lg p-3 text-sm"><div className="text-green-400 font-bold mb-1 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> 💎 {t('engineSection', 'WhalePlay')}</div><div className="text-white font-bold mb-0.5">LeBron James Over 25.5 Pts</div><div className="text-gray-400 text-xs mb-1">{t('engineSection', 'OddsExample')}</div><div className="text-purple-400 text-xs font-mono">{t('engineSection', 'HybridScore')}</div></div></div>
                </Reveal>
              </div>
              <div className="md:order-2 md:pl-12">
                <Reveal delay={200}><div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20 text-green-400"><Smartphone size={24} /></div><h3 className="text-3xl font-black text-white mb-4">{t('engineSection', 'Step3Title')}</h3><p className="text-gray-400 leading-relaxed">{t('engineSection', 'Step3Desc')}</p></Reveal>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      <section id="guarantee" className="py-24 bg-gradient-to-b from-textured-black to-gray-900 border-t border-gray-900 relative overflow-hidden bg-textured-black">
        <div className="absolute inset-0 bg-purple-900/5 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <Reveal><h2 className="text-4xl md:text-5xl font-black text-white mb-6">{t('guaranteeDetailed', 'Headline')}</h2></Reveal>
          <Reveal delay={200}><p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">{t('guaranteeDetailed', 'Subheadline')}</p></Reveal>
          <Reveal delay={300}>
            <div className="bg-[#0A0A0A] border border-gray-800 rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-2xl group hover:border-purple-500/20 transition-all duration-500">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
              <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-white mb-10 flex items-center justify-center gap-3 relative z-10"><Shield size={28} className="text-purple-500" /> {t('guaranteeDetailed', 'HowItWorks')}</h3>
              <div className="grid md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto relative z-10">
                <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"><div className="text-purple-500 font-bold text-xs uppercase tracking-wider flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">1</div>{t('guaranteeDetailed', 'Step1Title')}</div><p className="text-gray-300 text-sm leading-relaxed">{t('guaranteeDetailed', 'Step1Desc')}</p></div>
                <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"><div className="text-purple-500 font-bold text-xs uppercase tracking-wider flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">2</div>{t('guaranteeDetailed', 'Step2Title')}</div><p className="text-gray-300 text-sm leading-relaxed">{t('guaranteeDetailed', 'Step2Desc')}</p></div>
                <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"><div className="text-purple-500 font-bold text-xs uppercase tracking-wider flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">3</div>{t('guaranteeDetailed', 'Step3Title')}</div><p className="text-gray-300 text-sm leading-relaxed">{t('guaranteeDetailed', 'Step3Desc')}</p></div>
                <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"><div className="text-purple-500 font-bold text-xs uppercase tracking-wider flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">4</div>{t('guaranteeDetailed', 'Step4Title')}</div><p className="text-gray-300 text-sm leading-relaxed">{t('guaranteeDetailed', 'Step4Desc')}</p></div>
              </div>
              <div className="mt-12 bg-[#0a0a0a] rounded-xl p-6 border border-gray-800 relative z-10 text-center">
                <p className="text-gray-400 text-sm italic mb-4">{t('guaranteeDetailed', 'Quote')}</p>
                <a href="https://discord.gg/wEKnBrvZUF" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white font-bold bg-purple-600/20 px-6 py-3 rounded-full border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:bg-purple-600/30 transition-all duration-300">{t('guaranteeDetailed', 'CTA')} <ArrowRight size={16} /></a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="dominance" className="py-24 bg-matt-black relative border-t border-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <Reveal><h2 className="text-4xl md:text-5xl font-black text-white mb-6">{t('dominanceSection', 'Headline')} <span className="text-green-500">{t('dominanceSection', 'HeadlineHighlight')}</span></h2></Reveal>
          <Reveal delay={300}><SportsCarousel /></Reveal>
          <Reveal delay={400}>
            <div className="mt-16 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-4">More Leagues Added Constantly</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">Our team is constantly building models for new markets including Horse Racing, E-Sports, and International Leagues. If there's an edge, we will find it.</p>
                  <button onClick={() => window.open('https://whop.com/propickzofficial/propickz-all-access/', '_blank')} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">Get All Access</button>
                </div>
              </div>
            </div>
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
    <div className="min-h-screen bg-textured-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <Reveal><h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">{t('pricing', 'HeadlineStart')} <span className="text-green-500">{t('pricing', 'HeadlineGreen')}</span><br className="hidden md:block" /> {t('pricing', 'HeadlineMid')} <span className="text-purple-500">{t('pricing', 'HeadlinePurple')}</span></h1></Reveal>
        <Reveal delay={200}><p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16">{t('pricing', 'Subheadline')}</p></Reveal>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
          <Reveal delay={300} className="glass-card glass-card-hover flex flex-col text-left p-6 rounded-3xl">
            <h3 className="text-xl font-bold text-gray-400 mb-2">{t('pricing', 'FreePlan')}</h3>
            <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-bold text-white">$0</span><span className="text-gray-500">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-300 text-sm"><Gift className="text-yellow-500 shrink-0" size={18} /> Entry to Monthly Lottery (Win Cash)</li>
              <li className="flex gap-3 text-gray-300 text-sm"><TrendingUp className="text-green-500 shrink-0" size={18} /> Access to 5-0 Free Picks Run</li>
              <li className="flex gap-3 text-gray-300 text-sm"><LayoutDashboard className="text-blue-500 shrink-0" size={18} /> Access to Results Tracker</li>
              <li className="flex gap-3 text-gray-500 text-sm italic">Great way to test Propickz</li>
            </ul>
            <button onClick={() => window.open('https://discord.gg/wEKnBrvZUF', '_blank')} className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors">{t('pricing', 'FreeCTA')}</button>
          </Reveal>
          <Reveal delay={400} className="bg-black border border-purple-500 rounded-3xl p-6 relative shadow-[0_0_40px_rgba(147,51,234,0.3)] transform md:scale-105 z-10 flex flex-col text-left animate-border-beam">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-heading shadow-lg">{t('pricing', 'MostPopular')}</div>
            <h3 className="text-xl font-bold text-white mb-2">{t('pricing', 'ProPlan')}</h3>
            <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-bold text-white">$74.99</span><span className="text-gray-500">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-white text-sm font-bold"><CheckCircle className="text-purple-400 shrink-0" size={18} /> Full access to all picks</li>
              <li className="flex gap-3 text-white text-sm font-bold"><Layers className="text-purple-400 shrink-0" size={18} /> Parlays (Safe & Risky)</li>
              <li className="flex gap-3 text-white text-sm font-bold"><TrendingUp className="text-purple-400 shrink-0" size={18} /> Ladder Challenges</li>
              <li className="flex gap-3 text-white text-sm font-bold"><Gift className="text-yellow-400 shrink-0" size={18} /> Full Giveaway Access</li>
              <li className="flex gap-3 text-white text-sm font-bold"><BookOpen className="text-purple-400 shrink-0" size={18} /> Education Section</li>
              <li className="flex gap-3 text-gray-400 text-sm">Included in Member Lottery</li>
            </ul>
            <button onClick={() => window.open('https://whop.com/propickzofficial/propickz-all-access/', '_blank')} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-900/40">{t('pricing', 'MonthlyCTA')}</button>
          </Reveal>
          <Reveal delay={500} className="glass-card glass-card-hover flex flex-col text-left p-6 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-2">{t('pricing', 'Quarterly')}</h3>
            <div className="flex items-baseline gap-1 mb-1"><span className="text-4xl font-bold text-white">$189</span><span className="text-gray-500">/qtr</span></div>
            <p className="text-green-400 text-xs font-bold mb-6">Save 15% vs Monthly</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> All Pro Features included</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Star className="text-purple-500 shrink-0" size={18} /> Priority Support</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Users className="text-purple-500 shrink-0" size={18} /> Exclusive Discord Channels</li>
            </ul>
            <button onClick={() => window.open('https://whop.com/propickzofficial/propickz-all-access/', '_blank')} className="w-full py-3 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-colors">{t('pricing', 'QuarterlyCTA')}</button>
          </Reveal>
          <Reveal delay={600} className="glass-card glass-card-hover flex flex-col text-left p-6 rounded-3xl border border-yellow-500/20">
            <div className="absolute top-0 right-0 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-wider">Best Value</div>
            <h3 className="text-xl font-bold text-white mb-2">{t('pricing', 'Yearly')}</h3>
            <div className="flex items-baseline gap-1 mb-1"><span className="text-4xl font-bold text-white">$649</span><span className="text-gray-500">/yr</span></div>
            <p className="text-green-400 text-xs font-bold mb-6">Save 33% vs Monthly</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-300 text-sm"><CheckCircle className="text-purple-500 shrink-0" size={18} /> Full Access for 12 Months</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Trophy className="text-green-500 shrink-0" size={18} /> Perfect for serious bettors</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Target className="text-green-500 shrink-0" size={18} /> Long-term strategy focus</li>
              <li className="flex gap-3 text-gray-300 text-sm"><Shield className="text-green-500 shrink-0" size={18} /> Maximize Bankroll Growth</li>
            </ul>
            <button onClick={() => window.open('https://whop.com/propickzofficial/propickz-all-access/', '_blank')} className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">{t('pricing', 'AnnualCTA')}</button>
          </Reveal>
        </div>
        <Reveal delay={700}><CommunityBenefits /></Reveal>
        <Reveal delay={500}><div className="text-center"><p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('pricing', 'Guarantee')}</p></div></Reveal>
      </div>
    </div>
  );
};

// --- 9. HOW IT WORKS PAGE COMPONENT ---

const HowItWorksPage: React.FC = () => {
  const { t } = useLanguage();
  // REMOVED REF HERE

  return (
    <div className="min-h-screen bg-matt-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-24 pt-12 border-t border-gray-800/50">
          <Reveal><h1 className="text-3xl md:text-5xl font-black text-white mb-6">{t('engineSection', 'Title')} <span className="text-purple-500">{t('engineSection', 'TitleHighlight')}</span></h1></Reveal>
          <Reveal delay={200}><p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">{t('engineSection', 'Description')}</p></Reveal>
        </div>
        <div className="space-y-16 md:space-y-32 relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent block"></div>
          {/* REMOVED: Moving bar is completely gone */}
          <Reveal className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative pl-12 md:pl-0">
            <div className="md:text-right order-1 md:order-1 relative">
              <div className="absolute -left-[30px] top-6 w-2 h-6 bg-blue-500 rounded-sm md:hidden shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
              <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-0 mb-4 md:mb-0"><div className="inline-block p-2 md:p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 md:mb-4 shrink-0"><TrendingUp size={24} className="md:w-8 md:h-8 text-blue-400" /></div><h3 className="text-2xl md:text-3xl font-bold text-white max-w-[200px] md:max-w-none text-left md:text-right">{t('engineSection', 'Step1Title')}</h3></div>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base text-left md:text-right">{t('engineSection', 'Step1Desc')}</p>
            </div>
            <div className="order-2 md:order-2 relative">
              <div className="absolute left-0 top-1/2 -translate-x-1/2 w-3 h-10 bg-blue-500 rounded-sm hidden md:block shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
              <div className="bg-gray-900/50 border border-gray-800 p-4 md:p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden max-w-[320px] mx-auto md:max-w-none md:mx-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-slide-in-left"></div>
                <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2"><span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{t('engineSection', 'LiveMarketFeed')}</span><div className="flex gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span><span className="text-xs text-gray-500">{t('engineSection', 'Scanning')}</span></div></div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded bg-gray-800/30 opacity-50"><span className="text-gray-400 text-xs md:text-sm">NBA: LAL vs GSW</span><span className="text-gray-600 text-[10px] md:text-xs">{t('engineSection', 'Checking')}</span></div>
                  <div className="flex items-center justify-between p-2 rounded bg-gray-800/30 opacity-50"><span className="text-gray-400 text-xs md:text-sm">NFL: KC vs BUF</span><span className="text-gray-600 text-[10px] md:text-xs">{t('engineSection', 'Checking')}</span></div>
                  <div className="flex items-center justify-between p-3 rounded bg-blue-500/10 border border-blue-500/30 transform scale-100 md:scale-105 transition-all"><div className="flex flex-col"><span className="text-white font-bold text-xs md:text-sm">LeBron James</span><span className="text-blue-300 text-[10px] md:text-xs">{t('engineSection', 'OverPoints').replace('{points}', '25.5')}</span></div><div className="text-right"><span className="block text-white font-bold text-sm">-110</span><span className="text-green-400 text-[10px] md:text-xs font-bold">{t('engineSection', 'DiscrepancyFound')}</span></div></div>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative pl-12 md:pl-0">
            <div className="order-2 relative">
              <div className="absolute right-0 top-1/2 translate-x-1/2 w-3 h-10 bg-purple-500 rounded-sm hidden md:block shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 md:p-8 rounded-3xl backdrop-blur-sm max-w-[320px] mx-auto md:max-w-none md:mx-0">
                <div className="font-mono text-xs text-purple-300 mb-4 text-center">&gt;&gt; {t('engineSection', 'HybridActive')}</div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between"><div className="text-center"><div className="text-gray-500 text-[10px] md:text-xs mb-1">{t('engineSection', 'AiProjection')}</div><div className="text-base md:text-lg font-bold text-white">Lakers -4</div><div className="text-[10px] md:text-xs text-gray-600">{t('engineSection', 'DataOnly')}</div></div><div className="h-px w-8 md:w-12 bg-gray-700"></div><div className="text-center"><div className="text-gray-500 text-[10px] md:text-xs mb-1">{t('engineSection', 'AnalystAdj')}</div><div className="text-base md:text-lg font-bold text-blue-400">{t('engineSection', 'AdjValue')}</div><div className="text-[10px] md:text-xs text-gray-600">{t('engineSection', 'InjuryFactor')}</div></div></div>
                  <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl text-center"><div className="text-purple-400 font-bold text-xs md:text-sm">{t('engineSection', 'FinalVerdict')}: LAKERS -5.5</div><div className="text-gray-400 text-[10px] md:text-xs mt-1">{t('engineSection', 'ConfirmedBy')}</div></div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="absolute -left-[30px] top-6 w-2 h-6 bg-purple-500 rounded-sm md:hidden shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 mb-4 md:mb-0"><div className="inline-block p-2 md:p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 md:mb-4 shrink-0"><Zap size={24} className="md:w-8 md:h-8 text-purple-400" /></div><h3 className="text-2xl md:text-3xl font-bold text-white max-w-[200px] md:max-w-none">{t('engineSection', 'Step2Title')}</h3></div>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">{t('engineSection', 'Step2Desc')}</p>
            </div>
          </Reveal>
          <Reveal className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative pl-12 md:pl-0">
            <div className="md:text-right order-1 md:order-1 relative">
              <div className="absolute -left-[30px] top-6 w-2 h-6 bg-green-500 rounded-sm md:hidden shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
              <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-0 mb-4 md:mb-0"><div className="inline-block p-2 md:p-3 rounded-2xl bg-green-500/10 border border-green-500/30 md:mb-4 shrink-0"><Smartphone size={24} className="md:w-8 md:h-8 text-green-400" /></div><h3 className="text-2xl md:text-3xl font-bold text-white max-w-[200px] md:max-w-none text-left md:text-right">{t('engineSection', 'Step3Title')}</h3></div>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base text-left md:text-right">{t('engineSection', 'Step3Desc')}</p>
            </div>
            <div className="order-2 md:order-2 relative">
              <div className="absolute left-0 top-1/2 -translate-x-1/2 w-3 h-10 bg-green-500 rounded-sm hidden md:block shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 md:p-6 rounded-3xl backdrop-blur-sm max-w-[320px] mx-auto md:max-w-sm md:mx-0">
                <div className="flex items-center gap-3 mb-4"><img src={pIcon} alt="Bot" className="w-10 h-10 rounded-full object-cover" /><div><div className="text-white font-bold text-sm">{t('engineSection', 'BotName')}</div><div className="text-gray-500 text-xs">{t('engineSection', 'BotTime')}</div></div></div>
                <div className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-green-500 mb-2"><div className="text-green-400 font-bold text-sm mb-1">💎 {t('engineSection', 'WhalePlay')}</div><div className="text-white text-sm">LeBron James Over 25.5 Pts</div><div className="text-gray-400 text-xs mt-1">{t('engineSection', 'OddsExample')}</div><div className="text-purple-400 text-xs font-bold mt-1">{t('engineSection', 'HybridScore')}</div></div>
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
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-textured-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <div className="mb-12">
          <Reveal><h1 className="text-4xl md:text-6xl font-black text-white mb-6">{t('dominanceSection', 'Headline')} <span className="text-green-500">{t('dominanceSection', 'HeadlineHighlight')}</span></h1></Reveal>
          <Reveal delay={200}><p className="text-xl text-gray-400 max-w-2xl mx-auto">{t('dominanceSection', 'Subheadline')}</p></Reveal>
        </div>
        <Reveal delay={300}><SportsCarousel /></Reveal>
      </div>
    </div>
  );
};

// --- 11. FAQ PAGE COMPONENT ---

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();
  const faqs: FaqItem[] = [
    { q: t('faq', 'q1'), a: t('faq', 'a1') }, { q: t('faq', 'q2'), a: t('faq', 'a2') }, { q: t('faq', 'q3'), a: t('faq', 'a3') }, { q: t('faq', 'q4'), a: t('faq', 'a4') },
    { q: t('faq', 'q5'), a: t('faq', 'a5') }, { q: t('faq', 'q6'), a: t('faq', 'a6') }, { q: t('faq', 'q7'), a: t('faq', 'a7') }, { q: t('faq', 'q8'), a: t('faq', 'a8') },
  ];

  return (
    <div className="min-h-screen bg-matt-black pt-24 pb-20 relative overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-black z-0"></div>
      <div className="max-w-3xl mx-auto px-4 relative z-10 w-full">
        <div className="text-center mb-12"><Reveal><h1 className="text-4xl font-bold text-white mb-2">{t('faq', 'Headline')}</h1></Reveal></div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === i ? 'bg-[#151720]' : 'bg-[#0f1219] hover:bg-[#151720]'}`}>
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex justify-between items-center p-5 text-left"><span className="text-base md:text-lg font-medium text-white">{faq.q}</span><ChevronDown className={`text-purple-500 transition-transform duration-300 transform ${openIndex === i ? 'rotate-180' : ''}`} size={20} /></button>
                <div className={`px-5 text-gray-400 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}><p className="text-sm md:text-base border-t border-gray-800/50 pt-4">{faq.a}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={600} className="mt-16 text-center"><p className="text-gray-500 text-sm">{t('faq', 'MoreQuestions')} <a href="mailto:support@propickz.com" className="text-white underline hover:text-purple-400 transition-colors">{t('faq', 'ContactSupport')}</a></p></Reveal>
      </div>
    </div>
  );
};

// --- 8. GUARANTEE PAGE COMPONENT ---

const GuaranteePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="max-w-4xl mx-auto px-4 relative z-10 w-full"></div>
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
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Proven <span className="text-green-500">Results.</span></h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16">Real wins from real members. The math speaks for itself.</p>
        <div className="mb-24"><ResultsDashboard /></div>
        <div><WinningSlips /></div>
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
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Legal</h1>
        <p className="text-gray-400 mb-12">Effective Date: June 1, 2025</p>
        <div className="space-y-12 text-gray-300 leading-relaxed font-light">
          <p>These Terms & Conditions (“Terms”) govern your access to and use of the Propickz platform...</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
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
        <h1 className="text-4xl md:text-6xl font-black text-white mb-16 text-center animate-fade-in-up">Why You Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Trust Us.</span></h1>
      </div>
    </div>
  );
};

const FreeTrialPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
    </div>
  );
};

// --- 7. MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [view, setView] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { initFirebase(); }, []);

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
      case 'FAQ': return <FAQPage />;
      case 'Legal': return <LegalPage />;
      default: return <div className="p-20 text-center text-white bg-black min-h-screen">Placeholder for {view}</div>;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
        <Navbar setView={setView} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} currentView={view} />
        <main className="relative z-10">{renderView()}</main>
        <Footer />
        <EarningsPopup />
        {view === 'Home' && <FomoNotification />}
        <ScrollProgressIndicator />
      </div>
    </LanguageProvider>
  );
};

export default App;