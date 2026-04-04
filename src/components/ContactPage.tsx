import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ContactPage: React.FC = () => {
    const { t } = useLanguage();
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedSubject = subject || t('contact', 'OptionGeneral');
        const mailSubject = `[Website Inquiry] ${selectedSubject}`;
        const mailBody = [
            `Name: ${name}`,
            `Email: ${email}`,
            `Subject: ${selectedSubject}`,
            '',
            'Message:',
            message,
        ].join('\n');

        window.location.href = `mailto:propickz.business@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                        {t('contact', 'Title')}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        {t('contact', 'Subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info / Discord CTA */}
                    <div className="space-y-8 animate-fade-in-up delay-100">
                        <div className="glass-card p-8 rounded-3xl">
                            <h3 className="text-2xl font-bold text-white mb-6">{t('contact', 'DiscordCTA')}</h3>
                            <p className="text-gray-400 mb-8">
                                {t('contact', 'DiscordText')}
                            </p>
                            <button
                                onClick={() => window.open('https://discord.gg/wEKnBrvZUF', '_blank')}
                                className="w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <MessageSquare size={20} /> {t('contact', 'DiscordButton')}
                            </button>
                        </div>

                        <div className="glass-card p-8 rounded-3xl">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 font-bold uppercase">{t('contact', 'EmailLabel')}</div>
                                        <div className="text-white">propickz.business@gmail.com</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="glass-card p-8 rounded-3xl animate-fade-in-up delay-200">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                                    <CheckCircle size={40} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{t('contact', 'MessageSentTitle')}</h3>
                                <p className="text-gray-400">{t('contact', 'Success')}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">{t('contact', 'Name')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">{t('contact', 'Email')}</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">{t('contact', 'Subject')}</label>
                                    <select
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    >
                                        <option value="">{t('contact', 'OptionGeneral')}</option>
                                        <option value={t('contact', 'OptionBilling')}>{t('contact', 'OptionBilling')}</option>
                                        <option value={t('contact', 'OptionTech')}>{t('contact', 'OptionTech')}</option>
                                        <option value={t('contact', 'OptionPartner')}>{t('contact', 'OptionPartner')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">{t('contact', 'Message')}</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    {t('contact', 'Send')} <Send size={18} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
