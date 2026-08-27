import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Headphones, 
  Bot, 
  User, 
  Sparkles, 
  HelpCircle, 
  Clock, 
  CheckCheck,
  Minimize2,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';

interface LiveSupportChatWidgetProps {
  user: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string, orderRef?: string) => void;
  telegramSupportUrl?: string;
  zaloSupportUrl?: string;
}

const QUICK_QUESTIONS = [
  'Tôi muốn hỗ trợ bảo hành 1 đổi 1 key lỗi',
  'Hướng dẫn nạp tiền VietQR / Thẻ Cào tự động',
  'Thời gian bung key sau khi gom đủ slot là bao lâu?',
  'Tôi muốn đăng ký làm Đại Lý CTV hưởng chiết khấu'
];

export const LiveSupportChatWidget: React.FC<LiveSupportChatWidgetProps> = ({
  user,
  messages,
  onSendMessage,
  telegramSupportUrl = 'https://t.me/cyberpool_support',
  zaloSupportUrl = 'https://zalo.me/0988889999'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [orderRefVal, setOrderRefVal] = useState('');
  const [showOrderInput, setShowOrderInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    onSendMessage(inputVal.trim(), orderRefVal.trim() || undefined);
    setInputVal('');
    setOrderRefVal('');
    setShowOrderInput(false);
  };

  const handleQuickSend = (text: string) => {
    onSendMessage(text);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 font-mono">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full sm:rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-cyan-300"
          title="Hỗ Trợ CSKH Trực Tuyến 24/7"
        >
          <div className="relative flex items-center justify-center">
            <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950"></span>
          </div>
          <span className="hidden sm:inline">HỖ TRỢ CSKH 24/7</span>
          <span className="px-1.5 py-0.5 rounded bg-black/30 text-[9px] sm:text-[10px] text-white font-mono">
            Online
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 top-20 sm:static sm:inset-auto sm:w-[400px] sm:h-[540px] rounded-2xl bg-[#090c15] border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-950 via-[#0e1628] to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Headphones className="w-4 h-4" />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    CSKH TRỰC TUYẾN 24/7
                  </h3>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Phản hồi trung bình &lt; 60 giây
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Direct Channel Badges */}
          <div className="px-3 py-1.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Kênh hỗ trợ nhanh:</span>
            <div className="flex items-center gap-2">
              <a
                href={telegramSupportUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                Telegram CSKH <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span className="text-slate-700">|</span>
              <a
                href={zaloSupportUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                Zalo Official <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#06080e]/90 text-xs">
            {/* Automated Welcome */}
            <div className="flex items-start gap-2 max-w-[88%]">
              <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 space-y-1 text-slate-200">
                <p className="font-bold text-cyan-300 text-[11px]">Hệ thống Hỗ trợ CyberPool chào bạn! 👋</p>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Bạn cần giải đáp về đơn gom mua, nạp tiền tự động hay yêu cầu bảo hành key? Hãy chọn câu hỏi nhanh bên dưới hoặc nhập tin nhắn:
                </p>
              </div>
            </div>

            {/* Quick Questions Chips */}
            <div className="space-y-1.5 pl-6">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickSend(q)}
                  className="block w-full text-left p-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-cyan-300 transition-all cursor-pointer"
                >
                  ⚡ {q}
                </button>
              ))}
            </div>

            {/* Dynamic Conversation Messages */}
            {messages.map((m) => {
              const isMe = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2 ${
                    isMe ? 'flex-row-reverse max-w-[90%] ml-auto' : 'max-w-[88%]'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isMe
                        ? 'bg-blue-950 border border-blue-500/40 text-blue-300'
                        : 'bg-cyan-950 border border-cyan-500/40 text-cyan-400'
                    }`}
                  >
                    {isMe ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`p-3 rounded-2xl space-y-1 ${
                      isMe
                        ? 'rounded-tr-none bg-cyan-600/20 border border-cyan-500/40 text-white'
                        : 'rounded-tl-none bg-slate-900 border border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400">
                      <span className="font-bold text-slate-300">{m.senderName}</span>
                      <span>{m.timestamp}</span>
                    </div>

                    {m.orderRef && (
                      <div className="px-2 py-0.5 rounded bg-black/60 border border-cyan-500/30 text-[10px] text-cyan-300 inline-block font-mono">
                        Mã đơn liên quan: <strong>{m.orderRef}</strong>
                      </div>
                    )}

                    <p className="text-[11px] leading-relaxed break-words whitespace-pre-wrap">
                      {m.text}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
            {showOrderInput ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={orderRefVal}
                  onChange={(e) => setOrderRefVal(e.target.value)}
                  placeholder="Nhập mã đơn cần hỗ trợ (VD: TX-849201, ord-101)..."
                  className="flex-1 bg-slate-900 border border-cyan-500/40 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowOrderInput(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowOrderInput(true)}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                + Đính kèm mã giao dịch / mã đơn hàng
              </button>
            )}

            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Nhập nội dung cần hỗ trợ..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
