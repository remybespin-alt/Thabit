import { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Message, Role, UserPhase } from '../types';
import { getSystemInstruction } from '../constants';

export const useGeminiChat = (phase: UserPhase) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  // Initialize Chat Session
  const initChat = useCallback(() => {
    if (!process.env.API_KEY) {
      console.error("API Key is missing!");
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = getSystemInstruction(phase);
    
    const newChat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Warm and empathetic
      },
    });

    setChatSession(newChat);
  }, [phase]);

  useEffect(() => {
    initChat();
  }, [initChat]);

  const sendMessage = async (content: string, isPanic: boolean = false) => {
    if (!chatSession) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: content });
      const responseText = result.text || "I am having trouble finding the right words. Please give me a moment.";

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: responseText,
        timestamp: new Date(),
        isPanicResponse: isPanic
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: "I apologize, but I'm having trouble connecting right now. Please check your internet connection and try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerPanicProtocol = useCallback(() => {
    const hiddenPrompt = "[SYSTEM ALERT: User pressed PANIC BUTTON. They feel they messed up or sinned. HALT ALL TEACHING. Activate 'Emergency Reassurance' script immediately.]";
    // We send the hidden prompt to the AI, but we don't necessarily need to show this specific prompt in the UI history if we want to keep it clean. 
    // However, to keep state simple, we'll just send it.
    sendMessage(hiddenPrompt, true);
  }, [chatSession]); // Dependencies

  const resetChat = (newPhase: UserPhase) => {
    setMessages([]);
    // The useEffect will handle re-initialization because `phase` is a dependency of initChat
  };

  return {
    messages,
    isLoading,
    sendMessage,
    triggerPanicProtocol,
    resetChat
  };
};