'use client';

import React, { useState } from 'react';
import { GarmentItem } from '@/lib/heritage-data';
import { Sparkles, SlidersHorizontal, Columns, History, Zap } from 'lucide-react';

interface ABComparisonProps {
  mainGarment: GarmentItem;
  mainColor: string;
}

export default function ABComparisonView({ mainGarment, mainColor }: ABComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  return (
    <div className="w-full bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-stone-200/80 bg-stone-50/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Trình So Sánh Song Song A/B</span>
            <span className="text-stone-300">·</span>
            <span className="text-xs font-semibold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded">
              {mainGarment.name}
            </span>
          </div>
          <h3 className="text-lg font-serif-title font-semibold text-stone-900 mt-0.5">
            Thuần Cổ Phục Dựng ⟷ Tân Thời Remix
          </h3>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-stone-200/80 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'slider' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Kéo So Sánh (Split Slider)</span>
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'side-by-side' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Đặt Cạnh Nhau (Side-by-Side)</span>
          </button>
        </div>
      </div>

      {/* Comparison View Area */}
      {viewMode === 'slider' ? (
        <div className="relative w-full h-[460px] select-none overflow-hidden bg-stone-100">
          {/* Side A: Thuần Cổ (Background Base) */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-br from-amber-50/60 via-stone-100 to-amber-100/30">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-stone-900 text-amber-100 text-xs font-serif-title tracking-wider rounded">
                A. THUẦN CỔ (CLASSIC HERITAGE)
              </span>
              <span className="text-xs text-stone-500">Quy chuẩn lịch sử triều Nguyễn</span>
            </div>

            {/* Stylized representation */}
            <div className="flex flex-col items-center justify-center my-auto text-center max-w-sm">
              <div className="w-20 h-20 rounded-full border border-amber-800/20 bg-amber-50 flex items-center justify-center mb-3">
                <History className="w-8 h-8 text-amber-800" />
              </div>
              <h4 className="font-serif-title text-base font-semibold text-stone-900">
                Phục Dựng Nguyên Bản
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Áo ngũ thân cài khuy hữu nhậm nghiêm cẩn + Quần lụa trắng ngà buông suông + Khăn vấn nhung đen + Hài thêu mũi sen truyền thống.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-stone-500">
                <span>Trang nghiêm</span>
                <span>·</span>
                <span>Lễ nghi gia phong</span>
                <span>·</span>
                <span>Tôn ti trật tự</span>
              </div>
            </div>

            <div className="text-xs text-stone-400">
              Kéo thanh trượt sang phải để khám phá trọn vẹn bản phối xưa
            </div>
          </div>

          {/* Side B: Tân Thời Remix (Overlay clipped by slider) */}
          <div
            className="absolute inset-y-0 right-0 overflow-hidden bg-gradient-to-bl from-slate-900 via-indigo-950 to-stone-900 text-white"
            style={{ width: `${100 - sliderPosition}%` }}
          >
            <div
              className="absolute inset-y-0 right-0 flex flex-col justify-between p-6"
              style={{ width: '100%', minWidth: '400px' }}
            >
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-indigo-200">Đột phá phong cách đường phố</span>
                <span className="px-2.5 py-1 bg-indigo-500 text-white text-xs font-semibold tracking-wider rounded">
                  B. TÂN THỜI REMIX (STREETWEAR)
                </span>
              </div>

              {/* Stylized representation */}
              <div className="flex flex-col items-center justify-center my-auto text-center max-w-sm ml-auto mr-4">
                <div className="w-20 h-20 rounded-full border border-indigo-500/30 bg-indigo-950/60 flex items-center justify-center mb-3">
                  <Zap className="w-8 h-8 text-indigo-400" />
                </div>
                <h4 className="font-serif-title text-base font-semibold text-white">
                  Casual Fusion Thế Hệ Z
                </h4>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  Chiếc áo di sản khoác ngoài tà (outerwear) + Quần jeans thụng cạp trễ Y2K + Giày Chunky Sneakers + Kính râm gọng oval + Túi thổ cẩm dệt tay.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-indigo-300">
                  <span>Phóng khoáng</span>
                  <span>·</span>
                  <span>Sống động thường nhật</span>
                  <span>·</span>
                  <span>Thời trang ứng dụng</span>
                </div>
              </div>

              <div className="text-xs text-stone-400 text-right">
                Di sản không chỉ trong tủ kính, mà sống động trên từng con phố
              </div>
            </div>
          </div>

          {/* Slider divider line and draggable thumb */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-lg"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-stone-900 text-white border-2 border-white shadow-xl flex items-center justify-center text-xs font-bold">
              ⇄
            </div>
          </div>

          {/* Transparent full-size range input for effortless drag */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
            aria-label="Thanh trượt so sánh A/B Thuần Cổ và Tân Thời"
          />
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
          {/* Side A */}
          <div className="p-6 bg-amber-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-stone-900 text-amber-100 text-xs font-serif-title tracking-wider rounded">
                  A. THUẦN CỔ
                </span>
                <span className="text-xs text-stone-500 font-medium">Bảo Tồn Di Sản</span>
              </div>
              <h4 className="text-base font-semibold text-stone-900 mt-2">
                Quy Chuẩn Phục Dựng Lịch Sử
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Đúng quy thức lễ giáo triều đại: {mainGarment.name} may đúng 5 thân áo, cài kín 5 hạt cúc ngũ thường bên ngực phải. Phối cùng quần lụa dệt vân và hài cong cung đình.
              </p>
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg border border-stone-200 text-xs space-y-1 text-stone-600">
              <div className="flex justify-between">
                <span className="text-stone-400">Áo chính:</span>
                <span className="font-medium text-stone-800">{mainGarment.name} (Cài kín khuy)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Trang phục dưới:</span>
                <span className="font-medium text-stone-800">Quần lụa tơ tằm trắng ngà</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Giày:</span>
                <span className="font-medium text-stone-800">Hài thêu hoa sen mũi cong</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Phụ kiện:</span>
                <span className="font-medium text-stone-800">Khăn vấn nhung / Quạt giấy</span>
              </div>
            </div>
          </div>

          {/* Side B */}
          <div className="p-6 bg-slate-900 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs font-semibold tracking-wider rounded">
                  B. TÂN THỜI REMIX
                </span>
                <span className="text-xs text-indigo-300 font-medium">Gen Z Casual Fusion</span>
              </div>
              <h4 className="text-base font-semibold text-white mt-2">
                Hơi Thở Đường Phố Đương Đại
              </h4>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                Biến hóa {mainGarment.name} thành một chiếc outerwear độc đáo, phối cùng graphic baby tee, quần denim thụng và đôi retro sneakers năng động.
              </p>
            </div>

            <div className="mt-4 p-3 bg-slate-800/90 rounded-lg border border-slate-700 text-xs space-y-1 text-stone-300">
              <div className="flex justify-between">
                <span className="text-stone-400">Áo chính:</span>
                <span className="font-medium text-white">{mainGarment.name} (Khoác mở tà)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Trang phục dưới:</span>
                <span className="font-medium text-white">Quần jeans thụng cạp trễ Y2K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Giày:</span>
                <span className="font-medium text-white">Chunky Sneakers đế bánh mì</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Phụ kiện:</span>
                <span className="font-medium text-white">Kính mát oval + Túi thổ cẩm</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
