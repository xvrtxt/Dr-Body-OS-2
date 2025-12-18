import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, UserProfile } from '../types';
import { initializeChat, sendMessageToDrBody } from '../services/geminiService';
import { Send, User, Bot, AlertTriangle } from 'lucide-react';

interface ChatDoctorProps {
  user: UserProfile;
}

const ChatDoctor: React.FC<ChatDoctorProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat(user);
    // Add initial greeting
    setMessages([{
      id: 'init',
      role: 'model',
      text: `Здравствуйте, ${user.name}. Я Dr Body OS. Готов ответить на вопросы о вашем самочувствии, лекарствах или режиме дня. Что вас беспокоит?`,
      timestamp: Date.now()
    }]);
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToDrBody(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 bg-turquoise-50 border-b border-turquoise-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-turquoise-200 rounded-full">
                <Bot className="w-6 h-6 text-turquoise-800" />
            </div>
            <div>
                <h3 className="font-bold text-slate-800">Dr Body OS</h3>
                <p className="text-xs text-turquoise-700">Всегда на связи • AI Ассистент</p>
            </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start space-x-3">
             <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
             <p className="text-xs text-yellow-800">
                Внимание: Dr Body OS не заменяет живого врача. При острых болях, кровотечениях или угрозе жизни немедленно вызывайте скорую помощь.
             </p>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-turquoise-500 text-white rounded-tr-none shadow-md shadow-turquoise-100'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-turquoise-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-turquoise-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-turquoise-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Опишите симптомы или задайте вопрос..."
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-turquoise-300 focus:outline-none resize-none h-14"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-4 bg-turquoise-500 hover:bg-turquoise-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-turquoise-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDoctor;