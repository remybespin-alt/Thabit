import React from 'react';
import { Message, Role } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { User, Leaf, Loader2 } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  return (
    <div className="flex flex-col gap-6">
      {messages.map((msg) => {
        const isUser = msg.role === Role.USER;
        const isSystemHidden = msg.content.includes("[SYSTEM ALERT:");
        
        // Hide the system trigger message from the UI to maintain immersion
        if (isSystemHidden) return null;

        return (
          <div
            key={msg.id}
            className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`
                flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm mt-1
                ${isUser ? 'bg-slate-200 text-slate-600' : 'bg-emerald-600 text-white'}
              `}>
                {isUser ? <User size={16} /> : <Leaf size={16} />}
              </div>

              {/* Bubble */}
              <div className={`
                relative p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed
                ${isUser 
                  ? 'bg-white text-slate-800 border border-slate-100 rounded-tr-none' 
                  : 'bg-emerald-50/80 text-slate-800 border border-emerald-100 rounded-tl-none'}
                ${msg.isPanicResponse ? 'border-red-200 bg-red-50' : ''}
              `}>
                <MarkdownRenderer content={msg.content} />
                <div className={`text-[10px] mt-2 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className="flex w-full justify-start">
           <div className="flex max-w-[75%] gap-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm mt-1">
                <Leaf size={16} />
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-2xl rounded-tl-none border border-emerald-100 flex items-center gap-2 text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs">Thabit is thinking...</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};