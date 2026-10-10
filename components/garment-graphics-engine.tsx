'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GarmentItem, PBR_MATERIALS, PBRMaterialShader } from '@/lib/heritage-data';
import AvatarVisualizer from '@/components/avatar-visualizer';
import {
  Sparkles,
  RotateCcw,
  Info,
  Rotate3d,
  Layers,
  Lightbulb,
  Box,
  Eye,
  X,
  Compass,
  Focus,
  Maximize2,
  Scan,
  Grid,
  Scissors,
  UserCheck,
  Shirt,
  EyeOff,
  Settings2,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GraphicsEngineProps {
  gender: 'female' | 'male';
  skinTone: string;
  hairStyle: string;
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
  showHotspots: boolean;
  onSelectHotspot: (type: string) => void;
  backgroundTheme: 'studio' | 'pho_co' | 'cung_dinh' | 'modern';
  displayMode?: 'ghost_couture' | 'atelier_mannequin' | 'vietnamese_muse' | 'runway_shades' | 'editorial_silhouette' | 'editorial_sketch';
  onDisplayModeChange?: (mode: 'ghost_couture' | 'atelier_mannequin' | 'vietnamese_muse' | 'runway_shades' | 'editorial_silhouette' | 'editorial_sketch') => void;
  onHairStyleChange?: (style: string) => void;
  cleanViewMode?: boolean;
  onToggleCleanView?: () => void;
}

export default function GarmentGraphicsEngine({
  gender,
  skinTone,
  hairStyle,
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
  showHotspots,
  onSelectHotspot,
  backgroundTheme,
  displayMode = 'ghost_couture',
  onDisplayModeChange,
  onHairStyleChange,
  cleanViewMode = false,
  onToggleCleanView
}: GraphicsEngineProps) {
  // 1. Camera & Viewport States
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [cameraFocus, setCameraFocus] = useState<'full' | 'portrait' | 'collar' | 'waist' | 'shoes'>('full');
  const [turntableAngle, setTurntableAngle] = useState<number>(0); // 0 to 360 degrees
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [localDisplayMode, setLocalDisplayMode] = useState<'ghost_couture' | 'atelier_mannequin' | 'vietnamese_muse' | 'runway_shades' | 'editorial_silhouette' | 'editorial_sketch' | null>(null);
  const currentDisplayMode = displayMode ?? localDisplayMode ?? 'vietnamese_muse';

  // 1B. Surrounding Tools & View Angle Visibility Toggles
  const [internalCleanView, setInternalCleanView] = useState<boolean | null>(null);
  const isCleanView = internalCleanView !== null ? internalCleanView : cleanViewMode;
  const [showCameraPresets, setShowCameraPresets] = useState<boolean>(true);
  const [showDisplayModeHud, setShowDisplayModeHud] = useState<boolean>(true);
  const [showTurntableBar, setShowTurntableBar] = useState<boolean>(true);
  const [showTopControlBar, setShowTopControlBar] = useState<boolean>(true);
  const [showVisibilitySettings, setShowVisibilitySettings] = useState<boolean>(false);

  const toggleMasterCleanView = () => {
    const nextState = !isCleanView;
    setInternalCleanView(nextState);
    if (onToggleCleanView) onToggleCleanView();
  };

  const enableCleanView = () => {
    setInternalCleanView(true);
    if (onToggleCleanView && !isCleanView) onToggleCleanView();
  };

  const disableCleanView = () => {
    setInternalCleanView(false);
    if (onToggleCleanView && isCleanView) onToggleCleanView();
  };

  const handleDisplayModeSelect = (mode: 'ghost_couture' | 'vietnamese_muse' | 'runway_shades' | 'editorial_silhouette' | 'editorial_sketch') => {
    setLocalDisplayMode(mode);
    if (onDisplayModeChange) onDisplayModeChange(mode);
  };

  // 2. Structural & Graphics Function Passes
  const [graphicsPass, setGraphicsPass] = useState<'full_pbr' | 'anatomy_grid' | 'seam_blueprint' | 'exploded_orbit' | 'clay_ao'>('full_pbr');
  const [lightingMode, setLightingMode] = useState<'three_point' | 'amber_rim' | 'exhibition_dark' | 'clay_pbr'>('three_point');
  const [showWireframeLines, setShowWireframeLines] = useState<boolean>(false);

  // 3. Inspection & Feedback
  const [inspectedMaterial, setInspectedMaterial] = useState<PBRMaterialShader | null>(null);
  const [fittingNotification, setFittingNotification] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // Camera viewport transform
  const getCameraTransform = () => {
    switch (cameraFocus) {
      case 'portrait':
        return { scale: 1.65, translateY: 150 };
      case 'collar':
        return { scale: 1.85, translateY: 95 };
      case 'waist':
        return { scale: 1.5, translateY: -60 };
      case 'shoes':
        return { scale: 1.75, translateY: -220 };
      case 'full':
      default:
        return { scale: zoomLevel, translateY: 0 };
    }
  };

  const currentTransform = getCameraTransform();

  // Outfit & Color change trigger
  const outfitKey = `${mainGarment.id}-${innerGarment.id}-${bottomGarment.id}-${shoes.id}-${accessory.id}-${isOpenOuterwear}-${lapelDirection}`;
  const colorKey = `${mainColor}-${innerColor}-${bottomColor}`;

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer1 = setTimeout(() => {
      setFittingNotification(`Đang ướm mẫu: ${mainGarment.name}`);
    }, 10);

    const timer2 = setTimeout(() => {
      setFittingNotification(null);
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [
    mainGarment.id,
    mainGarment.name,
    innerGarment.id,
    bottomGarment.id,
    shoes.id,
    accessory.id,
    mainColor,
    innerColor,
    bottomColor,
    isOpenOuterwear,
    lapelDirection
  ]);

  // Turntable ticker
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setTurntableAngle((prev) => (prev + 1) % 360);
    }, 45);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Background style based on lighting & studio mode
  const getBackgroundClass = () => {
    if (graphicsPass === 'clay_ao' || lightingMode === 'clay_pbr') {
      return 'from-stone-200 via-stone-100 to-stone-300 text-stone-800';
    }
    if (lightingMode === 'exhibition_dark') {
      return 'from-stone-950 via-stone-900 to-black text-stone-100';
    }
    if (lightingMode === 'amber_rim') {
      return 'from-[#29221B] via-[#1E1914] to-[#120F0D] text-amber-50';
    }

    switch (backgroundTheme) {
      case 'pho_co':
        return 'from-amber-50/90 via-stone-100 to-amber-100/50';
      case 'cung_dinh':
        return 'from-red-950/15 via-stone-100 to-amber-900/20';
      case 'modern':
        return 'from-slate-100 via-stone-50 to-indigo-50/40';
      case 'studio':
      default:
        return 'from-[#F5F2EB] via-[#FAF8F5] to-[#EBE7DF]';
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-stone-100/50 select-none overflow-hidden font-sans">
      {/* ============================================================ */}
      {/* 1. TOP CONTROL BAR: STRUCTURAL & GRAPHICS PASSES            */}
      {/* ============================================================ */}
      {!isCleanView && showTopControlBar && (
        <div className="w-full flex items-center justify-between px-3.5 py-2 bg-white/90 backdrop-blur-md border-b border-stone-200/80 z-20 text-xs">
          {/* Pass Selector */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setGraphicsPass('full_pbr')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                graphicsPass === 'full_pbr'
                  ? 'bg-stone-900 text-amber-100 shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>3D Khối Nổi PBR</span>
            </button>

            <button
              onClick={() => setGraphicsPass('anatomy_grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                graphicsPass === 'anatomy_grid'
                  ? 'bg-amber-900 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
              title="Khung xương nhân trắc học tỉ lệ vàng 7.5 đầu"
            >
              <Grid className="w-3 h-3 text-amber-300" />
              <span>Nhân Trắc Học (7.5 Đầu)</span>
            </button>

            <button
              onClick={() => setGraphicsPass('seam_blueprint')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                graphicsPass === 'seam_blueprint'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
              title="Đường may rập kỹ thuật cổ áo, nẹp vạt và tay thụng"
            >
              <Scissors className="w-3 h-3 text-blue-300" />
              <span>Rập May Cổ Phục</span>
            </button>

            <button
              onClick={() => setGraphicsPass('exploded_orbit')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                graphicsPass === 'exploded_orbit'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
              title="Bóc tách các chi tiết áo, cúc đồng, quả cầu vật liệu PBR"
            >
              <Box className="w-3 h-3 text-emerald-300" />
              <span>Bóc Tách Không Gian</span>
            </button>

            <button
              onClick={() => setGraphicsPass('clay_ao')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                graphicsPass === 'clay_ao'
                  ? 'bg-stone-700 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
              title="Mô hình đất sét kỹ thuật số Ambient Occlusion"
            >
              <Layers className="w-3 h-3 text-stone-300" />
              <span>Đất Sét Clay AO</span>
            </button>
          </div>

          {/* Lighting, Wireframe, Turntable, and CLEAN VIEW Controls */}
          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            {/* Lighting Mode Selector */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
              <button
                onClick={() => setLightingMode('three_point')}
                className={`p-1 rounded text-[10px] font-medium transition-colors ${
                  lightingMode === 'three_point' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
                title="Studio 3 Điểm chuẩn mực"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              </button>
              <button
                onClick={() => setLightingMode('amber_rim')}
                className={`p-1 rounded text-[10px] font-medium transition-colors ${
                  lightingMode === 'amber_rim' ? 'bg-amber-900 text-white shadow-xs' : 'text-stone-500'
                }`}
                title="Viền sáng Hoàng hôn Hổ phách"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLightingMode('exhibition_dark')}
                className={`p-1 rounded text-[10px] font-medium transition-colors ${
                  lightingMode === 'exhibition_dark' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-500'
                }`}
                title="Bảo tàng Đêm Huyền bí"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Wireframe Toggle */}
            <button
              onClick={() => setShowWireframeLines(!showWireframeLines)}
              className={`p-1.5 rounded-lg border transition-colors ${
                showWireframeLines
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
              }`}
              title="Bật/Tắt Lưới Wireframe Kỹ thuật"
            >
              <Scan className="w-3.5 h-3.5" />
            </button>

            {/* Turntable Auto-rotate */}
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isAutoRotating
                  ? 'bg-amber-900 text-white border-amber-900 animate-pulse'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
              title={isAutoRotating ? 'Dừng xoay 360°' : 'Tự động xoay Turntable 360°'}
            >
              <Rotate3d className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-stone-300 mx-0.5" />

            {/* Tắt / Ẩn công cụ xung quanh mô hình (Clean View Mode) */}
            <button
              onClick={toggleMasterCleanView}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100/90 text-amber-950 font-medium text-[11px] transition-all shadow-xs"
              title="Tắt các góc nhìn và thanh công cụ xung quanh mô hình (Góc nhìn sạch / Tinh gọn)"
            >
              <EyeOff className="w-3.5 h-3.5 text-amber-800" />
              <span className="font-semibold hidden sm:inline">Tắt công cụ xung quanh</span>
              <span className="font-semibold sm:hidden">Ẩn HUD</span>
            </button>

            {/* Tùy chỉnh chi tiết ẩn/hiện từng chức năng */}
            <div className="relative">
              <button
                onClick={() => setShowVisibilitySettings(!showVisibilitySettings)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  showVisibilitySettings
                    ? 'bg-amber-900 text-white border-amber-900'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
                title="Tùy chọn hiển thị các góc nhìn và công cụ xung quanh mô hình"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>

              {showVisibilitySettings && (
                <div className="absolute right-0 top-full mt-1.5 z-40 w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-2xl p-3.5 text-stone-800 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                    <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                      <Settings2 className="w-3.5 h-3.5 text-amber-800" />
                      Công Cụ Xung Quanh Mô Hình
                    </span>
                    <button
                      onClick={() => setShowVisibilitySettings(false)}
                      className="text-stone-400 hover:text-stone-700 p-0.5 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 py-1">
                    <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-stone-50 cursor-pointer">
                      <span className="text-stone-700 font-medium">Bảng góc nhìn ống kính</span>
                      <input
                        type="checkbox"
                        checked={showCameraPresets}
                        onChange={(e) => setShowCameraPresets(e.target.checked)}
                        className="rounded text-amber-800 accent-amber-800"
                      />
                    </label>

                    <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-stone-50 cursor-pointer">
                      <span className="text-stone-700 font-medium">Bảng phối đồ & mái tóc</span>
                      <input
                        type="checkbox"
                        checked={showDisplayModeHud}
                        onChange={(e) => setShowDisplayModeHud(e.target.checked)}
                        className="rounded text-amber-800 accent-amber-800"
                      />
                    </label>

                    <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-stone-50 cursor-pointer">
                      <span className="text-stone-700 font-medium">Thanh xoay 360° dưới đáy</span>
                      <input
                        type="checkbox"
                        checked={showTurntableBar}
                        onChange={(e) => setShowTurntableBar(e.target.checked)}
                        className="rounded text-amber-800 accent-amber-800"
                      />
                    </label>

                    <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-stone-50 cursor-pointer">
                      <span className="text-stone-700 font-medium">Thanh công cụ đồ họa trên</span>
                      <input
                        type="checkbox"
                        checked={showTopControlBar}
                        onChange={(e) => setShowTopControlBar(e.target.checked)}
                        className="rounded text-amber-800 accent-amber-800"
                      />
                    </label>
                  </div>

                  <div className="pt-2.5 mt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setShowCameraPresets(false);
                        setShowDisplayModeHud(false);
                        setShowTurntableBar(false);
                        enableCleanView();
                        setShowVisibilitySettings(false);
                      }}
                      className="px-2.5 py-1 text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors font-medium"
                    >
                      Tắt tất cả
                    </button>
                    <button
                      onClick={() => {
                        setShowCameraPresets(true);
                        setShowDisplayModeHud(true);
                        setShowTurntableBar(true);
                        setShowTopControlBar(true);
                        disableCleanView();
                      }}
                      className="px-2.5 py-1 text-[11px] bg-amber-900 hover:bg-amber-950 text-white rounded-lg transition-colors font-medium"
                    >
                      Bật tất cả
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick close top bar button */}
            <button
              onClick={() => setShowTopControlBar(false)}
              className="p-1 rounded text-stone-400 hover:text-stone-700 transition-colors ml-0.5"
              title="Tắt thanh công cụ trên cùng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. CAMERA LENS PRESETS HUD (QUICK VIEWPORTS)                  */}
      {/* ============================================================ */}
      {!isCleanView && showCameraPresets && (
        <div className="absolute top-12 left-4 z-20 flex flex-col gap-1.5 bg-white/85 backdrop-blur-md p-1.5 rounded-xl border border-stone-200/90 shadow-sm text-[11px]">
          <div className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-stone-400 font-bold border-b border-stone-100 flex items-center justify-between">
            <span>Ống Kính</span>
            <button
              onClick={() => setShowCameraPresets(false)}
              className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition-colors ml-2"
              title="Tắt bảng góc nhìn này"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          {[
            { key: 'full', label: 'Toàn Thân', icon: Maximize2 },
            { key: 'portrait', label: 'Chân Dung', icon: Focus },
            { key: 'collar', label: 'Cổ & Ngũ Cúc', icon: Scissors },
            { key: 'waist', label: 'Vạt & Xếp Ly', icon: Layers },
            { key: 'shoes', label: 'Giày Sneaker', icon: Box }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = cameraFocus === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setCameraFocus(item.key as any);
                  if (item.key === 'full') setZoomLevel(1);
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-amber-900 text-white font-medium shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2B. DISPLAY MODE HUD (PHỐI ĐỒ THỰC CHẤT vs SIÊU MẪU RUNWAY) */}
      {/* ============================================================ */}
      {!isCleanView && showDisplayModeHud && (
        <div className="absolute top-12 right-4 z-20 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-stone-200/90 shadow-sm text-[11px] max-w-[215px]">
          <div className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-amber-900 font-bold border-b border-stone-100 flex items-center justify-between">
            <span>Hình Thức Phối Đồ</span>
            <div className="flex items-center gap-1">
              <span className="text-[8px] px-1 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">Couture</span>
              <button
                onClick={() => setShowDisplayModeHud(false)}
                className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition-colors ml-1"
                title="Tắt bảng hình thức phối đồ này"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          {[
            { key: 'vietnamese_muse', label: 'Nàng Thơ / Chàng Thơ Á Đông', desc: 'Người Mẫu 3D Thuần Việt Siêu Thực', icon: UserCheck },
            { key: 'atelier_mannequin', label: 'Hình Nộm May Đo Atelier', desc: 'Mannequin Vải Bố & Gỗ Mun Thực Tế', icon: Shirt },
            { key: 'ghost_couture', label: 'Phối Đồ Thực Chất', desc: 'Ghost Mannequin / Tàng Hình Nộm', icon: Sparkles },
            { key: 'runway_shades', label: 'Siêu Mẫu Runway', desc: 'Kính Mát Haute-Couture', icon: Eye },
            { key: 'editorial_silhouette', label: 'Silhouette Tối Giản', desc: 'Điêu Khắc Vô Diện', icon: Focus },
            { key: 'editorial_sketch', label: 'Phác Thảo Tranh Lụa', desc: 'Nét Chì Thủy Mặc Dân Gian', icon: Scissors }
          ].map((m) => {
            const Icon = m.icon;
            const isActive = currentDisplayMode === m.key;
            return (
              <button
                key={m.key}
                onClick={() => handleDisplayModeSelect(m.key as any)}
                className={`flex items-start gap-1.5 px-2 py-1.5 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-amber-950 text-amber-100 font-medium shadow-xs border border-amber-800/40'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                <div className="flex flex-col">
                  <span className="font-semibold text-[11px] leading-tight">{m.label}</span>
                  <span className={`text-[9px] leading-tight ${isActive ? 'text-amber-200/80' : 'text-stone-400'}`}>
                    {m.desc}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Quick Hair Selector when in human model modes */}
          {currentDisplayMode !== 'ghost_couture' && currentDisplayMode !== 'atelier_mannequin' && onHairStyleChange && (
            <div className="pt-1.5 mt-0.5 border-t border-stone-100 flex flex-col gap-1">
              <span className="text-[9px] font-mono text-stone-500 uppercase px-1">Mái Tóc & Phục Sức</span>
              <select
                value={hairStyle}
                onChange={(e) => onHairStyleChange(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded px-1.5 py-1 text-[10px] font-medium"
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
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. MAIN 3D METAHUMAN STAGE (AVATAR VISUALIZER WITH SHADING)  */}
      {/* ============================================================ */}
      <div className={`relative flex-1 w-full flex items-center justify-center p-2 bg-gradient-to-b ${getBackgroundClass()} overflow-hidden transition-colors duration-500`}>
        {/* Subtle Architectural Studio Grid Floor */}
        <div className="absolute inset-0 pointer-events-none opacity-20" suppressHydrationWarning>
          <svg className="w-full h-full" suppressHydrationWarning>
            <defs>
              <pattern id="studio-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#A8A29E" strokeWidth="0.8" strokeDasharray="3,3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#studio-grid)" />
          </svg>
        </div>

        {/* Ambient Octabox Overhead Diffuser Halos */}
        <div className="absolute w-[440px] h-[440px] rounded-full border border-stone-300/30 pointer-events-none -top-16 opacity-30" />
        <div className="absolute w-[520px] h-[520px] rounded-full border border-amber-800/15 pointer-events-none -top-24" />

        {/* Floating Fitting Feedback Toast */}
        <AnimatePresence>
          {fittingNotification && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-3 z-30 pointer-events-none flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900/90 text-amber-100 text-xs font-medium rounded-full shadow-lg backdrop-blur-md border border-amber-800/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{fittingNotification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Clean View / Restore Overlay Controls */}
        {(isCleanView || !showTopControlBar || !showCameraPresets || !showDisplayModeHud || !showTurntableBar) && (
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-stone-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xl border border-amber-800/40 text-xs">
            {isCleanView ? (
              <button
                onClick={toggleMasterCleanView}
                className="flex items-center gap-1.5 text-amber-100 hover:text-white font-medium transition-colors"
                title="Bật lại toàn bộ thanh công cụ và góc nhìn xung quanh mô hình"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Hiện công cụ & góc nhìn</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-amber-200/80 text-[11px]">Đang ẩn một số công cụ</span>
                <button
                  onClick={() => {
                    disableCleanView();
                    setShowTopControlBar(true);
                    setShowCameraPresets(true);
                    setShowDisplayModeHud(true);
                    setShowTurntableBar(true);
                  }}
                  className="text-amber-300 hover:text-amber-100 font-semibold underline text-[11px] ml-1"
                >
                  Khôi phục tất cả
                </button>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Vector SVG & Canvas Graphics Canvas with Motion Fitting & Turntable Perspective */}
        <div
          className="relative w-full max-w-[460px] aspect-[2/3] max-h-full flex items-center justify-center transition-transform duration-500 ease-out"
          style={{
            transform: `scale(${currentTransform.scale}) translateY(${currentTransform.translateY}px)`
          }}
        >
          {/* Subtle silk sheen light sweep wave on fit change */}
          {fittingNotification && (
            <motion.div
              key={`sheen-${outfitKey}-${colorKey}`}
              initial={{ opacity: 0.6, x: -160 }}
              animate={{ opacity: 0, x: 340 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none rotate-12 z-20"
            />
          )}

          {/* DEDICATED AVATAR VISUALIZER WITH SHADING, CANVAS DEPTH & ANATOMICAL CORRECTNESS */}
          <AvatarVisualizer
            gender={gender}
            skinTone={skinTone}
            hairStyle={hairStyle}
            mainGarment={mainGarment}
            innerGarment={innerGarment}
            bottomGarment={bottomGarment}
            shoes={shoes}
            accessory={accessory}
            mainColor={mainColor}
            innerColor={innerColor}
            bottomColor={bottomColor}
            isOpenOuterwear={isOpenOuterwear}
            lapelDirection={lapelDirection}
            showHotspots={isCleanView ? false : showHotspots}
            onSelectHotspot={onSelectHotspot}
            turntableAngle={turntableAngle}
            graphicsPass={graphicsPass}
            lightingMode={lightingMode}
            showWireframeLines={showWireframeLines}
            onInspectMaterial={(mat) => setInspectedMaterial(mat)}
            displayMode={currentDisplayMode}
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. TURNTABLE DEGREE SLIDER & BOTTOM STATUS BAR              */}
      {/* ============================================================ */}
      {!isCleanView && showTurntableBar && (
        <div className="w-full flex flex-col border-t border-stone-200/80 bg-white/85 backdrop-blur-md z-20">
          {/* Turntable Slider Control Strip */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-stone-100 text-xs">
            <div className="flex items-center gap-2 text-stone-600">
              <Compass className="w-3.5 h-3.5 text-amber-800" />
              <span className="font-medium text-stone-900">Góc Xoay Turntable:</span>
              <span className="tabular-nums font-mono font-bold text-amber-900">{turntableAngle}°</span>
            </div>

            <div className="flex-1 max-w-xs mx-4">
              <input
                type="range"
                min="0"
                max="359"
                value={turntableAngle}
                onChange={(e) => {
                  setTurntableAngle(Number(e.target.value));
                  setIsAutoRotating(false);
                }}
                className="w-full accent-amber-800 cursor-ew-resize h-1.5 bg-stone-200 rounded-lg"
                aria-label="Thanh trượt góc xoay Turntable 360 độ"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 overflow-x-auto no-scrollbar">
              <button
                onClick={() => { setTurntableAngle(0); setIsAutoRotating(false); }}
                className={`px-2 py-0.5 rounded border transition-colors ${turntableAngle === 0 ? 'bg-stone-900 text-white' : 'hover:bg-stone-100'}`}
              >
                Chính Diện (0°)
              </button>
              <button
                onClick={() => { setTurntableAngle(45); setIsAutoRotating(false); }}
                className={`px-2 py-0.5 rounded border transition-colors ${turntableAngle === 45 ? 'bg-stone-900 text-white' : 'hover:bg-stone-100'}`}
              >
                Góc 3/4 (45°)
              </button>
              <button
                onClick={() => { setTurntableAngle(90); setIsAutoRotating(false); }}
                className={`px-2 py-0.5 rounded border transition-colors ${turntableAngle === 90 ? 'bg-stone-900 text-white' : 'hover:bg-stone-100'}`}
              >
                Trắc Diện Phải (90°)
              </button>
              <button
                onClick={() => { setTurntableAngle(180); setIsAutoRotating(false); }}
                className={`px-2 py-0.5 rounded border transition-colors ${turntableAngle === 180 ? 'bg-stone-900 text-white' : 'hover:bg-stone-100'}`}
              >
                Sau Lưng (180°)
              </button>
              <button
                onClick={() => { setTurntableAngle(270); setIsAutoRotating(false); }}
                className={`px-2 py-0.5 rounded border transition-colors ${turntableAngle === 270 ? 'bg-stone-900 text-white' : 'hover:bg-stone-100'}`}
              >
                Trắc Diện Trái (270°)
              </button>

              <button
                onClick={() => setShowTurntableBar(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700 ml-1 transition-colors"
                title="Tắt thanh xoay góc nhìn dưới đáy"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Engine Status Line */}
          <div className="flex items-center justify-between px-4 py-2 text-xs text-stone-600">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-stone-900 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full border border-stone-400" style={{ backgroundColor: mainColor }} />
                {mainGarment.name}
              </span>
              <span className="text-stone-300">/</span>
              <span className="truncate max-w-[140px]">{innerGarment.name}</span>
              <span className="text-stone-300">/</span>
              <span className="truncate max-w-[140px]">{bottomGarment.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setInspectedMaterial(PBR_MATERIALS[0])}
                className="flex items-center gap-1 text-[11px] font-medium text-amber-900 hover:text-stone-900 transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>Soi Chất Liệu PBR</span>
              </button>
              <span className="text-stone-300">·</span>
              <button
                onClick={() => onSelectHotspot('lap_linh_collar')}
                className="flex items-center gap-1 text-[11px] font-medium text-stone-900 hover:text-amber-800 transition-colors"
              >
                <Info className="w-3 h-3" />
                <span>Giải mã nét xưa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. PBR MATERIAL SHADER INSPECT MODAL                         */}
      {/* ============================================================ */}
      {inspectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl border border-amber-900/20 shadow-2xl p-6 text-stone-900">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                  style={{ backgroundColor: inspectedMaterial.previewColor }}
                >
                  <Sparkles className="w-4 h-4 text-stone-900 opacity-60" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 font-bold block">
                    PBR Material Shader Inspect
                  </span>
                  <h3 className="font-serif-title font-bold text-base text-stone-900">
                    {inspectedMaterial.name} ({inspectedMaterial.vietnameseName})
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setInspectedMaterial(null)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <p className="text-stone-700 leading-relaxed">
                {inspectedMaterial.description}
              </p>

              {/* Physical Parameters Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center">
                  <span className="text-[10px] text-stone-400 block">Roughness</span>
                  <span className="font-mono font-bold text-stone-900">{inspectedMaterial.roughness}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center">
                  <span className="text-[10px] text-stone-400 block">Metallic</span>
                  <span className="font-mono font-bold text-stone-900">{inspectedMaterial.metallic}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center">
                  <span className="text-[10px] text-stone-400 block">Subsurface</span>
                  <span className="font-mono font-bold text-stone-900">{inspectedMaterial.subsurface}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950">
                <span className="font-semibold block mb-0.5">Tiêu Chuẩn Đồ Họa Metahuman 8K:</span>
                Vải và phụ kiện được mô phỏng theo chuẩn Physically Based Rendering (PBR), tái hiện hoàn hảo từ sợi tơ tằm đũi hữu cơ đến ánh đồng thau xước phay.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setInspectedMaterial(null)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
