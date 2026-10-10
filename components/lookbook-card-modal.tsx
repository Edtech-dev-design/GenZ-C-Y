'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GarmentItem } from '@/lib/heritage-data';
import { X, Download, Share2, Sparkles, Check, QrCode, Copy, Link as LinkIcon, Send } from 'lucide-react';

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  mainGarment: GarmentItem;
  innerGarment: GarmentItem;
  bottomGarment: GarmentItem;
  shoes: GarmentItem;
  accessory: GarmentItem;
  mainColor: string;
  innerColor: string;
  bottomColor: string;
  isOpenOuterwear: boolean;
  lapelDirection: 'right' | 'left';
  harmonyScore: number;
  eventContext: string;
}

export default function LookbookCardModal({
  isOpen,
  onClose,
  mainGarment,
  innerGarment,
  bottomGarment,
  shoes,
  accessory,
  mainColor,
  innerColor,
  bottomColor,
  isOpenOuterwear,
  lapelDirection,
  harmonyScore,
  eventContext
}: LookbookModalProps) {
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1'>('9:16');
  const [userName, setUserName] = useState<string>('Bạn An · THPT');
  const [sealText, setSealText] = useState<string>('Việt Phục Ấn');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('main', mainGarment.id);
    url.searchParams.set('inner', innerGarment.id);
    url.searchParams.set('bottom', bottomGarment.id);
    url.searchParams.set('shoes', shoes.id);
    url.searchParams.set('acc', accessory.id);
    url.searchParams.set('mainColor', mainColor);
    url.searchParams.set('innerColor', innerColor);
    url.searchParams.set('bottomColor', bottomColor);
    url.searchParams.set('lapel', lapelDirection);
    url.searchParams.set('open', isOpenOuterwear ? 'true' : 'false');
    return url.toString();
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setShareFeedback('Đã sao chép liên kết phối đồ vào bộ nhớ tạm!');
      setTimeout(() => {
        setCopiedLink(false);
        setShareFeedback(null);
      }, 3000);
    } catch {
      setShareFeedback('Không thể sao chép tự động, vui lòng thử lại.');
    }
  };

  const handleCopyCaption = async () => {
    const shareUrl = getShareUrl();
    const caption = `🎋 VIỆT PHỤC REMIX · GEN Z HERITAGE FUSION
✨ Thiết kế: ${mainGarment.name} (${isOpenOuterwear ? 'Mặc khoác ngoài phóng khoáng' : 'Cài cúc hữu nhậm truyền thống'})
🧵 Lớp trong: ${innerGarment.name}
👖 Phần dưới: ${bottomGarment.name}
👞 Phụ sức: ${shoes.name} & ${accessory.name}
🎨 Bảng màu Ngũ Hành: ${mainColor} | ${innerColor} | ${bottomColor}
📜 Dịp diện: ${eventContext}
💎 Chuẩn mực văn hóa (Harmony Score): ${harmonyScore}/100 (Cultural Guardrail Verified)
👤 Người phối: ${userName}

👉 Xem và thử phối lại bộ này tại:
${shareUrl}

#VietPhucRemix #VietPhuc #GenZHeritage #NguThan #NhatBinh #CoPhucViet #ThoiTrangViet`;

    try {
      await navigator.clipboard.writeText(caption);
      setCopiedCaption(true);
      setShareFeedback('Đã sao chép Caption & Hashtags mạng xã hội!');
      setTimeout(() => {
        setCopiedCaption(false);
        setShareFeedback(null);
      }, 3000);
    } catch {
      setShareFeedback('Không thể sao chép caption.');
    }
  };

  const handleWebShare = async () => {
    const shareUrl = getShareUrl();
    const shareData = {
      title: `Việt Phục Remix - ${mainGarment.name}`,
      text: `Bộ phối ${mainGarment.name} chuẩn mực văn hóa (Harmony Score: ${harmonyScore}/100) do ${userName} thiết kế.`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setShareFeedback('Đã mở chia sẻ thành công!');
        setTimeout(() => setShareFeedback(null), 2500);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Render canvas card preview
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = aspectRatio === '9:16' ? 540 : 600;
    const height = aspectRatio === '9:16' ? 960 : 600;

    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#FAF8F5');
    bgGrad.addColorStop(0.5, '#F5F0E6');
    bgGrad.addColorStop(1, '#EFE8DA');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle paper grain dots
    ctx.fillStyle = 'rgba(180, 83, 9, 0.03)';
    for (let x = 0; x < width; x += 16) {
      for (let y = 0; y < height; y += 16) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    // Outer double border
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    ctx.strokeStyle = '#D6CEBE';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(26, 26, width - 52, height - 52);

    // Decorative corner ornaments
    const drawCorner = (cx: number, cy: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(24, 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 24);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(28, 28, 0);
    drawCorner(width - 28, 28, 90);
    drawCorner(width - 28, height - 28, 180);
    drawCorner(28, height - 28, 270);

    // Header Kicker
    ctx.textAlign = 'center';
    ctx.fillStyle = '#78350F';
    ctx.font = '600 11px sans-serif';
    ctx.fillText('VIỆT PHỤC REMIX · GEN Z HERITAGE FUSION', width / 2, 58);

    // Main Title
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 26px serif';
    ctx.fillText(mainGarment.name.toUpperCase(), width / 2, 92);

    // Subtitle Deck
    ctx.fillStyle = '#57534E';
    ctx.font = 'italic 13px serif';
    ctx.fillText(`“${mainGarment.subtitle}”`, width / 2, 116);

    // Event & User Tag Ribbon
    ctx.fillStyle = '#E7E2D6';
    ctx.fillRect(width / 2 - 160, 130, 320, 26);
    ctx.fillStyle = '#44403C';
    ctx.font = '500 11px sans-serif';
    ctx.fillText(`Dịp: ${eventContext} · Người phối: ${userName}`, width / 2, 147);

    // Center Graphical Area / Mannequin Silhouette summary
    const centerY = aspectRatio === '9:16' ? 440 : 330;

    // Draw stylized mannequin silhouette on canvas
    ctx.save();
    ctx.translate(width / 2, centerY - 80);

    // Background circle medallion
    ctx.beginPath();
    ctx.arc(0, 50, 120, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();
    ctx.strokeStyle = '#E7E2D6';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Silhouette Robe Body
    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.moveTo(-45, -20);
    ctx.lineTo(0, -35);
    ctx.lineTo(45, -20);
    ctx.lineTo(60, 160);
    ctx.lineTo(-60, 160);
    ctx.closePath();
    ctx.fill();

    // Collar
    ctx.fillStyle = '#D97706';
    ctx.fillRect(-12, -45, 24, 12);

    // Head
    ctx.beginPath();
    ctx.arc(0, -65, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#FED7AA';
    ctx.fill();

    // Robe lapel line
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -35);
    ctx.lineTo(25, 10);
    ctx.lineTo(30, 160);
    ctx.stroke();

    // 5 Gold buttons
    ctx.fillStyle = '#FEF08A';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(10 + i * 4, -20 + i * 35, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Outfit Breakdown List Box
    const boxY = aspectRatio === '9:16' ? 620 : 390;
    const boxHeight = aspectRatio === '9:16' ? 180 : 130;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(45, boxY, width - 90, boxHeight);
    ctx.strokeStyle = '#D6CEBE';
    ctx.lineWidth = 1;
    ctx.strokeRect(45, boxY, width - 90, boxHeight);

    // List items
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('CẤU TRÚC PHỐI ĐỒ (STYLING BREAKDOWN)', 60, boxY + 24);

    const items = [
      `1. Áo Chính: ${mainGarment.name} (${isOpenOuterwear ? 'Outerwear mở tà' : 'Cài cúc hữu nhậm'})`,
      `2. Lớp Lót: ${innerGarment.name}`,
      `3. Phần Dưới: ${bottomGarment.name}`,
      `4. Giày & Phụ Kiện: ${shoes.name} + ${accessory.name}`
    ];

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#44403C';
    items.forEach((item, index) => {
      ctx.fillText(item, 60, boxY + 48 + index * 22);
    });

    // Swatches strip
    const swatchY = boxY + boxHeight - 22;
    ctx.fillText('Bảng màu:', 60, swatchY + 8);
    [mainColor, innerColor, bottomColor].forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(130 + idx * 24, swatchY + 4, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#A8A29E';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Traditional Red Seal Stamp (Triện đỏ "Việt Phục Ấn")
    const sealX = width - 95;
    const sealY = aspectRatio === '9:16' ? 840 : 525;
    ctx.fillStyle = '#B91C1C';
    ctx.fillRect(sealX - 25, sealY - 25, 50, 50);
    ctx.strokeStyle = '#7F1D1D';
    ctx.lineWidth = 2;
    ctx.strokeRect(sealX - 23, sealY - 23, 46, 46);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px serif';
    ctx.fillText(sealText.slice(0, 4), sealX, sealY - 4);
    ctx.fillText(sealText.slice(4) || 'ẤN', sealX, sealY + 12);

    // Harmony Score Pill
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1C1917';
    ctx.font = '600 13px sans-serif';
    ctx.fillText(`Harmony Score: ${harmonyScore}/100`, 50, aspectRatio === '9:16' ? 840 : 535);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#78716C';
    ctx.fillText('Đã kiểm định qua Cultural Guardrail', 50, aspectRatio === '9:16' ? 858 : 550);

    // Bottom Footer Watermark
    ctx.textAlign = 'center';
    ctx.fillStyle = '#A8A29E';
    ctx.font = '10px sans-serif';
    ctx.fillText(
      'vietphucremix.vn · Sáng Tạo Nét Xưa – Định Hình Phong Cách Người Trẻ',
      width / 2,
      height - 35
    );
  }, [
    isOpen,
    aspectRatio,
    userName,
    sealText,
    mainGarment,
    innerGarment,
    bottomGarment,
    shoes,
    accessory,
    mainColor,
    innerColor,
    bottomColor,
    isOpenOuterwear,
    harmonyScore,
    eventContext
  ]);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const link = document.createElement('a');
      link.download = `viet-phuc-remix-${mainGarment.id}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-3xl border border-stone-300 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        {/* Left Side: Interactive Canvas Preview */}
        <div className="flex-1 bg-stone-900/95 p-6 flex flex-col items-center justify-center overflow-auto">
          <div className="relative shadow-2xl rounded-xl overflow-hidden border border-stone-800">
            <canvas
              ref={canvasRef}
              className="max-h-[65vh] w-auto object-contain block mx-auto"
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                aspectRatio === '9:16'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Tỷ lệ 9:16 (Story / TikTok)
            </button>
            <button
              onClick={() => setAspectRatio('1:1')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                aspectRatio === '1:1'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Tỷ lệ 1:1 (Instagram Feed)
            </button>
          </div>
        </div>

        {/* Right Side: Customization & Export Controls */}
        <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-white border-t md:border-t-0 md:border-l border-stone-200">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Lookbook Generator</span>
                <h3 className="font-serif-title font-bold text-stone-900 text-base">Xuất Thẻ Ảnh Sống Ảo</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 mt-5">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Tên Người Phối (Creator):
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800"
                  placeholder="Nhập tên bạn..."
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Chữ Khắc Triện Đỏ (Seal Stamp):
                </label>
                <input
                  type="text"
                  value={sealText}
                  onChange={(e) => setSealText(e.target.value)}
                  maxLength={8}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800"
                  placeholder="Việt Phục Ấn..."
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Lookbook Card độc quyền</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Thẻ ảnh có khung viền Thủy Ba, triện khắc chữ cổ, bảng mã màu ngũ hành và chứng nhận điểm Harmony Score {harmonyScore}/100.
                </p>
              </div>
            </div>
          </div>

          {/* Share Feedback Toast */}
          {shareFeedback && (
            <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{shareFeedback}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Đang Tạo Ảnh...' : 'Tải Về Ảnh Thẻ Lookbook (PNG)'}</span>
            </button>

            <button
              onClick={handleWebShare}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Chia Sẻ Bộ Phục Sức Này</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyLink}
                className="py-2 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <LinkIcon className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Đã chép link' : 'Sao chép link'}</span>
              </button>

              <button
                onClick={handleCopyCaption}
                className="py-2 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
              >
                {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaption ? 'Đã chép bài' : 'Chép caption'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 bg-transparent hover:bg-stone-100 text-stone-500 hover:text-stone-800 font-medium text-xs rounded-xl transition-colors"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
