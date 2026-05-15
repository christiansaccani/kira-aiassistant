import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Plus, 
  MessageSquare, 
  User, 
  Settings, 
  Cpu, 
  Zap, 
  Activity,
  Box,
  Compass,
  Layout,
  Maximize2,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendMessageToKira } from './lib/gemini';

// --- Types ---
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Stats {
  latency: string;
  cost: string;
}

interface ChatThread {
  id: string;
  title: string;
  lastUpdate: string;
}

// --- Components ---

const Header = ({ isDarkMode, setIsDarkMode }: { isDarkMode: boolean; setIsDarkMode: (val: boolean) => void }) => (
  <header className="h-14 sm:h-16 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-8 pt-1 sm:pt-3 shadow-sm z-20 shrink-0 transition-colors duration-1000">
    <div className="flex items-center gap-3 h-full">
      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center shrink-0 transition-colors duration-1000">
        <div className="h-3 w-3 sm:h-3.5 sm:w-3.5 border-2 border-white dark:border-slate-900 rounded-sm rotate-45 transition-colors duration-1000"></div>
      </div>
      <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none transition-colors duration-1000">Kira Assistant</span>
    </div>

    {/* Mobile Theme Toggle */}
    <button 
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="flex sm:hidden h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-700 dark:text-slate-300 transition-all active:scale-90"
      title={isDarkMode ? 'Passa al Tema Chiaro' : 'Passa al Tema Scuro'}
    >
      <Palette size={18} className={`${isDarkMode ? 'rotate-180' : 'rotate-0'} transition-transform duration-500`} />
    </button>
  </header>
);

const Sidebar = () => (
  <aside className="w-80 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex shrink-0 overflow-y-auto transition-colors duration-1000">
    <div className="px-8 py-12 space-y-4 font-sans">
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 transition-colors duration-1000">Digital Architect</h2>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-1000">Christian Saccani</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed transition-colors duration-1000">
          Digital Architect specializzato nella progettazione di ecosistemi digitali scalabili che uniscono performance, robustezza e design intuitivo.
        </p>
      </section>
 
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 transition-colors duration-1000">Stack Tecnologico</h3>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-bold uppercase">
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 rounded-md dark:text-slate-300 transition-colors duration-1000">React</div>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 rounded-md dark:text-slate-300 transition-colors duration-1000">Python</div>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 rounded-md dark:text-slate-300 transition-colors duration-1000">Java</div>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 rounded-md dark:text-slate-300 transition-colors duration-1000">Javascript</div>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 rounded-md dark:text-slate-300 transition-colors duration-1000">Next.js</div>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 rounded-md dark:text-slate-300 transition-colors duration-1000">Vue.js</div>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 rounded-md dark:text-slate-300 transition-colors duration-1000">MySQL</div>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 rounded-md dark:text-slate-300 transition-colors duration-1000">HTML5/CSS3</div>
        </div>
      </section>
 
      <div className="pt-4">
        <div className="rounded-xl bg-slate-900 dark:bg-white p-6 text-white dark:text-slate-900 text-center space-y-4 shadow-xl transition-colors duration-1000">
          <p className="text-xs font-medium opacity-80 transition-opacity duration-1000 text-white dark:text-slate-900">Hai un progetto in mente?</p>
          <a href="mailto:christian.saccani99@gmail.com" className="block w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-1000">
            Parliamo dei dettagli
          </a>
        </div>
      </div>
    </div>
  </aside>
);

const ChatSimulation = ({ onUpdateStats }: { onUpdateStats: (latency: number, chars: number) => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Benvenuto nello Studio. Sono Kira, la tua assistente virtuale. Come posso supportare il tuo progetto oggi?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MESSAGE_LIMIT = 100;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || userMessageCount >= MESSAGE_LIMIT) return;

    const startTime = Date.now();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setUserMessageCount(prev => prev + 1);

    try {
      const text = await sendMessageToKira([...messages, userMessage]);

      const endTime = Date.now();
      
      // Update stats
      onUpdateStats(endTime - startTime, text.length);

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error("Gemini API Error Detail:", error);
      let errorMessage = "Interferenza rilevata. Il server non ha risposto correttamente.";
      
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorMessage = "Chiave API mancante o non valida. Controlla le impostazioni.";
        } else if (error.message.includes("fetch")) {
          errorMessage = "Errore di connessione. Controlla la tua rete.";
        }
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden relative border-r border-slate-200 dark:border-slate-800 transition-colors duration-1000">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600"></div>
      
      <div className="flex-1 overflow-y-auto p-3 sm:p-8 space-y-4 sm:space-y-6 scrollbar-hide">
        <div className="max-w-2xl mx-auto w-full mb-4 sm:mb-12 text-center space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors duration-1000">
            Live Simulation Window
          </div>
          <h3 className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm italic transition-colors duration-1000">Puoi interagire con l'assistente in tempo reale per testare le sue capacità.</h3>
        </div>

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`w-full max-w-2xl mx-auto flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-sm transition-colors duration-1000 ${
                msg.role === 'assistant' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700' 
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
              }`}>
                {msg.role === 'assistant' ? 'KI' : 'CH'}
              </div>
              <div className={`flex-1 space-y-1 sm:space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white transition-colors duration-1000">{msg.role === 'assistant' ? 'Kira' : 'Christian'}</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-tighter transition-colors duration-1000">{msg.timestamp}</span>
                </div>
                <div className={`inline-block p-3 sm:p-4 shadow-sm border text-xs sm:text-sm leading-relaxed transition-colors duration-1000 ${
                  msg.role === 'assistant' 
                    ? 'rounded-xl rounded-tl-none bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200' 
                    : 'rounded-xl rounded-tr-none bg-slate-900 dark:bg-white border-slate-800 dark:border-slate-200 text-white dark:text-slate-900'
                }`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a 
                          {...props} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`font-bold underline transition-colors ${
                            msg.role === 'assistant'
                              ? 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-500'
                              : 'text-indigo-200 hover:text-white'
                          }`}
                        />
                      ),
                      p: ({ node, ...props }) => <p {...props} className="mb-0" />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="w-full max-w-2xl mx-auto flex gap-4">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-xs animate-pulse transition-colors duration-1000">KI</div>
            <div className="inline-block rounded-xl rounded-tl-none bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-1000">
               <div className="flex gap-1">
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 transition-colors duration-1000">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {userMessageCount >= MESSAGE_LIMIT && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-1 sm:mb-2 p-2 sm:p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-[10px] sm:text-xs font-medium text-center"
            >
              Limite messaggi raggiunto. Grazie per aver parlato con Kira!
            </motion.div>
          )}
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={userMessageCount >= MESSAGE_LIMIT}
                placeholder={userMessageCount >= MESSAGE_LIMIT ? "Sessione terminata" : "Scrivi un messaggio..."} 
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 sm:py-3 pl-4 pr-12 text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 transition-all disabled:opacity-50"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim() || userMessageCount >= MESSAGE_LIMIT}
                className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-white dark:text-slate-900 transition-all ${
                  isLoading || !input.trim() || userMessageCount >= MESSAGE_LIMIT ? 'bg-slate-300 dark:bg-slate-700' : 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100'
                }`}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center max-w-2xl mx-auto mt-2 sm:mt-3">
          <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-medium">Powered by Gemini AI</p>
          <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-medium">
            {userMessageCount}/{MESSAGE_LIMIT}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [stats, setStats] = useState<Stats>({
    latency: 'Optimal',
    cost: '$0.00'
  });
  const [totalChars, setTotalChars] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleUpdateStats = (latencyMs: number, newChars: number) => {
    const updatedTotalChars = totalChars + newChars;
    setTotalChars(updatedTotalChars);
    
    const calculatedCost = (updatedTotalChars / 4 / 1000000) * 0.10;
    
    setStats({
      latency: `${latencyMs}ms`,
      cost: `$${calculatedCost.toFixed(6)}`
    });
  };

  return (
    <div className={`flex h-screen w-full flex-col font-sans transition-colors duration-1000 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'} overflow-hidden`}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ChatSimulation onUpdateStats={handleUpdateStats} />
        <aside className="w-72 flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden xl:flex shrink-0 overflow-y-auto transition-colors duration-1000">
          <div className="px-6 py-12 space-y-4 flex flex-col">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 transition-colors duration-1000">Architettura & Costi</h3>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors duration-1000">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors duration-1000">
                  <Zap size={16} className="text-amber-500" />
                  <span>Zero-Cost Ready</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal transition-colors duration-1000">
                  Sviluppato per girare interamente su piani gratuiti. Gemini 1.5 Flash offre un free tier generoso per piccoli volumi.
                </p>
                <div className="flex items-center gap-2 px-2 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 w-fit transition-colors duration-1000">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 uppercase leading-none transition-colors duration-1000">100% Free Tier</span>
                </div>
              </div>
            </div>
 
            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 w-full shrink-0 transition-colors duration-1000"></div>
 
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 transition-colors duration-1000">Live Telemetry</h3>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2 border border-slate-100 dark:border-slate-800 transition-colors duration-1000">
                <div className="flex justify-between items-center text-[10px] gap-2 transition-colors duration-1000">
                  <span className="text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap">Latency</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold truncate transition-colors duration-1000">{stats.latency}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] gap-2 transition-colors duration-1000">
                  <span className="text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap">Est. Cost</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold truncate transition-colors duration-1000">{stats.cost}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] gap-2 transition-colors duration-1000">
                  <span className="text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap">API Tier</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase truncate transition-colors duration-1000">Free</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Template Toggle In Basso a Destra (Solo Desktop) */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed hidden sm:flex bottom-6 right-6 h-12 w-12 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl items-center justify-center hover:scale-110 transition-all z-50"
        title={isDarkMode ? 'Passa al Tema Chiaro' : 'Passa al Tema Scuro'}
      >
        <Palette size={22} className={`${isDarkMode ? 'rotate-180' : 'rotate-0'} transition-transform duration-500`} />
      </button>
    </div>
  );
}

