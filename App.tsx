import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Menu, 
  ShieldAlert, 
  Leaf, 
  BookOpen, 
  Anchor, 
  Settings,
  X
} from 'lucide-react';
import { useGeminiChat } from './hooks/useGeminiChat';
import { MessageList } from './components/MessageList';
import { UserPhase } from './types';
import { PHASES } from './constants';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<UserPhase>(UserPhase.STABILIZE);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    triggerPanicProtocol,
    resetChat
  } = useGeminiChat(currentPhase);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const text = inputText;
    setInputText('');
    await sendMessage(text);
  };

  const handlePanic = () => {
    triggerPanicProtocol();
    setIsSidebarOpen(false);
  };

  const changePhase = (phase: UserPhase) => {
    setCurrentPhase(phase);
    resetChat(phase); // Reset chat context when phase changes to re-align system instruction
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900 md:flex-row overflow-hidden">
      
      {/* Mobile Header */}
      <div className="flex items-center justify-between bg-emerald-800 p-4 text-white md:hidden shadow-md z-20">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-emerald-300" />
          <h1 className="text-xl font-serif font-medium">Thabit</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar / Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 transform bg-emerald-900 text-white transition-transform duration-300 ease-in-out shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:shadow-none flex flex-col
      `}>
        <div className="p-6 hidden md:flex items-center gap-3 border-b border-emerald-800">
          <Leaf className="h-8 w-8 text-emerald-400" />
          <h1 className="text-2xl font-serif font-bold tracking-wide">Thabit</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          
          {/* Panic Button */}
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
            <h3 className="text-red-300 font-bold flex items-center gap-2 mb-2 text-sm uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4" /> Emergency
            </h3>
            <p className="text-xs text-red-100 mb-3 opacity-80">
              Feeling overwhelmed? Did you mess up? Click here for immediate support.
            </p>
            <button 
              onClick={handlePanic}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <ShieldAlert className="h-4 w-4" />
              Panic Button
            </button>
          </div>

          {/* Phase Selection */}
          <div>
            <h3 className="text-emerald-300 font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
              <Settings className="h-4 w-4" /> Your Journey
            </h3>
            <div className="space-y-3">
              {Object.values(PHASES).map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => changePhase(phase.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all border ${
                    currentPhase === phase.id
                      ? 'bg-emerald-800 border-emerald-500 ring-1 ring-emerald-400'
                      : 'bg-emerald-900/50 border-transparent hover:bg-emerald-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 font-medium text-emerald-50">
                    {phase.id === UserPhase.STABILIZE && <Leaf className="h-4 w-4" />}
                    {phase.id === UserPhase.CONSOLIDATE && <BookOpen className="h-4 w-4" />}
                    {phase.id === UserPhase.ROOT && <Anchor className="h-4 w-4" />}
                    {phase.label}
                  </div>
                  <div className="text-xs text-emerald-300/80 leading-relaxed">
                    {phase.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-emerald-800 text-xs text-emerald-400/60 text-center">
          Thabit AI Companion &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-[#FDFCF8] relative">
        {/* Overlay for mobile drawer */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <div className="max-w-3xl mx-auto space-y-6 pb-4">
            {messages.length === 0 ? (
              <div className="text-center mt-20 space-y-4 opacity-60">
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-serif text-slate-700">As-salamu alaykum</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                  I am Thabit. I am here to help you take this journey one step at a time. 
                  How is your heart feeling today?
                </p>
              </div>
            ) : (
              <MessageList messages={messages} isLoading={isLoading} />
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-100 p-4 shadow-sm z-10">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSendMessage} className="relative flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-100 transition-all">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask me anything... (Shift+Enter for new line)"
                className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-2.5 px-3 text-slate-700 placeholder:text-slate-400"
                rows={1}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="mb-1 p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
            <div className="text-center mt-2">
              <p className="text-[10px] text-slate-400">
                Thabit can make mistakes. Please consult a local scholar for complex rulings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}