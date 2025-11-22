
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, User, Smile, Image as ImageIcon, MoreHorizontal } from 'lucide-react';

interface LiveChatProps {
  onClose: () => void;
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  time: string;
  isSystem?: boolean;
}

const LiveChat: React.FC<LiveChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "正在为您连接人工客服...", isUser: false, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), isSystem: true }
  ]);
  const [input, setInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAgentTyping]);

  useEffect(() => {
    // Simulate agent connection sequence
    const timer1 = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: 2,
        text: "客服专员 [工号886] 已加入会话。",
        isUser: false,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        isSystem: true
      }]);
      setIsAgentTyping(true);
    }, 1500);

    const timer2 = setTimeout(() => {
      setIsAgentTyping(false);
      setMessages(prev => [...prev, {
        id: 3,
        text: "尊贵的会员您好，我是您的专属客服。请问有什么可以帮您？",
        isUser: false,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: input,
      isUser: true,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsAgentTyping(true);

    // Simulate auto-reply
    setTimeout(() => {
      setIsAgentTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "收到，正在为您查询相关信息，请稍候...",
        isUser: false,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4 animate-fade-in">
      <div className="bg-slate-100 w-full sm:max-w-md h-[85vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up border border-white/20">
        {/* Header */}
        <div className="bg-white p-4 flex items-center justify-between border-b border-slate-200 shadow-sm z-10 relative">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white relative shadow-md border-2 border-white">
                 <User size={20} />
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                 <h3 className="font-bold text-slate-800 text-base">人工客服</h3>
                 <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 
                   在线中 | 24小时服务
                 </p>
              </div>
           </div>
           <div className="flex gap-1">
              <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><MoreHorizontal size={20} /></button>
              <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
           </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100">
           <div className="text-center text-[10px] text-slate-400 my-4 bg-slate-200/50 py-1 px-3 rounded-full w-fit mx-auto">今天 {new Date().toLocaleDateString()}</div>
           
           {messages.map(msg => (
             msg.isSystem ? (
               <div key={msg.id} className="flex justify-center my-2">
                  <span className="text-[10px] bg-slate-200/80 text-slate-500 px-3 py-1 rounded-lg shadow-sm">{msg.text}</span>
               </div>
             ) : (
               <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm relative ${msg.isUser ? 'bg-amber-500 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'}`}>
                     <p className="text-sm leading-relaxed">{msg.text}</p>
                     <div className={`text-[9px] mt-1 text-right font-medium ${msg.isUser ? 'text-white/70' : 'text-slate-300'}`}>{msg.time}</div>
                  </div>
               </div>
             )
           ))}
           
           {isAgentTyping && (
             <div className="flex justify-start animate-in fade-in">
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-4 shadow-sm flex gap-1.5 items-center border border-slate-100">
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white p-3 pb-safe sm:pb-3 border-t border-slate-200">
           <div className="flex items-center gap-4 px-2 mb-3 text-slate-400">
              <button className="hover:text-amber-500 transition-colors hover:bg-slate-50 p-1 rounded"><ImageIcon size={20}/></button>
              <button className="hover:text-amber-500 transition-colors hover:bg-slate-50 p-1 rounded"><Paperclip size={20}/></button>
              <button className="hover:text-amber-500 transition-colors hover:bg-slate-50 p-1 rounded"><Smile size={20}/></button>
           </div>
           <div className="flex gap-2 items-end">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="请输入您的问题..."
                className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all outline-none text-sm resize-none h-12 max-h-24"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white w-12 h-12 rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all disabled:opacity-50 disabled:shadow-none active:scale-90 flex items-center justify-center shrink-0"
              >
                 <Send size={20} className={input.trim() ? "ml-0.5" : ""} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
