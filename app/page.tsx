'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  MAIN_GARMENTS,
  INNER_LAYERS,
  BOTTOM_LAYERS,
  SHOES_ITEMS,
  ACCESSORIES_ITEMS,
  STYLING_PRESETS,
  GarmentItem,
  evaluateCulturalGuardrails,
  calculateHarmonyScore
} from '@/lib/heritage-data';
import GarmentGraphicsEngine from '@/components/garment-graphics-engine';
import ABComparisonView from '@/components/ab-comparison-view';
import CulturalGuardrailBanner from '@/components/cultural-guardrail-banner';
import FiveElementsPaletteSelector from '@/components/five-elements-palette-selector';
import HeritageFlashcardModal from '@/components/heritage-flashcard-modal';
import LookbookCardModal from '@/components/lookbook-card-modal';
import AIAdvisorDrawer from '@/components/ai-advisor-drawer';
import ExportSourceModal from '@/components/export-source-modal';
import Link from 'next/link';
import {
  Sparkles,
  Layers,
  Palette,
  Camera,
  Bot,
  Compass,
  BookOpen,
  Sliders,
  Check,
  ChevronRight,
  SunMedium,
  Calendar,
  User,
  ShieldCheck,
  ArrowRight,
  EyeOff,
  Eye,
  Share2,
  Code2
} from 'lucide-react';

export default function HomePage() {
  // 1. Current Garment Selection State
  const [selectedMainId, setSelectedMainId] = useState<string>('ngu_than_tay_chen');
  const [selectedInnerId, setSelectedInnerId] = useState<string>('yem_co_xay_trang');
  const [selectedBottomId, setSelectedBottomId] = useState<string>('quan_jeans_thung_y2k');
  const [selectedShoesId, setSelectedShoesId] = useState<string>('retro_chunky_sneakers');
  const [selectedAccessoryId, setSelectedAccessoryId] = useState<string>('kinh_mat_oval_y2k');

  // 2. Color State (Hex values)
  const [mainColor, setMainColor] = useState<string>('#1E3A8A'); // Lam chàm
  const [innerColor, setInnerColor] = useState<string>('#FAF8F5'); // Trắng ngà
  const [bottomColor, setBottomColor] = useState<string>('#3B82F6'); // Denim blue
  const [activeColorTarget, setActiveColorTarget] = useState<'main' | 'inner' | 'bottom'>('main');

  // 3. Garment Anatomy & Tailoring Controls
  const [isOpenOuterwear, setIsOpenOuterwear] = useState<boolean>(false);
  const [lapelDirection, setLapelDirection] = useState<'right' | 'left'>('right'); // Right: Hữu nhậm (standard)

  // 4. Avatar & Studio View Controls
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [skinTone, setSkinTone] = useState<string>('#FED7AA'); // Natural honey
  const [hairStyle, setHairStyle] = useState<string>('khan_van');
  const [displayMode, setDisplayMode] = useState<'ghost_couture' | 'atelier_mannequin' | 'vietnamese_muse' | 'runway_shades' | 'editorial_silhouette' | 'editorial_sketch'>('vietnamese_muse');
  const [backgroundTheme, setBackgroundTheme] = useState<'studio' | 'pho_co' | 'cung_dinh' | 'modern'>('studio');
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [isCleanView, setIsCleanView] = useState<boolean>(false);

  // 5. Event Context & Weather
  const [eventContext, setEventContext] = useState<string>('Chụp Ảnh Kỷ Yếu & Lễ Bế Giảng');
  const [activeLayerTab, setActiveLayerTab] = useState<'main' | 'inner' | 'bottom' | 'shoes' | 'accessory'>('main');

  // 6. Modals & Drawers
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isLookbookOpen, setIsLookbookOpen] = useState<boolean>(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState<boolean>(false);
  const [isExportSourceOpen, setIsExportSourceOpen] = useState<boolean>(false);

  // Find active items
  const mainGarment = useMemo(
    () => MAIN_GARMENTS.find((g) => g.id === selectedMainId) || MAIN_GARMENTS[0],
    [selectedMainId]
  );
  const innerGarment = useMemo(
    () => INNER_LAYERS.find((g) => g.id === selectedInnerId) || INNER_LAYERS[0],
    [selectedInnerId]
  );
  const bottomGarment = useMemo(
    () => BOTTOM_LAYERS.find((g) => g.id === selectedBottomId) || BOTTOM_LAYERS[0],
    [selectedBottomId]
  );
  const shoesGarment = useMemo(
    () => SHOES_ITEMS.find((g) => g.id === selectedShoesId) || SHOES_ITEMS[0],
    [selectedShoesId]
  );
  const accessoryGarment = useMemo(
    () => ACCESSORIES_ITEMS.find((g) => g.id === selectedAccessoryId) || ACCESSORIES_ITEMS[0],
    [selectedAccessoryId]
  );

  // Cultural guardrail & Harmony score evaluations
  const guardrailChecks = useMemo(
    () =>
      evaluateCulturalGuardrails(
        mainGarment,
        innerGarment,
        bottomGarment,
        lapelDirection,
        eventContext,
        isOpenOuterwear
      ),
    [mainGarment, innerGarment, bottomGarment, lapelDirection, eventContext, isOpenOuterwear]
  );

  const harmonyScore = useMemo(
    () =>
      calculateHarmonyScore(
        mainGarment,
        innerGarment,
        bottomGarment,
        shoesGarment,
        accessoryGarment,
        lapelDirection,
        isOpenOuterwear
      ),
    [mainGarment, innerGarment, bottomGarment, shoesGarment, accessoryGarment, lapelDirection, isOpenOuterwear]
  );

  // Hydrate from URL query parameters if present (for sharing links)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setTimeout(() => {
      try {
        const params = new URLSearchParams(window.location.search);
        const mainParam = params.get('main');
        const innerParam = params.get('inner');
        const bottomParam = params.get('bottom');
        const shoesParam = params.get('shoes');
        const accParam = params.get('acc');
        const mainCol = params.get('mainColor');
        const innerCol = params.get('innerColor');
        const botCol = params.get('bottomColor');
        const lapel = params.get('lapel');
        const open = params.get('open');
        const mode = params.get('mode');

        if (mainParam && MAIN_GARMENTS.some((g) => g.id === mainParam)) setSelectedMainId(mainParam);
        if (innerParam && INNER_LAYERS.some((g) => g.id === innerParam)) setSelectedInnerId(innerParam);
        if (bottomParam && BOTTOM_LAYERS.some((g) => g.id === bottomParam)) setSelectedBottomId(bottomParam);
        if (shoesParam && SHOES_ITEMS.some((g) => g.id === shoesParam)) setSelectedShoesId(shoesParam);
        if (accParam && ACCESSORIES_ITEMS.some((g) => g.id === accParam)) setSelectedAccessoryId(accParam);
        if (mainCol) setMainColor(mainCol.startsWith('#') ? mainCol : `#${mainCol}`);
        if (innerCol) setInnerColor(innerCol.startsWith('#') ? innerCol : `#${innerCol}`);
        if (botCol) setBottomColor(botCol.startsWith('#') ? botCol : `#${botCol}`);
        if (lapel === 'left' || lapel === 'right') setLapelDirection(lapel);
        if (open !== null) setIsOpenOuterwear(open === 'true');
        if (mode) setDisplayMode(mode as any);
      } catch (e) {
        console.warn('Could not parse share query params', e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Load Preset
  const handleApplyPreset = (presetId: string) => {
    const preset = STYLING_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedMainId(preset.mainGarmentId);
    setSelectedInnerId(preset.innerGarmentId);
    setSelectedBottomId(preset.bottomGarmentId);
    setSelectedShoesId(preset.shoesId);
    setSelectedAccessoryId(preset.accessoryId);
    setMainColor(preset.mainColor);
    setInnerColor(preset.innerColor);
    setBottomColor(preset.bottomColor);
    setIsOpenOuterwear(preset.isOpenOuterwear);
    setLapelDirection(preset.lapelDirection);
    setEventContext(preset.event);
  };

  const eventOptions = [
    'Chụp Ảnh Kỷ Yếu & Lễ Bế Giảng',
    'Cà Phê Phố Cổ & Check-in Cuối Tuần',
    'Triển Lãm Mỹ Thuật & Bảo Tàng',
    'Lễ Chùa Đầu Năm & Đền Miếu Trang Nghiêm',
    'Lễ Hội Âm Nhạc Indie & Streetwear',
    'Đám Cưới Bạn Thân (Phong Cách Hoài Cổ)'
  ];

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-stone-900 heritage-pattern flex flex-col" suppressHydrationWarning>
      {/* ============================================================ */}
      {/* 1. TOP BAR CONTRACT: One-Row, Three-Zone Layout               */}
      {/* [Brand Wordmark] - [4-5 single-line Nav Links] - [1 CTA Button] */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Brand Wordmark */}
          <Link
            href="/"
            className="text-lg font-serif-title font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:text-amber-900 transition-colors"
          >
            VIỆT PHỤC REMIX
          </Link>

          {/* Zone 2: Single-line Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-600">
            <a href="#studio" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
              Phòng Thử Đồ
            </a>
            <a href="#guardrail" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
              Kiểm Soát Lệch Chuẩn
            </a>
            <a href="#comparison" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
              So Sánh A/B
            </a>
            <a href="#palettes" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
              Bảng Màu Ngũ Hành
            </a>
            <a href="#heritage-library" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
              Tri Thức Di Sản
            </a>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsExportSourceOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Xuất mã nguồn dự án (Full Source Code & ZIP)"
            >
              <Code2 className="w-3.5 h-3.5 text-stone-600" />
              <span>Xuất Mã Nguồn</span>
            </button>
            <button
              onClick={() => setIsAIAdvisorOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-100/70 hover:bg-amber-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Cố Vấn AI</span>
            </button>
            <button
              onClick={() => setIsLookbookOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              title="Chia sẻ bộ phối đồ này tới bạn bè & mạng xã hội"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-800" />
              <span>Chia Sẻ</span>
            </button>
            <button
              onClick={() => setIsLookbookOpen(true)}
              className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Xuất Lookbook</span>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION: Editorial Presentation & Tone-Setting       */}
      {/* ============================================================ */}
      <section className="relative px-6 pt-10 pb-8 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span>Dự Án Văn Hóa & Thời Trang Ứng Dụng</span>
            <span aria-hidden="true">·</span>
            <span>Thế Hệ Z</span>
            <span aria-hidden="true">·</span>
            <span>Di Sản Phục Sức Việt Nam</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-title font-semibold tracking-tight text-stone-900 text-balance leading-tight">
            Sáng Tạo Nét Xưa, Định Hình Phong Cách Người Trẻ
          </h1>

          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-sans max-w-2xl">
            Không dừng lại ở bảo tàng hay tủ kính lưu trữ, Việt Phục Remix định vị trang phục truyền thống như một phần sống động của tủ đồ thường nhật. Phòng thử đồ đồ họa tương tác giúp bạn tự do phối Ngũ thân, Nhật bình, Tứ thân cùng Streetwear mà luôn chuẩn mực văn hóa.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <a
              href="#studio"
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <span>Vào Phòng Thử Đồ Ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setIsAIAdvisorOpen(true)}
              className="px-4 py-2.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              <Bot className="w-3.5 h-3.5 text-amber-800" />
              <span>Hỏi Trợ Lý Cố Vấn Văn Hóa</span>
            </button>
          </div>
        </div>

        {/* Quick Persona Presets Ribbon */}
        <div className="mt-8 pt-6 border-t border-stone-200/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
              Gợi Ý Sẵn Theo Nhân Vật & Sự Kiện (Presets)
            </span>
            <span className="text-xs text-stone-400">Chọn nhanh bản phối mẫu</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STYLING_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className="group p-3.5 text-left bg-white rounded-xl border border-stone-200 hover:border-amber-800/60 hover:shadow-sm transition-all cursor-pointer"
              >
                <span className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                  <span>{preset.persona.split(' - ')[0]}</span>
                  <span className="font-semibold text-amber-900">{preset.harmonyScore}%</span>
                </span>
                <span className="block text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                  {preset.title.split(' · ')[0]}
                </span>
                <span className="block text-[11px] text-stone-500 mt-1 line-clamp-2 leading-snug">
                  {preset.tagline}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. INTERACTIVE MIX & MATCH STUDIO: Live Vector Graphic Canvas */}
      {/* ============================================================ */}
      <section id="studio" className="px-6 py-6 max-w-7xl mx-auto w-full flex-1">
        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Graphic Avatar Visualizer (5 Cols on Large screens) */}
          <div className="lg:col-span-5 w-full flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm h-[680px] flex flex-col">
              <GarmentGraphicsEngine
                gender={gender}
                skinTone={skinTone}
                hairStyle={hairStyle}
                mainGarment={mainGarment}
                innerGarment={innerGarment}
                bottomGarment={bottomGarment}
                shoes={shoesGarment}
                accessory={accessoryGarment}
                mainColor={mainColor}
                innerColor={innerColor}
                bottomColor={bottomColor}
                isOpenOuterwear={isOpenOuterwear}
                lapelDirection={lapelDirection}
                showHotspots={showHotspots}
                onSelectHotspot={(key) => setActiveHotspot(key)}
                backgroundTheme={backgroundTheme}
                displayMode={displayMode}
                onDisplayModeChange={(mode) => setDisplayMode(mode)}
                onHairStyleChange={(style) => setHairStyle(style)}
                cleanViewMode={isCleanView}
                onToggleCleanView={() => setIsCleanView(!isCleanView)}
              />
            </div>

            {/* Mannequin / Studio Quick Bar */}
            <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-stone-500 font-medium">Trưng bày:</span>
                  <select
                    value={displayMode}
                    onChange={(e) => setDisplayMode(e.target.value as any)}
                    className="bg-amber-50/70 border border-amber-200/80 rounded px-2 py-1 text-xs font-semibold text-amber-950"
                  >
                    <option value="vietnamese_muse">🌸 Nàng Thơ / Chàng Thơ Á Đông (Người Mẫu 3D Siêu Thực)</option>
                    <option value="atelier_mannequin">🧵 Hình Nộm May Đo Atelier (Mannequin Vải Bố & Gỗ Mun Thực Tế)</option>
                    <option value="ghost_couture">🧥 Phối Đồ Thực Chất (Ghost Mannequin / Tàng Hình Nộm)</option>
                    <option value="runway_shades">🕶️ Siêu Mẫu Runway (Kính Mát Haute-Couture)</option>
                    <option value="editorial_silhouette">👤 Silhouette Tối Giản (Điêu Khắc Vô Diện)</option>
                    <option value="editorial_sketch">🎨 Phác Thảo Tranh Lụa (Mỹ Thuật Thủy Mặc)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-500">Mái tóc:</span>
                  <select
                    value={hairStyle}
                    onChange={(e) => setHairStyle(e.target.value)}
                    className="bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs font-medium text-stone-800"
                  >
                    <option value="khan_van">👑 Khăn Đóng / Khăn Vấn Cổ Truyền</option>
                    <option value="bun_tram">🪷 Búi Tóc Trâm Bạc Hoa Sen</option>
                    <option value="long_sleek">🖤 Mái Tóc Dài Đen Tuyền Thuần Việt</option>
                    <option value="non_la_quai_thao">👒 Nón Ba Tầm Quai Thao / Nón Lá</option>
                    <option value="song_ha_thanh_1930">✨ Tóc Sóng Hà Thành 1930s (Lemur)</option>
                    <option value="toc_nam_cu_toi">🎋 Tóc Cột Búi Nho Sĩ / Nam Nhi</option>
                    <option value="wolf_cut">⚡ Wolf-Cut Giao Thoa Đương Đại</option>
                    <option value="hidden">🚫 Ẩn Mái Tóc (Chuyên Chú Phom Áo)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-500">Nền Studio:</span>
                  <select
                    value={backgroundTheme}
                    onChange={(e) => setBackgroundTheme(e.target.value as any)}
                    className="bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                  >
                    <option value="studio">Studio Tối Giản</option>
                    <option value="pho_co">Phố Cổ Hà Nội</option>
                    <option value="cung_dinh">Cung Đình Huế</option>
                    <option value="modern">Triển Lãm Đương Đại</option>
                  </select>
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showHotspots}
                    onChange={(e) => setShowHotspots(e.target.checked)}
                    className="rounded text-amber-800"
                  />
                  <span className="text-stone-600">Ghim tri thức</span>
                </label>

                {/* Nút bật/tắt công cụ & góc nhìn xung quanh mô hình */}
                <button
                  onClick={() => setIsCleanView(!isCleanView)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    isCleanView
                      ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                  title="Tắt các góc nhìn và thanh công cụ xung quanh mô hình để ngắm phom dáng thuần túy"
                >
                  {isCleanView ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                      <span>Hiện công cụ & góc nhìn</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                      <span>Tắt công cụ xung quanh</span>
                    </>
                  )}
                </button>
              </div>

              {/* Skin Tone & Gender Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">Màu da nhân vật:</span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { hex: '#FED7AA', label: 'Vàng sáng' },
                      { hex: '#FEE2E2', label: 'Trắng hồng' },
                      { hex: '#FDBA74', label: 'Mật ong' },
                      { hex: '#E29578', label: 'Bánh mật' }
                    ].map((skin) => (
                      <button
                        key={skin.hex}
                        onClick={() => setSkinTone(skin.hex)}
                        title={skin.label}
                        className={`w-5 h-5 rounded-full border transition-transform ${
                          skinTone === skin.hex
                            ? 'ring-2 ring-stone-900 scale-110 border-white'
                            : 'border-stone-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: skin.hex }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-stone-100 p-0.5 rounded-lg text-[11px]">
                  <button
                    onClick={() => setGender('female')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                      gender === 'female' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
                    }`}
                  >
                    Nữ Thanh Tú
                  </button>
                  <button
                    onClick={() => setGender('male')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                      gender === 'male' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
                    }`}
                  >
                    Nam Lãng Tử
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Layer Selection & Tailoring Controls (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Event & Context Bar */}
            <div className="p-4 bg-white rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-800 shrink-0" />
                <div>
                  <span className="text-[11px] text-stone-500 block">Ngữ Cảnh / Bối Cảnh Phối Đồ:</span>
                  <select
                    value={eventContext}
                    onChange={(e) => setEventContext(e.target.value)}
                    className="font-medium text-stone-900 bg-transparent border-none text-xs focus:ring-0 p-0 cursor-pointer"
                  >
                    {eventOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <SunMedium className="w-3.5 h-3.5 text-amber-600" />
                  <span>26°C Thoáng mát</span>
                </span>
              </div>
            </div>

            {/* Cultural Tailoring Options (Outerwear & Hướng Vạt Áo) */}
            <div className="p-4 bg-stone-50/70 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Outerwear Toggle */}
              <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-900 block">Dáng Mặc Áo Ngoài:</span>
                  <span className="text-[11px] text-stone-500">
                    {isOpenOuterwear ? 'Khoác mở tà (Outerwear Jacket)' : 'Cài cúc kín đáo chuẩn mực'}
                  </span>
                </div>
                <button
                  onClick={() => setIsOpenOuterwear(!isOpenOuterwear)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    isOpenOuterwear
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {isOpenOuterwear ? 'Mở Tà' : 'Cài Cúc'}
                </button>
              </div>

              {/* Lapel Direction Toggle (Hữu Nhậm vs Tả Nhậm) */}
              <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-900 block">Hướng Cài Vạt Áo:</span>
                  <span className="text-[11px] text-stone-500">
                    {lapelDirection === 'right' ? 'Hữu nhậm (Phải - Chuẩn mực)' : 'Tả nhậm (Trái - Tang tế)'}
                  </span>
                </div>
                <div className="flex items-center bg-stone-100 p-0.5 rounded-lg">
                  <button
                    onClick={() => setLapelDirection('right')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                      lapelDirection === 'right' ? 'bg-emerald-600 text-white' : 'text-stone-600'
                    }`}
                  >
                    Hữu Nhậm
                  </button>
                  <button
                    onClick={() => setLapelDirection('left')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                      lapelDirection === 'left' ? 'bg-rose-600 text-white' : 'text-stone-600'
                    }`}
                  >
                    Tả Nhậm
                  </button>
                </div>
              </div>
            </div>

            {/* Five Layer Styling Studio Navigator */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              {/* Layer Navigation Tabs */}
              <div className="flex items-center border-b border-stone-200 overflow-x-auto no-scrollbar bg-stone-50/50 p-1">
                {[
                  { key: 'main', label: '1. Áo Chính', sub: 'Ngũ thân / Nhật bình' },
                  { key: 'inner', label: '2. Lớp Lót', sub: 'Yếm sen / Tee' },
                  { key: 'bottom', label: '3. Phần Dưới', sub: 'Jeans / Lụa' },
                  { key: 'shoes', label: '4. Giày Dép', sub: 'Sneaker / Hài' },
                  { key: 'accessory', label: '5. Phụ Kiện', sub: 'Kính / Nón / Túi' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveLayerTab(tab.key as any)}
                    className={`flex-1 min-w-[110px] py-2.5 px-3 text-center text-xs rounded-xl font-medium transition-all cursor-pointer ${
                      activeLayerTab === tab.key
                        ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80 font-semibold'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <span className="block">{tab.label}</span>
                    <span className="block text-[10px] text-stone-400 font-normal truncate">{tab.sub}</span>
                  </button>
                ))}
              </div>

              {/* Items Catalog List for Selected Layer */}
              <div className="p-4 space-y-3 max-h-[380px] overflow-y-auto">
                {activeLayerTab === 'main' && (
                  <div className="space-y-2.5">
                    {MAIN_GARMENTS.map((item) => {
                      const isSelected = selectedMainId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedMainId(item.id);
                            if (item.defaultColor) setMainColor(item.defaultColor);
                          }}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-stone-900 bg-amber-50/30 shadow-sm ring-1 ring-stone-900'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-stone-400">·</span>
                                <span className="text-[11px] text-stone-500 font-medium">{item.era}</span>
                              </div>
                              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                                {item.description}
                              </p>
                              <div className="mt-2 text-[11px] text-amber-900/90 font-medium bg-amber-100/50 p-2 rounded-lg">
                                💡 Tip Remix: {item.fusionTip}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeLayerTab === 'inner' && (
                  <div className="space-y-2.5">
                    {INNER_LAYERS.map((item) => {
                      const isSelected = selectedInnerId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedInnerId(item.id);
                            if (item.defaultColor) setInnerColor(item.defaultColor);
                          }}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-stone-900 bg-amber-50/30 shadow-sm ring-1 ring-stone-900'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-stone-400">·</span>
                                <span className="text-[11px] text-stone-500">{item.subtitle}</span>
                              </div>
                              <p className="text-xs text-stone-600 mt-1">{item.description}</p>
                              <div className="mt-1.5 text-[11px] text-indigo-900/80">
                                💡 {item.fusionTip}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeLayerTab === 'bottom' && (
                  <div className="space-y-2.5">
                    {BOTTOM_LAYERS.map((item) => {
                      const isSelected = selectedBottomId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedBottomId(item.id);
                            if (item.defaultColor) setBottomColor(item.defaultColor);
                          }}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-stone-900 bg-amber-50/30 shadow-sm ring-1 ring-stone-900'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-stone-400">·</span>
                                <span className="text-[11px] text-stone-500">{item.subtitle}</span>
                              </div>
                              <p className="text-xs text-stone-600 mt-1">{item.description}</p>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeLayerTab === 'shoes' && (
                  <div className="space-y-2.5">
                    {SHOES_ITEMS.map((item) => {
                      const isSelected = selectedShoesId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedShoesId(item.id)}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-stone-900 bg-amber-50/30 shadow-sm ring-1 ring-stone-900'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-semibold text-stone-900 text-xs sm:text-sm block">
                                {item.name}
                              </span>
                              <p className="text-xs text-stone-600 mt-0.5">{item.description}</p>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeLayerTab === 'accessory' && (
                  <div className="space-y-2.5">
                    {ACCESSORIES_ITEMS.map((item) => {
                      const isSelected = selectedAccessoryId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedAccessoryId(item.id)}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-stone-900 bg-amber-50/30 shadow-sm ring-1 ring-stone-900'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-semibold text-stone-900 text-xs sm:text-sm block">
                                {item.name}
                              </span>
                              <p className="text-xs text-stone-600 mt-0.5">{item.description}</p>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Five Elements Palette Component */}
            <div id="palettes">
              <FiveElementsPaletteSelector
                selectedMainColor={mainColor}
                selectedInnerColor={innerColor}
                selectedBottomColor={bottomColor}
                onSelectMainColor={setMainColor}
                onSelectInnerColor={setInnerColor}
                onSelectBottomColor={setBottomColor}
                activeColorTarget={activeColorTarget}
                setActiveColorTarget={setActiveColorTarget}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. CULTURAL GUARDRAIL & HARMONY SCORE SYSTEM                 */}
      {/* ============================================================ */}
      <section id="guardrail" className="px-6 py-6 max-w-7xl mx-auto w-full">
        <CulturalGuardrailBanner
          checks={guardrailChecks}
          harmonyScore={harmonyScore}
          onFixLapel={() => setLapelDirection('right')}
        />
      </section>

      {/* ============================================================ */}
      {/* 5. A/B COMPARISON MODE: Thuần Cổ vs Tân Thời Remix          */}
      {/* ============================================================ */}
      <section id="comparison" className="px-6 py-8 max-w-7xl mx-auto w-full">
        <ABComparisonView mainGarment={mainGarment} mainColor={mainColor} />
      </section>

      {/* ============================================================ */}
      {/* 6. HERITAGE KNOWLEDGE & FABRIC ORIGINS GALLERY              */}
      {/* ============================================================ */}
      <section id="heritage-library" className="px-6 py-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>Thư Viện Tri Thức</span>
              <span aria-hidden="true">·</span>
              <span>Chất Liệu Bản Địa & Làng Nghề</span>
            </div>
            <h3 className="text-2xl font-serif-title font-semibold text-stone-900">
              Giải Mã Nét Xưa & Chất Liệu Thuần Việt
            </h3>
          </div>

          <button
            onClick={() => setActiveHotspot('tu_than_phu_mau')}
            className="text-xs text-amber-900 hover:text-stone-900 font-semibold flex items-center gap-1"
          >
            <span>Khám phá trọn bộ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Lụa Vạn Phúc (Hà Đông)',
              desc: 'Hơn 1.000 năm lịch sử dệt tơ tằm, chất lụa mềm mại mùa hè mát, mùa đông ấm, hoa văn chim phượng, hoa sen ẩn hiện dưới ánh sáng.',
              tag: 'Thăng Long',
              hotspot: 'lap_linh_collar'
            },
            {
              title: 'Lãnh Mỹ A (An Giang)',
              desc: 'Huyền thoại dệt tơ nhuộm trái mặc nưa hàng trăm lần, cho ra sắc đen huyền bí, mặt vải bóng như da thuộc và càng mặc càng óng.',
              tag: 'Tân Châu, Nam Bộ',
              hotspot: 'nhat_binh_collar'
            },
            {
              title: 'Đũi Nam Cao (Thái Bình)',
              desc: 'Sợi đũi tơ tằm thô mộc, dệt tay tạo độ thở tự nhiên, thấm mồ hôi và mang tinh thần giản dị của người nông thôn đồng bằng Bắc Bộ.',
              tag: 'Đồng Bằng Sông Hồng',
              hotspot: 'tu_than_phu_mau'
            },
            {
              title: 'Thổ Cẩm Lanh Tây Bắc',
              desc: 'Dệt sợi lanh người H\'Mông, Thái với họa tiết trám kỷ hà, nhuộm chàm tự nhiên. Biểu tượng của sức sống bền bỉ và tình yêu đại ngàn.',
              tag: 'Tây Bắc',
              hotspot: 'tho_cam'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActiveHotspot(item.hotspot)}
              className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-amber-900/40 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  {item.tag}
                </span>
                <h4 className="font-serif-title text-base font-semibold text-stone-900 mt-2">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Nhấp để xem thẻ chi tiết</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FOOTER                                                    */}
      {/* ============================================================ */}
      <footer className="mt-auto border-t border-stone-200 bg-[#FAF8F5] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-serif-title font-semibold text-stone-900">VIỆT PHỤC REMIX</span>
            <span>·</span>
            <span>Dự án bảo tồn và lan tỏa di sản phục sức Việt trong giới trẻ</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <button
              onClick={() => setIsExportSourceOpen(true)}
              className="hover:text-stone-900 transition-colors flex items-center gap-1.5 text-stone-600 font-medium"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-800" />
              <span>Xuất Mã Nguồn (Source Code)</span>
            </button>
            <span>·</span>
            <span>© 2026 Việt Phục Remix</span>
            <span>·</span>
            <span>Tự hào di sản Việt</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <HeritageFlashcardModal
        hotspotKey={activeHotspot}
        onClose={() => setActiveHotspot(null)}
      />

      <ExportSourceModal
        isOpen={isExportSourceOpen}
        onClose={() => setIsExportSourceOpen(false)}
      />

      <LookbookCardModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        mainGarment={mainGarment}
        innerGarment={innerGarment}
        bottomGarment={bottomGarment}
        shoes={shoesGarment}
        accessory={accessoryGarment}
        mainColor={mainColor}
        innerColor={innerColor}
        bottomColor={bottomColor}
        isOpenOuterwear={isOpenOuterwear}
        lapelDirection={lapelDirection}
        harmonyScore={harmonyScore.score}
        eventContext={eventContext}
      />

      <AIAdvisorDrawer
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
        eventContext={eventContext}
        mainGarment={mainGarment}
        innerGarment={innerGarment}
        bottomGarment={bottomGarment}
        shoes={shoesGarment}
        accessory={accessoryGarment}
        lapelDirection={lapelDirection}
        isOpenOuterwear={isOpenOuterwear}
      />
    </div>
  );
}
