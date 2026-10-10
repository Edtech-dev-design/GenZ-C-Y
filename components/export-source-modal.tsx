'use client';

import React, { useState } from 'react';
import { X, Download, Code2, Github, Terminal, Check, Copy, Sparkles, FolderArchive, ArrowUpRight } from 'lucide-react';

interface ExportSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportSourceModal({ isOpen, onClose }: ExportSourceModalProps) {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl border border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-sm">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block">
                Source Code Export
              </span>
              <h3 className="font-serif-title font-bold text-stone-900 text-lg">
                Xuất Mã Nguồn Dự Án (Full Source Code)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
          {/* Method 1: Instant ZIP Download */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-stone-900 text-sm">
                <FolderArchive className="w-4 h-4 text-amber-700" />
                <span>Cách 1: Tải trực tiếp gói ZIP toàn bộ mã nguồn sạch</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                Nhanh nhất
              </span>
            </div>
            <p className="text-stone-600 leading-relaxed text-xs">
              Tải toàn bộ source code sạch (đã loại bỏ <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">node_modules</code> và <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">.next</code>, dung lượng siêu nhẹ ~200KB) gồm toàn bộ Canvas engine, Next.js App Router, dữ liệu di sản và README hướng dẫn.
            </p>
            <div className="pt-1">
              <a
                href="/api/export-source"
                download="viet-phuc-remix-source.zip"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-xl shadow-sm transition-colors"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Tải File Nén viet-phuc-remix-source.zip</span>
              </a>
            </div>
          </div>

          {/* Method 2: Google AI Studio Platform Export */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-stone-900 text-sm">
                <Github className="w-4 h-4 text-stone-900" />
                <span>Cách 2: Xuất lên GitHub từ thanh công cụ Google AI Studio</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                Khuyên dùng cho Git
              </span>
            </div>
            <p className="text-stone-600 leading-relaxed text-xs">
              Ngay trên giao diện web của <strong>Google AI Studio</strong> (ở góc trên cùng bên phải màn hình studio), bạn có thể:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-700 pl-1">
              <li>Nhấp vào nút <strong>Menu (...)</strong> hoặc biểu tượng <strong>GitHub / Export</strong> ở góc trên bên phải.</li>
              <li>Chọn <strong>Export to GitHub</strong> hoặc <strong>Download Project</strong>.</li>
              <li>Hệ thống sẽ tự động tạo một kho lưu trữ mới (Repository) trên tài khoản GitHub của bạn và đẩy toàn bộ commit lên.</li>
            </ol>
          </div>

          {/* Step 3: Local Dev Instructions */}
          <div className="p-5 bg-stone-900 text-stone-200 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-white text-xs">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Hướng dẫn chạy mã nguồn trên máy tính của bạn (Localhost)</span>
              </div>
              <button
                onClick={() => handleCopy('npm install\nnpm run dev', 'commands')}
                className="text-[11px] flex items-center gap-1 text-stone-400 hover:text-white transition-colors"
              >
                {copiedCmd === 'commands' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'commands' ? 'Đã sao chép' : 'Chép lệnh'}</span>
              </button>
            </div>

            <div className="bg-black/50 rounded-xl p-3 font-mono text-[11px] space-y-1.5 text-amber-300/90 border border-stone-800">
              <div className="text-stone-500"># 1. Giải nén file zip và chuyển vào thư mục dự án:</div>
              <div className="text-stone-300">cd viet-phuc-remix-source</div>
              <div className="text-stone-500 mt-2"># 2. Cài đặt các thư viện:</div>
              <div className="text-stone-300">npm install</div>
              <div className="text-stone-500 mt-2"># 3. Chạy server phát triển (Port 3000):</div>
              <div className="text-stone-300">npm run dev</div>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              Mở trình duyệt tại <code className="text-amber-400 font-mono">http://localhost:3000</code> để trải nghiệm trọn vẹn phòng thử đồ phục sức tương tác trên máy tính của bạn!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Dự án: Việt Phục Remix · Next.js 15 & Tailwind CSS
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
