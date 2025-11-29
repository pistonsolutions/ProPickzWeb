import React, { useState } from 'react';
import { generateContent } from './api/gemini';
import { Send, Sparkles, Loader2, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !apiKey.trim()) return;

    setLoading(true);
    setResponse('');
    try {
      const result = await generateContent(prompt, apiKey);
      setResponse(result);
    } catch (error) {
      setResponse('Error: Failed to fetch response. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative p-8 bg-slate-900 text-slate-50 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none z-0"></div>

      <main className="z-10 w-full max-w-3xl flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="text-indigo-500" size={32} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
              ProPickz AI
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Unlock the power of Gemini 1.5 Flash</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 h-[600px]"
        >
          {/* API Key Input */}
          <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-xl focus-within:border-indigo-500 transition-colors">
            <Key size={20} className="ml-4 text-slate-400" />
            <input
              type="password"
              placeholder="Enter your Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-4 bg-transparent border-none text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Response Area */}
          <div className="flex-1 bg-slate-900/30 rounded-2xl p-6 overflow-y-auto relative">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center gap-4 text-indigo-400"
                >
                  <Loader2 className="animate-spin" size={48} />
                  <p>Generating insights...</p>
                </motion.div>
              ) : response ? (
                <motion.div
                  key="response"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-slate-200"
                >
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed">{response}</pre>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center text-slate-500 text-lg"
                >
                  <p>Ask anything. Get instant answers.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="mt-auto">
            <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-xl focus-within:border-indigo-500 transition-colors pr-2">
              <input
                type="text"
                placeholder="What's on your mind?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-4 bg-transparent border-none text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !prompt || !apiKey}
                className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

export default App;
