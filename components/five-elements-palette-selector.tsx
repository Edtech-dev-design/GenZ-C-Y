'use client';

import React from 'react';
import { ColorSwatch, FIVE_ELEMENT_PALETTES } from '@/lib/heritage-data';
import { Palette, Check, Sparkles, Layers } from 'lucide-react';

interface PaletteSelectorProps {
  selectedMainColor: string;
  selectedInnerColor: string;
  selectedBottomColor: string;
  onSelectMainColor: (hex: string) => void;
  onSelectInnerColor: (hex: string) => void;
  onSelectBottomColor: (hex: string) => void;
  activeColorTarget: 'main' | 'inner' | 'bottom';
  setActiveColorTarget: (target: 'main' | 'inner' | 'bottom') => void;
}

export default function FiveElementsPaletteSelector({
  selectedMainColor,
  selectedInnerColor,
  selectedBottomColor,
  onSelectMainColor,
  onSelectInnerColor,
  onSelectBottomColor,
  activeColorTarget,
  setActiveColorTarget
}: PaletteSelectorProps) {
  // Current active color
  const currentColor =
    activeColorTarget === 'main'
      ? selectedMainColor
      : activeColorTarget === 'inner'
      ? selectedInnerColor
      : selectedBottomColor;

  const handleSelectColor = (hex: string) => {
    if (activeColorTarget === 'main') onSelectMainColor(hex);
    else if (activeColorTarget === 'inner') onSelectInnerColor(hex);
    else onSelectBottomColor(hex);
  };

  // Find info about selected color
  const activeColorInfo = FIVE_ELEMENT_PALETTES.find((c) => c.hex.toLowerCase() === currentColor.toLowerCase());

  return (
    <div className="w-full bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
      {/* Title & Target selection buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-800" />
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Bảng Màu Ngũ Hành</span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-stone-900 mt-0.5">
            Ngũ Hành Tương Sinh & Sắc Điệu Gen Z
          </h4>
        </div>

        {/* Target Layer Segmented Control */}
        <div className="flex items-center bg-stone-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveColorTarget('main')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeColorTarget === 'main'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Áo Chính
          </button>
          <button
            onClick={() => setActiveColorTarget('inner')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeColorTarget === 'inner'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Lớp Lót (Yếm)
          </button>
          <button
            onClick={() => setActiveColorTarget('bottom')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeColorTarget === 'bottom'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Quần / Váy
          </button>
        </div>
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
        {FIVE_ELEMENT_PALETTES.map((swatch) => {
          const isSelected = currentColor.toLowerCase() === swatch.hex.toLowerCase();
          return (
            <button
              key={swatch.id}
              onClick={() => handleSelectColor(swatch.hex)}
              className={`group flex flex-col items-center p-2 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-stone-900 bg-stone-50 shadow-sm ring-1 ring-stone-900'
                  : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
              }`}
            >
              <span
                className="w-8 h-8 rounded-full border border-stone-300/80 shadow-inner flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: swatch.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-4 h-4 ${
                      ['#FAF8F5', '#CBD5E1', '#FDA4AF', '#EAB308'].includes(swatch.hex)
                        ? 'text-stone-900'
                        : 'text-white'
                    }`}
                  />
                )}
              </span>
              <span className="text-[11px] font-medium text-stone-800 mt-1.5 text-center truncate w-full">
                {swatch.vietnameseName.split(' ')[0]}
              </span>
              <span className="text-[10px] text-stone-400">
                {swatch.element}
              </span>
            </button>
          );
        })}
      </div>

      {/* Meaning & "Trong Lộ Ngoài Ẩn" Layering Rule Box */}
      <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs text-stone-700 space-y-1">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-800 shrink-0" />
          <span className="font-semibold text-stone-900">
            {activeColorInfo ? `${activeColorInfo.name} (${activeColorInfo.vietnameseName})` : 'Hòa sắc ngũ hành'}
          </span>
          <span className="text-stone-400">·</span>
          <span className="text-amber-900 font-medium">Quy tắc &quot;Trong Lộ Ngoài Ẩn&quot;</span>
        </div>
        <p className="text-stone-600 leading-relaxed">
          {activeColorInfo?.meaning || 'Phối hợp tương phản giữa tà áo ngoài và cổ lót yếm trong để tạo độ sâu thị giác và cốt cách phong lưu.'}
        </p>
      </div>
    </div>
  );
}
