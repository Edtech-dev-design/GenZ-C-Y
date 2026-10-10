'use client';

import React, { useState } from 'react';
import { GarmentItem } from '@/lib/heritage-data';
import { Sparkles, MessageSquare, Send, Bot, User, Loader2, X } from 'lucide-react';

interface AIAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  eventContext: string;
  mainGarment: GarmentItem;
  innerGarment: GarmentItem;
  bottomGarment: GarmentItem;
  shoes: GarmentItem;
  accessory: GarmentItem;
  lapelDirection: 'right' | 'left';
  isOpenOuterwear: boolean;
}

export default function AIAdvisorDrawer({
  isOpen,
  onClose,
  eventContext,
  mainGarment,
  innerGarment,
  bottomGarment,
  shoes,
  accessory,
  lapelDirection,
  isOpenOuterwear
}: AIAdvisorProps) {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Chào bạn! Mình là Trợ lý Cố Vấn Văn Hóa & Phong Cách Việt Phục Remix. Bạn đang phối ${mainGarment.name} cho sự kiện "${eventContext}". Bạn cần mình phân tích độ chuẩn xác văn hóa, gợi ý phụ kiện độc lạ hay mẹo tạo dáng chụp ảnh kỷ yếu/lookbook?`
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || prompt;
    if (!textToSend.trim() || isLoading) return;

    const newMessages = [...messages, { sender: 'user' as const, text: textToSend }];
    setMessages(newMessages);
    setPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/cultural-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          eventContext,
          mainGarment,
          innerGarment,
          bottomGarment,
          shoes,
          accessory,
          lapelDirection,
          isOpenOuterwear
        })
      });

      const data = await res.json();
      setMessages([...newMessages, { sender: 'ai' as const, text: data.text || 'Có lỗi kết nối. Hãy thử lại!' }]);
    } catch (e) {
      setMessages([
        ...newMessages,
        {
          sender: 'ai' as const,
          text: 'Bản phối của bạn rất ấn tượng! Hãy nhớ luôn giữ vạt áo cài bên phải (Hữu nhậm) để gìn giữ nét tôn nghiêm nhé.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'Phối đồ như thế này chụp kỷ yếu có bị chê là phạm quy không?',
    'Cách tạo dáng ngầu với áo ngũ thân và sneaker?',
    'Giải thích rõ hơn về ý nghĩa 5 thân áo ngũ thân',
    'Gợi ý túi xách và kính mắt phù hợp'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-[#FAF8F5] border-l border-stone-300 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-800 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-title font-semibold text-stone-900 text-sm">
                Trợ Lý Cố Vấn Văn Hóa AI
              </h3>
              <span className="text-[11px] text-stone-500">Am hiểu di sản & bắt nhịp xu hướng Gen Z</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center shrink-0 mt-1 text-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white rounded-br-none'
                    : 'bg-white text-stone-800 border border-stone-200/80 shadow-sm rounded-bl-none whitespace-pre-line'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-stone-500 text-xs p-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-800" />
              <span>Cố vấn AI đang suy ngẫm sử liệu và thẩm mỹ...</span>
            </div>
          )}
        </div>

        {/* Quick prompt chips & Input Box */}
        <div className="p-3 border-t border-stone-200 bg-white space-y-2">
          {/* Quick chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg whitespace-nowrap shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Text Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Đặt câu hỏi về văn hóa hoặc cách phối đồ..."
              className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !prompt.trim()}
              className="p-2 bg-stone-900 text-white rounded-xl hover:bg-stone-800 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
