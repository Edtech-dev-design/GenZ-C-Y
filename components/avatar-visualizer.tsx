'use client';

import React, { useRef, useEffect } from 'react';
import { GarmentItem, PBR_MATERIALS } from '@/lib/heritage-data';

export type DisplayMode =
  | 'ghost_couture'
  | 'atelier_mannequin'
  | 'vietnamese_muse'
  | 'runway_shades'
  | 'editorial_silhouette'
  | 'editorial_sketch';

export interface AvatarVisualizerProps {
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
  turntableAngle: number;
  graphicsPass: 'full_pbr' | 'anatomy_grid' | 'seam_blueprint' | 'exploded_orbit' | 'clay_ao';
  lightingMode: 'three_point' | 'amber_rim' | 'exhibition_dark' | 'clay_pbr';
  showWireframeLines: boolean;
  onInspectMaterial?: (material: any) => void;
  displayMode?: DisplayMode;
}

// Color and PBR helper utilities for Canvas 2D/3D shaders
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = (hex || '#FAF8F5').replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return { r: 180, g: 160, b: 140 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbaStr(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function shadeColor(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 + percent / 100;
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
  return `rgb(${newR}, ${newG}, ${newB})`;
}

export default function AvatarVisualizer({
  gender = 'female',
  skinTone = '#FED7AA',
  hairStyle = 'khan_van',
  mainGarment,
  innerGarment,
  bottomGarment,
  shoes,
  accessory,
  mainColor = '#1E3A8A',
  innerColor = '#FAF8F5',
  bottomColor = '#1E1B4B',
  isOpenOuterwear = false,
  lapelDirection = 'right',
  showHotspots = true,
  onSelectHotspot,
  turntableAngle = 0,
  graphicsPass = 'full_pbr',
  lightingMode = 'three_point',
  showWireframeLines = false,
  onInspectMaterial,
  displayMode = 'vietnamese_muse'
}: AvatarVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Turntable rotation physics
    const rad = (turntableAngle * Math.PI) / 180;
    const facing = Math.cos(rad);
    const turnSide = Math.sin(rad);
    const isBack = facing < 0;
    const isProfile = Math.abs(turnSide) > 0.72;
    const isClayMode = graphicsPass === 'clay_ao' || lightingMode === 'clay_pbr';
    const isGhost = displayMode === 'ghost_couture';
    const isAtelierMannequin = displayMode === 'atelier_mannequin';

    // Garment type detection
    const mainId = mainGarment?.id || 'ngu_than_tay_chen';
    const isNhatBinh = mainId === 'nhat_binh' || mainGarment?.subType === 'nhat_binh';
    const isTayThung = mainId === 'ngu_than_tay_thung';
    const isTuThan = mainId === 'tu_than' || mainGarment?.subType === 'tu_than';
    const isGiaoLinh = mainId === 'ao_giao_linh' || mainGarment?.subType === 'giao_linh';
    const isLemur = mainId === 'lemur_tan_thoi' || mainGarment?.subType === 'lemur';
    const isCoThuyen = mainId === 'ao_dai_ba_nhu' || mainGarment?.subType === 'co_thuyen';

    // Color definitions
    const effectiveSkinTone = isClayMode ? '#E7E5E4' : skinTone;
    const effectiveMainColor = isClayMode ? '#D6D3D1' : mainColor;
    const effectiveInnerColor = isClayMode ? '#E5E5E5' : innerColor;
    const effectiveBottomColor = isClayMode ? '#A8A29E' : bottomColor;

    // Key body anatomical proportions (7.5 Head Ratio)
    const centerX = w / 2;
    const isMale = gender === 'male';
    const shoulderHalfWidth = isMale ? 58 : 44;
    const waistHalfWidth = isMale ? 34 : 24;
    const hipHalfWidth = isMale ? 38 : 40;
    const headRadius = isMale ? 25 : 23;
    const neckHalfWidth = isMale ? 18 : 14;
    const headShiftX = turnSide * 8;
    const headCenterY = 105;

    // Light source setup
    let lightX = -0.55;
    if (lightingMode === 'amber_rim') lightX = 0.85;
    else if (lightingMode === 'exhibition_dark') lightX = -0.2;

    // Clear Canvas
    ctx.clearRect(0, 0, w, h);

    // ================================================================
    // 1. EXHIBITION STUDIO ENVIRONMENT & TURNTABLE PEDESTAL
    // ================================================================
    // Floor Contact Occlusion Shadow
    const floorAOGrad = ctx.createRadialGradient(w / 2, 696, 12, w / 2, 696, 175);
    floorAOGrad.addColorStop(0, 'rgba(15, 12, 10, 0.48)');
    floorAOGrad.addColorStop(0.35, 'rgba(15, 12, 10, 0.22)');
    floorAOGrad.addColorStop(0.7, 'rgba(15, 12, 10, 0.06)');
    floorAOGrad.addColorStop(1, 'rgba(15, 12, 10, 0)');
    ctx.fillStyle = floorAOGrad;
    ctx.beginPath();
    ctx.ellipse(w / 2, 696, 175, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Exhibition Turntable Base Plinth
    const pedGrad = ctx.createLinearGradient(w / 2 - 160, 0, w / 2 + 160, 0);
    pedGrad.addColorStop(0, '#57534E');
    pedGrad.addColorStop(0.2, '#A8A29E');
    pedGrad.addColorStop(0.5, '#E7E5E4');
    pedGrad.addColorStop(0.8, '#78716C');
    pedGrad.addColorStop(1, '#44403C');
    ctx.fillStyle = pedGrad;
    ctx.beginPath();
    ctx.ellipse(w / 2, 706, 158, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Plinth Top Rim Highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(w / 2, 706, 158, 22, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Turntable Angle Indicator Ticks
    ctx.save();
    ctx.translate(w / 2, 706);
    ctx.strokeStyle = 'rgba(120, 113, 108, 0.4)';
    ctx.lineWidth = 1;
    for (let angle = 0; angle < 360; angle += 30) {
      const aRad = ((angle + turntableAngle) * Math.PI) / 180;
      const tx = Math.cos(aRad) * 152;
      const ty = Math.sin(aRad) * 20;
      ctx.beginPath();
      ctx.moveTo(tx * 0.94, ty * 0.94);
      ctx.lineTo(tx, ty);
      ctx.stroke();
    }
    ctx.restore();

    // Foot / Mannequin Stand Contact Shadow
    const footShadow = ctx.createRadialGradient(centerX, 672, 8, centerX, 672, 95);
    footShadow.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    footShadow.addColorStop(0.5, 'rgba(0, 0, 0, 0.28)');
    footShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = footShadow;
    ctx.beginPath();
    ctx.ellipse(centerX, 672, 86, 17, 0, 0, Math.PI * 2);
    ctx.fill();

    // HÌNH NỘM THỢ MAY: Cọc kim loại đỡ ma-nơ-canh & chốt khóa tăng đơ
    if (isAtelierMannequin) {
      // Trục kim loại thợ may mạ chrome xước
      const poleGrad = ctx.createLinearGradient(centerX - 5, 0, centerX + 5, 0);
      poleGrad.addColorStop(0, '#27272A');
      poleGrad.addColorStop(0.35, '#71717A');
      poleGrad.addColorStop(0.65, '#E4E4E7');
      poleGrad.addColorStop(1, '#18181B');
      ctx.fillStyle = poleGrad;
      ctx.fillRect(centerX - 4.5, 395, 9, 305);

      // Ốc siết cánh bướm điều chỉnh chiều cao
      ctx.fillStyle = '#CA8A04';
      ctx.beginPath();
      ctx.arc(centerX + 6.5, 530, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(centerX + 4, 528, 8, 4.5);
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(centerX + 4, 528, 8, 4.5);

      // Chân đế ba chạc kim loại thợ may (Tripod Cast Base)
      ctx.strokeStyle = '#3F3F46';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX, 680);
      ctx.lineTo(centerX - 68, 702);
      ctx.moveTo(centerX, 680);
      ctx.lineTo(centerX + 68, 702);
      ctx.moveTo(centerX, 680);
      ctx.lineTo(centerX, 706);
      ctx.stroke();
    }

    // ================================================================
    // 2. MODEL BODY SILHOUETTE / TAILORING SUPPORT
    // ================================================================
    const torsoGrad = ctx.createLinearGradient(
      centerX - shoulderHalfWidth,
      0,
      centerX + shoulderHalfWidth,
      0
    );
    if (isGhost) {
      torsoGrad.addColorStop(0, 'rgba(214, 211, 209, 0.20)');
      torsoGrad.addColorStop(0.5, 'rgba(245, 245, 244, 0.32)');
      torsoGrad.addColorStop(1, 'rgba(168, 162, 158, 0.16)');
    } else if (isAtelierMannequin) {
      // Vải Bố Linen May Đo Atelier Cao Cấp (French Ecru Tailor Canvas)
      torsoGrad.addColorStop(0, '#B8ACA0');
      torsoGrad.addColorStop(0.2, '#DDD5CA');
      torsoGrad.addColorStop(0.5, '#ECE6DC');
      torsoGrad.addColorStop(0.8, '#D8D0C4');
      torsoGrad.addColorStop(1, '#9E9486');
    } else {
      torsoGrad.addColorStop(0, shadeColor(effectiveSkinTone, -16));
      torsoGrad.addColorStop(0.35, effectiveSkinTone);
      torsoGrad.addColorStop(0.7, shadeColor(effectiveSkinTone, 6));
      torsoGrad.addColorStop(1, shadeColor(effectiveSkinTone, -22));
    }

    ctx.fillStyle = torsoGrad;
    ctx.beginPath();
    ctx.moveTo(centerX - shoulderHalfWidth, 205);
    ctx.quadraticCurveTo(centerX - shoulderHalfWidth * 0.8, 258, centerX - waistHalfWidth, 310);
    ctx.quadraticCurveTo(centerX - waistHalfWidth * 0.9, 360, centerX - hipHalfWidth, 400);
    ctx.quadraticCurveTo(centerX, 412, centerX + hipHalfWidth, 400);
    ctx.quadraticCurveTo(centerX + waistHalfWidth * 0.9, 360, centerX + waistHalfWidth, 310);
    ctx.quadraticCurveTo(centerX + shoulderHalfWidth * 0.8, 258, centerX + shoulderHalfWidth, 205);
    ctx.quadraticCurveTo(centerX + neckHalfWidth + 10, 185, centerX + neckHalfWidth, 178);
    ctx.lineTo(centerX - neckHalfWidth, 178);
    ctx.quadraticCurveTo(centerX - neckHalfWidth - 10, 185, centerX - shoulderHalfWidth, 205);
    ctx.closePath();
    ctx.fill();

    // VÂN VẢI BỐ VÀ ĐƯỜNG MAY COUTURE TRÊN HÌNH NỘM THỢ MAY
    if (isAtelierMannequin) {
      // 1. Vân sợi vải bố tự nhiên (Micro-texture)
      ctx.save();
      ctx.strokeStyle = 'rgba(120, 113, 108, 0.12)';
      ctx.lineWidth = 0.6;
      for (let ly = 195; ly <= 390; ly += 7) {
        ctx.beginPath();
        ctx.moveTo(centerX - 35, ly);
        ctx.lineTo(centerX + 35, ly);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Đường chỉ may sống giữa thân trước (Center Front Seam)
      ctx.strokeStyle = '#44403C';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 2.5]);
      ctx.beginPath();
      ctx.moveTo(centerX, 180);
      ctx.lineTo(centerX, 400);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Đường cúp ngực công chúa thợ may (Princess Seams)
      ctx.strokeStyle = 'rgba(87, 83, 78, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 24, 210);
      ctx.quadraticCurveTo(centerX - 18, 260, centerX - 14, 310);
      ctx.lineTo(centerX - 20, 395);
      ctx.moveTo(centerX + 24, 210);
      ctx.quadraticCurveTo(centerX + 18, 260, centerX + 14, 310);
      ctx.lineTo(centerX + 20, 395);
      ctx.stroke();

      // 4. Dải ruy-băng phân định vòng eo chuẩn thợ may (Grosgrain Waist Ribbon Tape)
      ctx.fillStyle = '#292524';
      ctx.fillRect(centerX - waistHalfWidth, 308, waistHalfWidth * 2, 4.5);
      ctx.strokeStyle = '#CA8A04';
      ctx.lineWidth = 0.6;
      ctx.strokeRect(centerX - waistHalfWidth, 308, waistHalfWidth * 2, 4.5);

      // 5. Con dấu xưởng may di sản Việt Nam (Atelier Stamp)
      if (!isBack) {
        ctx.fillStyle = '#78716C';
        ctx.font = 'bold 5px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NAM GIAO ATELIER · NO. 42', centerX, 248);
      }
    }

    // Clavicle & chest contours for human model modes
    if (!isGhost && !isAtelierMannequin && !isBack) {
      ctx.strokeStyle = rgbaStr('#78350F', 0.22);
      ctx.lineWidth = isMale ? 1.6 : 1.2;
      ctx.beginPath();
      ctx.moveTo(centerX - neckHalfWidth - 10, 192);
      ctx.quadraticCurveTo(centerX - 10, 195, centerX - 4, 198);
      ctx.moveTo(centerX + 4, 198);
      ctx.quadraticCurveTo(centerX + 10, 195, centerX + neckHalfWidth + 10, 192);
      ctx.stroke();

      if (isMale) {
        // Pectoral definition for male model
        ctx.strokeStyle = rgbaStr('#78350F', 0.14);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(centerX - 28, 235);
        ctx.quadraticCurveTo(centerX - 12, 242, centerX - 4, 238);
        ctx.moveTo(centerX + 4, 238);
        ctx.quadraticCurveTo(centerX + 12, 242, centerX + 28, 235);
        ctx.stroke();
      }
    }

    // ================================================================
    // 3. HEAD & FACE / GHOST TAILORING OPENING / ATELIER MANNEQUIN
    // ================================================================
    if (isGhost) {
      // --------------------------------------------------------------
      // CHẾ ĐỘ PHỐI ĐỒ THỰC CHẤT (GHOST MANNEQUIN / TÀNG HÌNH NỘM)
      // Loại bỏ hoàn toàn hình nộm, tạo độ rỗng 3D cổ áo & lót lụa di sản
      // --------------------------------------------------------------
      const innerCollarGrad = ctx.createLinearGradient(0, 150, 0, 185);
      innerCollarGrad.addColorStop(0, shadeColor(effectiveMainColor, -45));
      innerCollarGrad.addColorStop(0.5, shadeColor(effectiveMainColor, -30));
      innerCollarGrad.addColorStop(1, shadeColor(effectiveMainColor, -15));
      ctx.fillStyle = innerCollarGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, 168, isNhatBinh ? 26 : 22, 14, 0, Math.PI, Math.PI * 2);
      ctx.fill();

      // White Silk Inner Lining Band
      ctx.strokeStyle = '#FAF8F5';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(centerX, 167, isNhatBinh ? 25 : 21, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();

      // Heritage Brand Label
      ctx.fillStyle = '#0C0A09';
      ctx.fillRect(centerX - 24, 165, 48, 12);
      ctx.strokeStyle = '#CA8A04';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(centerX - 24, 165, 48, 12);
      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 5px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('NAM GIAO ATELIER · HUẾ', centerX, 173.5);

      // Outer Oval Rim
      ctx.strokeStyle = 'rgba(214, 211, 209, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, 168, isNhatBinh ? 27 : 23, 15, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (isAtelierMannequin) {
      // --------------------------------------------------------------
      // HÌNH NỘM MAY ĐO ATELIER THỰC TẾ (REALISTIC HAUTE COUTURE FORM)
      // Vải bố linen cao cấp, chóp tiện gỗ mun, ngàm đồng thau cổ
      // --------------------------------------------------------------
      // 1. Cổ bọc vải bố linen
      const neckGrad = ctx.createLinearGradient(centerX - neckHalfWidth, 0, centerX + neckHalfWidth, 0);
      neckGrad.addColorStop(0, '#B8ACA0');
      neckGrad.addColorStop(0.35, '#DDD5CA');
      neckGrad.addColorStop(0.7, '#EBE4DA');
      neckGrad.addColorStop(1, '#9E9486');
      ctx.fillStyle = neckGrad;
      ctx.beginPath();
      ctx.moveTo(centerX - neckHalfWidth, 142);
      ctx.lineTo(centerX - neckHalfWidth - 1, 182);
      ctx.lineTo(centerX + neckHalfWidth + 1, 182);
      ctx.lineTo(centerX + neckHalfWidth, 142);
      ctx.closePath();
      ctx.fill();

      // Đĩa ngàm đồng thau xước (Brushed Antique Brass Collar)
      const brassGrad = ctx.createLinearGradient(centerX - neckHalfWidth - 3, 0, centerX + neckHalfWidth + 3, 0);
      brassGrad.addColorStop(0, '#854D0E');
      brassGrad.addColorStop(0.3, '#FEF08A');
      brassGrad.addColorStop(0.6, '#CA8A04');
      brassGrad.addColorStop(1, '#713F12');
      ctx.fillStyle = brassGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, 142, neckHalfWidth + 2.5, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Chóp tiện gỗ mun / sồi thủ công tinh xảo (Turned Hardwood Finial)
      const woodGrad = ctx.createRadialGradient(centerX - 3, 116, 2, centerX, 120, 22);
      woodGrad.addColorStop(0, '#663300');
      woodGrad.addColorStop(0.4, '#3D1C06');
      woodGrad.addColorStop(0.85, '#241003');
      woodGrad.addColorStop(1, '#140801');
      ctx.fillStyle = woodGrad;

      // Cổ chóp tiện
      ctx.beginPath();
      ctx.ellipse(centerX, 134, 9, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Quả chóp tiện hình tròn giọt nước
      ctx.beginPath();
      ctx.arc(centerX, 118, 14, 0, Math.PI * 2);
      ctx.fill();

      // Vòng ngấn tiện gỗ & ánh bóng vec-ni (Varnish highlight)
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(centerX - 3, 115, 10, -Math.PI * 0.8, -Math.PI * 0.2);
      ctx.stroke();

      ctx.strokeStyle = '#140801';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, 126, 8.5, 2.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Chỏm vai gỗ thợ may (Turned Wood Shoulder Caps)
      const drawShoulderCap = (capX: number, isRight: boolean) => {
        ctx.fillStyle = woodGrad;
        ctx.beginPath();
        ctx.ellipse(capX, 204, 6.5, 12, isRight ? 0.3 : -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FEF08A';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      };
      drawShoulderCap(centerX - shoulderHalfWidth, false);
      drawShoulderCap(centerX + shoulderHalfWidth, true);
    } else {
      // --------------------------------------------------------------
      // CÁC CHẾ ĐỘ NGƯỜI MẪU (VIETNAMESE MUSE / RUNWAY / SILHOUETTE / SKETCH)
      // --------------------------------------------------------------
      // 1. Neck with cylindrical volume
      const neckGrad = ctx.createLinearGradient(centerX - neckHalfWidth, 0, centerX + neckHalfWidth, 0);
      neckGrad.addColorStop(0, shadeColor(effectiveSkinTone, -18));
      neckGrad.addColorStop(0.4, effectiveSkinTone);
      neckGrad.addColorStop(0.85, shadeColor(effectiveSkinTone, 8));
      neckGrad.addColorStop(1, shadeColor(effectiveSkinTone, -25));
      ctx.fillStyle = neckGrad;
      ctx.beginPath();
      ctx.moveTo(centerX - neckHalfWidth, 140);
      ctx.lineTo(centerX - neckHalfWidth - 1, 190);
      ctx.lineTo(centerX + neckHalfWidth + 1, 190);
      ctx.lineTo(centerX + neckHalfWidth, 140);
      ctx.closePath();
      ctx.fill();

      // Jawline cast shadow onto neck
      if (!isBack) {
        const jawShadow = ctx.createLinearGradient(0, 142, 0, 158);
        jawShadow.addColorStop(0, 'rgba(40, 18, 5, 0.42)');
        jawShadow.addColorStop(1, 'rgba(40, 18, 5, 0)');
        ctx.fillStyle = jawShadow;
        ctx.beginPath();
        ctx.ellipse(centerX, 148, neckHalfWidth + 2, 5.5, 0, 0, Math.PI);
        ctx.fill();
      }

      // Head Volume & Soft Lighting
      const faceGrad = ctx.createRadialGradient(
        centerX + headShiftX + lightX * 9,
        headCenterY - 6,
        6,
        centerX + headShiftX,
        headCenterY + 8,
        36
      );
      faceGrad.addColorStop(0, shadeColor(effectiveSkinTone, 14));
      faceGrad.addColorStop(0.45, effectiveSkinTone);
      faceGrad.addColorStop(0.85, shadeColor(effectiveSkinTone, -12));
      faceGrad.addColorStop(1, shadeColor(effectiveSkinTone, -26));
      ctx.fillStyle = faceGrad;

      ctx.beginPath();
      if (isMale) {
        // Masculine defined jawline
        ctx.moveTo(centerX + headShiftX - headRadius, 92);
        ctx.quadraticCurveTo(centerX + headShiftX - headRadius - 1, 122, centerX + headShiftX - 19, 142);
        ctx.lineTo(centerX + headShiftX - 9, 150);
        ctx.lineTo(centerX + headShiftX + 9, 150);
        ctx.lineTo(centerX + headShiftX + 19, 142);
        ctx.quadraticCurveTo(centerX + headShiftX + headRadius + 1, 122, centerX + headShiftX + headRadius, 92);
        ctx.quadraticCurveTo(centerX + headShiftX + headRadius - 2, 60, centerX + headShiftX, 60);
        ctx.quadraticCurveTo(centerX + headShiftX - headRadius + 2, 60, centerX + headShiftX - headRadius, 92);
      } else {
        // Feminine graceful oval chin
        ctx.moveTo(centerX + headShiftX - headRadius, 92);
        ctx.quadraticCurveTo(centerX + headShiftX - headRadius - 2, 126, centerX + headShiftX - 15, 144);
        ctx.quadraticCurveTo(centerX + headShiftX, 153, centerX + headShiftX + 15, 144);
        ctx.quadraticCurveTo(centerX + headShiftX + headRadius + 2, 126, centerX + headShiftX + headRadius, 92);
        ctx.quadraticCurveTo(centerX + headShiftX + headRadius - 2, 62, centerX + headShiftX, 62);
        ctx.quadraticCurveTo(centerX + headShiftX - headRadius + 2, 62, centerX + headShiftX - headRadius, 92);
      }
      ctx.closePath();
      ctx.fill();

      // Vành tai & Hoa tai Á Đông (Realistic Ears & Earrings)
      if (!isBack) {
        const drawRealisticEar = (earX: number, isRight: boolean) => {
          const earDir = isRight ? 1 : -1;
          const earY = 114;
          const earGrad = ctx.createLinearGradient(earX - 4, 0, earX + 4, 0);
          earGrad.addColorStop(0, shadeColor(effectiveSkinTone, -8));
          earGrad.addColorStop(0.5, effectiveSkinTone);
          earGrad.addColorStop(1, shadeColor(effectiveSkinTone, -18));
          ctx.fillStyle = earGrad;
          ctx.beginPath();
          ctx.ellipse(earX, earY, 4.2, 9, earDir * 0.12, 0, Math.PI * 2);
          ctx.fill();

          // Lõm vành tai (Inner Concha Shadow)
          ctx.strokeStyle = rgbaStr('#78350F', 0.28);
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.arc(earX - earDir * 0.8, earY - 1, 3, 0, Math.PI * 2);
          ctx.stroke();

          // Dái tai
          ctx.beginPath();
          ctx.arc(earX, earY + 7, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Khuyên tai ngọc bích / ngọc trai (Earring Drop)
          if (!isMale) {
            ctx.strokeStyle = '#CA8A04';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(earX, earY + 7.5);
            ctx.lineTo(earX, earY + 11.5);
            ctx.stroke();

            ctx.fillStyle = hairStyle === 'bun_tram' ? '#059669' : '#FAF8F5';
            ctx.beginPath();
            ctx.arc(earX, earY + 13, 2.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(earX - 0.6, earY + 12.4, 0.75, 0, Math.PI * 2);
            ctx.fill();
          }
        };

        drawRealisticEar(centerX + headShiftX - headRadius + 0.8, false);
        drawRealisticEar(centerX + headShiftX + headRadius - 0.8, true);
      }

      if (isBack) {
        // Nape line
        ctx.strokeStyle = rgbaStr('#451A03', 0.16);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(centerX - 9, 148);
        ctx.lineTo(centerX - 11, 178);
        ctx.moveTo(centerX + 9, 148);
        ctx.lineTo(centerX + 11, 178);
        ctx.stroke();
      } else {
        const faceFeaturesX = centerX + headShiftX + turnSide * 8;

        // ============================================================
        // MODE 1: NÀNG THƠ / CHÀNG THƠ Á ĐÔNG (VIETNAMESE MUSE)
        // ============================================================
        if (displayMode === 'vietnamese_muse') {
          if (!isMale) {
            // Soft Cheek Blush (Nữ: Gò má ửng hồng phấn nhẹ)
            const blushGradL = ctx.createRadialGradient(faceFeaturesX - 12, 122, 1, faceFeaturesX - 12, 122, 9);
            blushGradL.addColorStop(0, 'rgba(244, 63, 94, 0.22)');
            blushGradL.addColorStop(1, 'rgba(244, 63, 94, 0)');
            ctx.fillStyle = blushGradL;
            ctx.beginPath();
            ctx.arc(faceFeaturesX - 12, 122, 9, 0, Math.PI * 2);
            ctx.fill();

            const blushGradR = ctx.createRadialGradient(faceFeaturesX + 12, 122, 1, faceFeaturesX + 12, 122, 9);
            blushGradR.addColorStop(0, 'rgba(244, 63, 94, 0.22)');
            blushGradR.addColorStop(1, 'rgba(244, 63, 94, 0)');
            ctx.fillStyle = blushGradR;
            ctx.beginPath();
            ctx.arc(faceFeaturesX + 12, 122, 9, 0, Math.PI * 2);
            ctx.fill();

            // 1. Lông Mày Lá Liễu Thanh Mảnh (Willow-leaf Eyebrows)
            ctx.strokeStyle = '#27272A';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(faceFeaturesX - 17, 102);
            ctx.quadraticCurveTo(faceFeaturesX - 10, 97, faceFeaturesX - 3, 101);
            ctx.moveTo(faceFeaturesX + 3, 101);
            ctx.quadraticCurveTo(faceFeaturesX + 10, 97, faceFeaturesX + 17, 102);
            ctx.stroke();
          } else {
            // 1. Nam: Lông Mày Kiếm Thẳng Đĩnh Đạc (Sword Eyebrows)
            ctx.strokeStyle = '#18181B';
            ctx.lineWidth = 1.9;
            ctx.beginPath();
            ctx.moveTo(faceFeaturesX - 18, 101);
            ctx.lineTo(faceFeaturesX - 3, 100);
            ctx.moveTo(faceFeaturesX + 3, 100);
            ctx.lineTo(faceFeaturesX + 18, 101);
            ctx.stroke();
          }

          // 2. Mắt Phượng Á Đông (Almond Phoenix Eyes với 2 mí và hàng mi chuốt)
          const drawAsianEye = (eyeX: number, isRight: boolean) => {
            const dir = isRight ? 1 : -1;

            // Nếp mí mắt đôi mềm mại (Double eyelid crease)
            ctx.strokeStyle = 'rgba(60, 25, 10, 0.35)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(eyeX - dir * 6.5, 105.5);
            ctx.quadraticCurveTo(eyeX, 104, eyeX + dir * 6.5, 105.2);
            ctx.stroke();

            // Viền mi trên sắc sảo
            ctx.strokeStyle = '#18181B';
            ctx.lineWidth = isMale ? 1.5 : 1.4;
            ctx.beginPath();
            ctx.moveTo(eyeX - dir * 7, 110);
            ctx.quadraticCurveTo(eyeX, 106.5, eyeX + dir * 8, 108.5);
            ctx.stroke();

            // Sợi mi trên vút nhẹ
            if (!isMale) {
              ctx.strokeStyle = '#18181B';
              ctx.lineWidth = 0.7;
              ctx.beginPath();
              ctx.moveTo(eyeX + dir * 6, 108.8);
              ctx.lineTo(eyeX + dir * 8.5, 107.5);
              ctx.moveTo(eyeX + dir * 3, 107.2);
              ctx.lineTo(eyeX + dir * 4.5, 105.8);
              ctx.stroke();
            }

            // Viền mi dưới
            ctx.strokeStyle = 'rgba(63, 63, 70, 0.55)';
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(eyeX - dir * 6, 111);
            ctx.quadraticCurveTo(eyeX, 112.5, eyeX + dir * 7, 109.5);
            ctx.stroke();

            // Tròng mắt & Đồng tử nâu hổ phách Á Đông
            const irisGrad = ctx.createRadialGradient(eyeX, 109.5, 0.6, eyeX, 109.5, 2.7);
            irisGrad.addColorStop(0, '#451A03');
            irisGrad.addColorStop(0.65, '#271A14');
            irisGrad.addColorStop(1, '#0C0A09');
            ctx.fillStyle = irisGrad;
            ctx.beginPath();
            ctx.arc(eyeX, 109.5, 2.6, 0, Math.PI * 2);
            ctx.fill();

            // Đốm sáng lung linh chính (Primary Catchlight)
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(eyeX - 0.7, 108.5, 0.8, 0, Math.PI * 2);
            ctx.fill();

            // Đốm phản xạ hắt sáng phụ (Secondary bounce catchlight)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(eyeX + 0.6, 110.4, 0.45, 0, Math.PI * 2);
            ctx.fill();
          };

          drawAsianEye(faceFeaturesX - 10, false);
          drawAsianEye(faceFeaturesX + 10, true);

          // 3. Sống Mũi Dọc Dừa Thanh Thoát
          ctx.strokeStyle = rgbaStr('#78350F', isMale ? 0.35 : 0.28);
          ctx.lineWidth = isMale ? 1.3 : 1;
          ctx.beginPath();
          ctx.moveTo(faceFeaturesX, 106);
          ctx.lineTo(faceFeaturesX - 0.5, 123);
          ctx.quadraticCurveTo(faceFeaturesX, 125.5, faceFeaturesX + 2, 124.5);
          ctx.stroke();

          // Sống mũi bắt sáng tự nhiên
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(faceFeaturesX - 0.2, 108);
          ctx.lineTo(faceFeaturesX - 0.4, 121);
          ctx.stroke();

          // Cánh mũi
          ctx.strokeStyle = rgbaStr('#78350F', 0.22);
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(faceFeaturesX - 3.5, 124);
          ctx.quadraticCurveTo(faceFeaturesX - 2, 125, faceFeaturesX, 125.5);
          ctx.stroke();

          // 4. Môi Son Cánh Sen (Nữ) vs Môi Tự Nhiên Góc Cạnh (Nam)
          if (!isMale) {
            // Rãnh nhân trung thanh tú (Philtrum)
            ctx.strokeStyle = rgbaStr('#78350F', 0.16);
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(faceFeaturesX - 1.2, 127);
            ctx.lineTo(faceFeaturesX - 1.2, 133);
            ctx.moveTo(faceFeaturesX + 1.2, 127);
            ctx.lineTo(faceFeaturesX + 1.2, 133);
            ctx.stroke();

            const lipGrad = ctx.createRadialGradient(faceFeaturesX, 136, 1, faceFeaturesX, 136, 7);
            lipGrad.addColorStop(0, '#E11D48'); // Đỏ sen lòng môi
            lipGrad.addColorStop(0.6, '#FB7185'); // Hồng đào
            lipGrad.addColorStop(1, 'rgba(251, 113, 133, 0.1)');
            ctx.fillStyle = lipGrad;
            ctx.beginPath();
            ctx.ellipse(faceFeaturesX, 136, 6.2, 3.2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Đường khép môi mềm mại
            ctx.strokeStyle = 'rgba(225, 29, 72, 0.8)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(faceFeaturesX - 5, 135.5);
            ctx.quadraticCurveTo(faceFeaturesX, 137, faceFeaturesX + 5, 135.5);
            ctx.stroke();

            // Độ bóng căng mọng môi dưới (Gloss highlight)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
            ctx.beginPath();
            ctx.ellipse(faceFeaturesX, 137.2, 2.2, 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const maleLipGrad = ctx.createLinearGradient(0, 134, 0, 140);
            maleLipGrad.addColorStop(0, '#D97706');
            maleLipGrad.addColorStop(0.4, '#C2410C');
            maleLipGrad.addColorStop(1, '#9A3412');
            ctx.fillStyle = 'rgba(194, 65, 12, 0.45)';
            ctx.beginPath();
            ctx.ellipse(faceFeaturesX, 136.5, 6.8, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(120, 53, 15, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(faceFeaturesX - 6, 136.5);
            ctx.lineTo(faceFeaturesX + 6, 136.5);
            ctx.stroke();
          }
        }

        // ============================================================
        // MODE 2: SIÊU MẪU RUNWAY (RUNWAY SHADES)
        // ============================================================
        else if (displayMode === 'runway_shades') {
          const glassY = 108;
          const glassW = 15;
          const glassH = 9;

          ctx.strokeStyle = '#D97706';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(faceFeaturesX - glassW - 2, glassY);
          ctx.lineTo(faceFeaturesX + glassW + 2, glassY);
          ctx.stroke();

          ctx.fillStyle = '#09090B';
          ctx.strokeStyle = '#CA8A04';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(faceFeaturesX - glassW - 1, glassY - 5, glassW, glassH, 3);
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.roundRect(faceFeaturesX + 1, glassY - 5, glassW, glassH, 3);
          ctx.fill();
          ctx.stroke();

          // Glass glints
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(faceFeaturesX - 14, glassY + 3);
          ctx.lineTo(faceFeaturesX - 6, glassY - 4);
          ctx.moveTo(faceFeaturesX + 4, glassY + 3);
          ctx.lineTo(faceFeaturesX + 12, glassY - 4);
          ctx.stroke();

          ctx.strokeStyle = rgbaStr('#78350F', 0.25);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(faceFeaturesX - 3.5, 124);
          ctx.quadraticCurveTo(faceFeaturesX, 126, faceFeaturesX + 3.5, 124);
          ctx.stroke();

          ctx.fillStyle = 'rgba(194, 65, 12, 0.65)';
          ctx.beginPath();
          ctx.ellipse(faceFeaturesX, 136, 6, 2.8, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // ============================================================
        // MODE 3: SILHOUETTE TỐI GIẢN (ĐIÊU KHẮC VÔ DIỆN)
        // ============================================================
        else if (displayMode === 'editorial_silhouette') {
          const sculptGrad = ctx.createRadialGradient(faceFeaturesX, 115, 3, faceFeaturesX, 115, 24);
          sculptGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
          sculptGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
          sculptGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
          ctx.fillStyle = sculptGrad;
          ctx.beginPath();
          ctx.ellipse(faceFeaturesX, 115, 18, 22, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // ============================================================
        // MODE 4: PHÁC THẢO TRANH LỤA / THỦY MẶC DÂN GIAN
        // ============================================================
        else if (displayMode === 'editorial_sketch') {
          ctx.strokeStyle = 'rgba(24, 24, 27, 0.7)';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(faceFeaturesX - 18, 101);
          ctx.quadraticCurveTo(faceFeaturesX - 10, 98, faceFeaturesX - 4, 100);
          ctx.moveTo(faceFeaturesX + 4, 100);
          ctx.quadraticCurveTo(faceFeaturesX + 10, 98, faceFeaturesX + 18, 101);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(24, 24, 27, 0.85)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(faceFeaturesX - 16, 108);
          ctx.quadraticCurveTo(faceFeaturesX - 10, 105, faceFeaturesX - 4, 108);
          ctx.moveTo(faceFeaturesX + 4, 108);
          ctx.quadraticCurveTo(faceFeaturesX + 10, 105, faceFeaturesX + 16, 108);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(67, 20, 7, 0.35)';
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(faceFeaturesX, 108);
          ctx.lineTo(faceFeaturesX, 122);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(136, 19, 55, 0.6)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(faceFeaturesX - 6, 136);
          ctx.quadraticCurveTo(faceFeaturesX, 134.5, faceFeaturesX + 6, 136);
          ctx.quadraticCurveTo(faceFeaturesX, 139, faceFeaturesX - 6, 136);
          ctx.stroke();
        }
      }
    }

    // ================================================================
    // 4. HAIRSTYLES & HEADWEAR (PHỤC SỨC MÁI TÓC THUẦN VIỆT)
    // ================================================================
    if (!isGhost && !isAtelierMannequin && hairStyle !== 'hidden' && hairStyle !== 'none') {
      const hairFeaturesX = centerX + headShiftX;

      // 1. KHĂN ĐÓNG / KHĂN VẤN CỔ TRUYỀN
      if (hairStyle === 'khan_van' || hairStyle === 'khan_dong' || hairStyle === 'khan_van_silk') {
        const khanGrad = ctx.createLinearGradient(hairFeaturesX - 35, 0, hairFeaturesX + 35, 0);
        khanGrad.addColorStop(0, '#09090B');
        khanGrad.addColorStop(0.3, isMale ? '#18181B' : '#1E3A8A');
        khanGrad.addColorStop(0.7, '#18181B');
        khanGrad.addColorStop(1, '#09090B');
        ctx.fillStyle = khanGrad;

        ctx.beginPath();
        ctx.ellipse(hairFeaturesX, 68, 33, 26, 0, Math.PI, Math.PI * 2);
        ctx.fill();

        // Nếp gấp khăn vấn chữ Nhân
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)';
        ctx.lineWidth = 1.3;
        for (let coilR = 22; coilR <= 32; coilR += 2.2) {
          ctx.beginPath();
          ctx.arc(hairFeaturesX, 71, coilR, Math.PI * 1.08, Math.PI * 1.92);
          ctx.stroke();
        }

        // Nếp chữ Nhân
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(hairFeaturesX - 7, 78);
        ctx.lineTo(hairFeaturesX, 73);
        ctx.lineTo(hairFeaturesX + 7, 78);
        ctx.stroke();

        if (!isMale) {
          // Trâm ngọc bích cho nữ
          ctx.fillStyle = '#CA8A04';
          ctx.beginPath();
          ctx.arc(hairFeaturesX - 18, 66, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#059669';
          ctx.beginPath();
          ctx.arc(hairFeaturesX - 18, 66, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. BÚI TÓC TRÂM CÀI BẠC HOA SEN
      else if (hairStyle === 'bun_tram' || hairStyle === 'chignon_tram') {
        const crownGrad = ctx.createLinearGradient(hairFeaturesX - 28, 55, hairFeaturesX + 28, 95);
        crownGrad.addColorStop(0, '#27272A');
        crownGrad.addColorStop(1, '#09090B');
        ctx.fillStyle = crownGrad;
        ctx.beginPath();
        ctx.ellipse(hairFeaturesX, 76, 28, 20, 0, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(120, 113, 108, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(hairFeaturesX, 60);
        ctx.lineTo(hairFeaturesX, 82);
        ctx.stroke();

        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        ctx.arc(hairFeaturesX, 44, 18, 0, Math.PI * 2);
        ctx.fill();

        // Trâm bạc hoa sen
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(hairFeaturesX - 30, 38);
        ctx.lineTo(hairFeaturesX + 30, 50);
        ctx.stroke();

        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(hairFeaturesX - 26, 40, 4.2, 0, Math.PI * 2);
        ctx.fill();

        // Dải tua ngọc buông rủ
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hairFeaturesX - 26, 44);
        ctx.lineTo(hairFeaturesX - 28, 54);
        ctx.lineTo(hairFeaturesX - 27, 60);
        ctx.stroke();
        ctx.fillStyle = '#E11D48';
        ctx.beginPath();
        ctx.arc(hairFeaturesX - 27, 61, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. MÁI TÓC DÀI ĐEN TUYỀN SUÔN MƯỢT
      else if (hairStyle === 'long_sleek' || hairStyle === 'long_waves') {
        ctx.fillStyle = '#09090B';
        // Tà tóc trái
        ctx.beginPath();
        ctx.moveTo(hairFeaturesX - 28, 75);
        ctx.quadraticCurveTo(hairFeaturesX - 38, 140, hairFeaturesX - 28, 235);
        ctx.quadraticCurveTo(hairFeaturesX - 20, 238, hairFeaturesX - 16, 215);
        ctx.quadraticCurveTo(hairFeaturesX - 24, 135, hairFeaturesX - 20, 92);
        ctx.closePath();
        ctx.fill();

        // Tà tóc phải
        ctx.beginPath();
        ctx.moveTo(hairFeaturesX + 28, 75);
        ctx.quadraticCurveTo(hairFeaturesX + 38, 140, hairFeaturesX + 28, 235);
        ctx.quadraticCurveTo(hairFeaturesX + 20, 238, hairFeaturesX + 16, 215);
        ctx.quadraticCurveTo(hairFeaturesX + 24, 135, hairFeaturesX + 20, 92);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(hairFeaturesX, 73, 29, 23, 0, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(212, 212, 216, 0.45)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(hairFeaturesX, 66, 25, Math.PI + 0.3, -0.3);
        ctx.stroke();
      }

      // 4. NÓN BA TẦM QUAI THAO
      else if (hairStyle === 'non_la_quai_thao') {
        const nonGrad = ctx.createLinearGradient(hairFeaturesX - 52, 0, hairFeaturesX + 52, 0);
        nonGrad.addColorStop(0, '#CA8A04');
        nonGrad.addColorStop(0.5, '#FEF08A');
        nonGrad.addColorStop(1, '#92400E');
        ctx.fillStyle = nonGrad;

        ctx.beginPath();
        ctx.ellipse(hairFeaturesX, 58, 54, 18, -0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Quai thao buông rủ
        ctx.strokeStyle = '#E11D48';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(hairFeaturesX - 42, 60);
        ctx.quadraticCurveTo(hairFeaturesX - 40, 130, hairFeaturesX - 25, 180);
        ctx.stroke();
        ctx.strokeStyle = '#CA8A04';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(hairFeaturesX + 42, 60);
        ctx.quadraticCurveTo(hairFeaturesX + 40, 130, hairFeaturesX + 25, 180);
        ctx.stroke();
      }

      // 5. TÓC SÓNG HÀ THÀNH 1930s (LEMUR)
      else if (hairStyle === 'song_ha_thanh_1930') {
        ctx.fillStyle = '#09090B';
        ctx.beginPath();
        ctx.ellipse(hairFeaturesX, 73, 28, 22, 0, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(212, 212, 216, 0.4)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(hairFeaturesX - 26, 75);
        ctx.quadraticCurveTo(hairFeaturesX - 20, 80, hairFeaturesX - 24, 90);
        ctx.moveTo(hairFeaturesX + 26, 75);
        ctx.quadraticCurveTo(hairFeaturesX + 20, 80, hairFeaturesX + 24, 90);
        ctx.stroke();
      }

      // 6. TÓC CỘT BÚI CỦ TỎI NHO SĨ
      else if (hairStyle === 'toc_nam_cu_toi') {
        ctx.fillStyle = '#09090B';
        ctx.beginPath();
        ctx.ellipse(hairFeaturesX, 73, 28, 20, 0, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        ctx.ellipse(hairFeaturesX, 47, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#B91C1C';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(hairFeaturesX - 12, 53);
        ctx.lineTo(hairFeaturesX + 12, 53);
        ctx.stroke();
      }

      // 7. WOLF-CUT GIAO THOA ĐƯƠNG ĐẠI
      else if (hairStyle === 'wolf_cut' || hairStyle === 'mullet_genz') {
        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        ctx.moveTo(hairFeaturesX - 32, 95);
        ctx.quadraticCurveTo(hairFeaturesX - 42, 140, hairFeaturesX - 34, 180);
        ctx.quadraticCurveTo(hairFeaturesX - 22, 185, hairFeaturesX - 18, 160);
        ctx.lineTo(hairFeaturesX + 18, 160);
        ctx.quadraticCurveTo(hairFeaturesX + 22, 185, hairFeaturesX + 34, 180);
        ctx.quadraticCurveTo(hairFeaturesX + 42, 140, hairFeaturesX + 32, 95);
        ctx.closePath();
        ctx.fill();

        const hairGrad = ctx.createLinearGradient(hairFeaturesX - 30, 48, hairFeaturesX + 30, 95);
        hairGrad.addColorStop(0, '#27272A');
        hairGrad.addColorStop(0.5, '#18181B');
        hairGrad.addColorStop(1, '#09090B');
        ctx.fillStyle = hairGrad;

        ctx.beginPath();
        ctx.moveTo(hairFeaturesX - 30, 92);
        ctx.quadraticCurveTo(hairFeaturesX - 34, 48, hairFeaturesX, 48);
        ctx.quadraticCurveTo(hairFeaturesX + 34, 48, hairFeaturesX + 30, 92);
        ctx.quadraticCurveTo(hairFeaturesX + 18, 76, hairFeaturesX + 8, 82);
        ctx.quadraticCurveTo(hairFeaturesX, 70, hairFeaturesX - 8, 82);
        ctx.quadraticCurveTo(hairFeaturesX - 18, 76, hairFeaturesX - 30, 92);
        ctx.closePath();
        ctx.fill();
      }
    }

    // ================================================================
    // 5. INNER GARMENT LAYER (YẾM ĐÀO / ÁO LÓT CỔ XÂY / GRAPHIC TEE)
    // ================================================================
    const inCol = effectiveInnerColor;
    const innerId = innerGarment?.id || 'yem_dao_sen';
    const innerGrad = ctx.createLinearGradient(centerX - 30, 0, centerX + 30, 0);
    innerGrad.addColorStop(0, shadeColor(inCol, -20));
    innerGrad.addColorStop(0.4, inCol);
    innerGrad.addColorStop(1, shadeColor(inCol, -28));
    ctx.fillStyle = innerGrad;

    if (innerId === 'graphic_tee_y2k') {
      // Áo thun Graphic đen washed Y2K
      ctx.beginPath();
      ctx.moveTo(centerX - 24, 180);
      ctx.quadraticCurveTo(centerX, 184, centerX + 24, 180);
      ctx.lineTo(centerX + 32, 340);
      ctx.lineTo(centerX - 32, 340);
      ctx.closePath();
      ctx.fill();

      // Typo chữ Nôm cách điệu & Tháp Rùa
      ctx.fillStyle = '#FEF08A';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('VIỆT', centerX, 230);
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 1;
      ctx.strokeRect(centerX - 16, 236, 32, 18);
    } else if (innerId === 'minimal_mockneck') {
      // Áo thun cổ lọ dệt kim cao 3cm
      ctx.beginPath();
      ctx.moveTo(centerX - 16, 168);
      ctx.lineTo(centerX + 16, 168);
      ctx.lineTo(centerX + 26, 340);
      ctx.lineTo(centerX - 26, 340);
      ctx.closePath();
      ctx.fill();
      // Gân sọc dệt kim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 0.8;
      for (let rx = centerX - 12; rx <= centerX + 12; rx += 4) {
        ctx.beginPath();
        ctx.moveTo(rx, 169);
        ctx.lineTo(rx, 220);
        ctx.stroke();
      }
    } else if (innerId === 'yem_co_xay_trang') {
      // Yếm cổ xây tròn kín đáo
      ctx.beginPath();
      ctx.moveTo(centerX - 16, 172);
      ctx.quadraticCurveTo(centerX, 176, centerX + 16, 172);
      ctx.lineTo(centerX + 26, 340);
      ctx.lineTo(centerX - 26, 340);
      ctx.closePath();
      ctx.fill();
      // Viền cổ lụa
      ctx.strokeStyle = '#FAF8F5';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(centerX, 173, 15, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
    } else {
      // Yếm Đào Sen truyền thống
      ctx.beginPath();
      ctx.moveTo(centerX - 18, 186);
      ctx.quadraticCurveTo(centerX, 196, centerX + 18, 186);
      ctx.lineTo(centerX + 28, 340);
      ctx.lineTo(centerX - 28, 340);
      ctx.closePath();
      ctx.fill();

      // Dây quàng cổ yếm lụa
      ctx.strokeStyle = inCol === '#FDA4AF' ? '#E11D48' : '#FAF8F5';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(centerX - 14, 186);
      ctx.quadraticCurveTo(centerX - 10, 168, centerX, 166);
      ctx.quadraticCurveTo(centerX + 10, 168, centerX + 14, 186);
      ctx.stroke();

      // Họa tiết hoa sen thêu giữa yếm
      ctx.fillStyle = '#FB7185';
      ctx.beginPath();
      ctx.arc(centerX, 218, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // ================================================================
    // 6. BOTTOM GARMENT (QUẦN LỤA / TROUSERS PLEATED / JEANS Y2K / VÁY)
    // ================================================================
    const botCol = effectiveBottomColor;
    const botId = bottomGarment?.id || 'quan_midnight_indigo_canvas';
    const isSilkSkirt = botId === 'chan_vay_xep_ly_midi';
    const isPureSilkPants = botId === 'quan_lua_suong_trang';
    const isJeansY2K = botId === 'quan_jeans_thung_y2k';
    const isTrousersCanvas = botId === 'quan_midnight_indigo_canvas';

    const pantGrad = ctx.createLinearGradient(centerX - hipHalfWidth, 0, centerX + hipHalfWidth, 0);
    pantGrad.addColorStop(0, shadeColor(botCol, -25));
    pantGrad.addColorStop(0.2, botCol);
    pantGrad.addColorStop(0.5, shadeColor(botCol, 12));
    pantGrad.addColorStop(0.8, botCol);
    pantGrad.addColorStop(1, shadeColor(botCol, -30));
    ctx.fillStyle = pantGrad;

    if (isSilkSkirt) {
      // Chân váy xếp ly dáng dài xòe rộng
      ctx.beginPath();
      ctx.moveTo(centerX - waistHalfWidth, 310);
      ctx.lineTo(centerX - 52, 642);
      ctx.quadraticCurveTo(centerX, 650, centerX + 52, 642);
      ctx.lineTo(centerX + waistHalfWidth, 310);
      ctx.closePath();
      ctx.fill();

      // Nếp xếp ly dập nhỏ
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 0.9;
      for (let pleatX = centerX - 46; pleatX <= centerX + 46; pleatX += 6) {
        ctx.beginPath();
        ctx.moveTo(pleatX * 0.7 + centerX * 0.3, 315);
        ctx.lineTo(pleatX, 640);
        ctx.stroke();
      }
    } else {
      // Dáng quần ống suông / thụng
      const legWidth = isJeansY2K ? 36 : isTrousersCanvas ? 34 : isPureSilkPants ? 32 : 28;
      ctx.beginPath();
      ctx.moveTo(centerX - hipHalfWidth, 340);
      ctx.lineTo(centerX - legWidth - 6, 440);
      ctx.lineTo(centerX - legWidth, 642);
      ctx.lineTo(centerX - 8, 645);
      ctx.lineTo(centerX - 3, 455);
      ctx.lineTo(centerX, 450);
      ctx.lineTo(centerX + 3, 455);
      ctx.lineTo(centerX + 8, 645);
      ctx.lineTo(centerX + legWidth, 642);
      ctx.lineTo(centerX + legWidth + 6, 440);
      ctx.lineTo(centerX + hipHalfWidth, 340);
      ctx.closePath();
      ctx.fill();

      if (isJeansY2K) {
        // Chi tiết Quần Jeans Y2K: Wash bạc & Rách gối phong cách
        const washGrad = ctx.createRadialGradient(centerX - 20, 510, 4, centerX - 20, 510, 24);
        washGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        washGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = washGrad;
        ctx.beginPath();
        ctx.arc(centerX - 20, 510, 24, 0, Math.PI * 2);
        ctx.fill();

        // Mảng rách gối bụi bặm
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(centerX - 28, 515);
        ctx.lineTo(centerX - 12, 515);
        ctx.moveTo(centerX - 26, 520);
        ctx.lineTo(centerX - 14, 520);
        ctx.stroke();

        // Đường chỉ vàng may quần denim
        ctx.strokeStyle = '#CA8A04';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - legWidth - 2, 440);
        ctx.lineTo(centerX - legWidth + 2, 640);
        ctx.moveTo(centerX + legWidth + 2, 440);
        ctx.lineTo(centerX + legWidth - 2, 640);
        ctx.stroke();
      } else if (isTrousersCanvas) {
        // Trousers Midnight-Indigo: Nếp gấp ly kiến trúc sắc nét
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(centerX - 20, 360);
        ctx.lineTo(centerX - 20, 640);
        ctx.moveTo(centerX + 20, 360);
        ctx.lineTo(centerX + 20, 640);
        ctx.stroke();
      } else if (isPureSilkPants) {
        // Nếp rủ sóng vải lụa tơ tằm thướt tha
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(centerX - 18, 380);
        ctx.lineTo(centerX - 18, 638);
        ctx.moveTo(centerX + 18, 380);
        ctx.lineTo(centerX + 18, 638);
        ctx.stroke();
      }
    }

    // ================================================================
    // 7. FOOTWEAR (HÀI THÊU / SNEAKERS / LOAFERS / BOOTS)
    // ================================================================
    const shoesId = shoes?.id || 'retro_chunky_sneakers';

    const drawDetailedShoe = (shoeX: number, isRight: boolean) => {
      const shoeY = 642;
      const shoeFlip = isRight ? 1 : -1;

      if (shoesId === 'hai_theu_hoa_sen') {
        // Hài gấm nhung cổ phong mũi cong vểnh hình hoa sen
        const haiGrad = ctx.createLinearGradient(shoeX - 12, 0, shoeX + 12, 0);
        haiGrad.addColorStop(0, '#7F1D1D');
        haiGrad.addColorStop(0.5, '#B91C1C');
        haiGrad.addColorStop(1, '#991B1B');
        ctx.fillStyle = haiGrad;

        ctx.beginPath();
        ctx.moveTo(shoeX - 10, shoeY + 18);
        ctx.lineTo(shoeX - 10, shoeY + 6);
        ctx.quadraticCurveTo(shoeX + shoeFlip * 8, shoeY + 2, shoeX + shoeFlip * 13, shoeY + 8);
        ctx.quadraticCurveTo(shoeX + shoeFlip * 16, shoeY + 12, shoeX + shoeFlip * 14, shoeY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(shoeX - 10, shoeY + 18);
        ctx.lineTo(shoeX + shoeFlip * 14, shoeY + 18);
        ctx.stroke();

        ctx.strokeStyle = '#FEF08A';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(shoeX + shoeFlip * 4, shoeY + 10, 3, 0, Math.PI * 2);
        ctx.stroke();
      } else if (shoesId === 'loafer_da_bong_chunky') {
        // Loafers da bóng sang trọng
        ctx.fillStyle = '#09090B';
        ctx.beginPath();
        ctx.roundRect(shoeX - 14, shoeY + 16, 28, 12, [2, 2, 4, 4]);
        ctx.fill();

        const glossGrad = ctx.createLinearGradient(shoeX - 12, 0, shoeX + 12, 0);
        glossGrad.addColorStop(0, '#18181B');
        glossGrad.addColorStop(0.5, '#3F3F46');
        glossGrad.addColorStop(1, '#09090B');
        ctx.fillStyle = glossGrad;
        ctx.beginPath();
        ctx.roundRect(shoeX - 12, shoeY + 2, 24, 16, [4, 4, 2, 2]);
        ctx.fill();

        // Khóa mạ đồng thau cổ
        ctx.fillStyle = '#CA8A04';
        ctx.fillRect(shoeX - 6, shoeY + 8, 12, 3);
      } else if (shoesId === 'boots_da_co_thap') {
        // Ankle boots da đen cao cổ
        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        ctx.roundRect(shoeX - 12, shoeY - 6, 24, 26, [3, 3, 2, 2]);
        ctx.fill();

        // Khóa kéo kim loại
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(shoeX + shoeFlip * 8, shoeY - 4);
        ctx.lineTo(shoeX + shoeFlip * 8, shoeY + 14);
        ctx.stroke();

        ctx.fillStyle = '#09090B';
        ctx.fillRect(shoeX - 13, shoeY + 16, 26, 8);
      } else {
        // Sneakers Retro Chunky Trắng
        const soleGrad = ctx.createLinearGradient(0, shoeY + 16, 0, shoeY + 28);
        soleGrad.addColorStop(0, '#D97706');
        soleGrad.addColorStop(1, '#78350F');
        ctx.fillStyle = soleGrad;
        ctx.beginPath();
        ctx.roundRect(shoeX - 15, shoeY + 16, 30, 12, [3, 3, 5, 5]);
        ctx.fill();

        const upperGrad = ctx.createLinearGradient(shoeX - 13, 0, shoeX + 13, 0);
        upperGrad.addColorStop(0, '#E7E5E4');
        upperGrad.addColorStop(0.5, '#FAF8F5');
        upperGrad.addColorStop(1, '#D6D3D1');
        ctx.fillStyle = upperGrad;
        ctx.beginPath();
        ctx.moveTo(shoeX - 13, shoeY + 16);
        ctx.lineTo(shoeX - 12, shoeY + 2);
        ctx.quadraticCurveTo(shoeX, shoeY - 2, shoeX + 12, shoeY + 2);
        ctx.lineTo(shoeX + 13, shoeY + 16);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#CA8A04';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(shoeX, shoeY + 14, 8, Math.PI, Math.PI * 2);
        ctx.stroke();
      }
    };

    drawDetailedShoe(centerX - 19, false);
    drawDetailedShoe(centerX + 19, true);

    // ================================================================
    // 8. MAIN GARMENTS RENDERING (TẤT CẢ TRANG PHỤC TRUYỀN THỐNG VIỆT NAM)
    // ================================================================
    const mCol = effectiveMainColor;

    const robeGrad = ctx.createLinearGradient(centerX - 65, 0, centerX + 65, 0);
    robeGrad.addColorStop(0, shadeColor(mCol, -28));
    robeGrad.addColorStop(0.2, shadeColor(mCol, -8));
    robeGrad.addColorStop(0.5, shadeColor(mCol, 14));
    robeGrad.addColorStop(0.8, mCol);
    robeGrad.addColorStop(1, shadeColor(mCol, -32));
    ctx.fillStyle = robeGrad;

    // KIỂM TRA MỞ TÀ: isOpenOuterwear
    if (isOpenOuterwear) {
      // --------------------------------------------------------------
      // PHONG CÁCH KHOÁC MỞ TÀ (OUTERWEAR JACKET / DUSTER DRAPE)
      // Mở rộng vạt áo sang hai bên hông, khoe trọn vẹn lớp lót áo bên trong
      // --------------------------------------------------------------
      // Vạt áo bên trái
      ctx.beginPath();
      ctx.moveTo(centerX - neckHalfWidth, 174);
      ctx.quadraticCurveTo(centerX - shoulderHalfWidth + 4, 185, centerX - shoulderHalfWidth - 4, 203);
      ctx.quadraticCurveTo(centerX - shoulderHalfWidth - 14, 300, centerX - 42, 485);
      ctx.lineTo(centerX - 18, 485);
      ctx.quadraticCurveTo(centerX - 24, 320, centerX - 12, 205);
      ctx.lineTo(centerX - neckHalfWidth, 174);
      ctx.closePath();
      ctx.fill();

      // Vạt áo bên phải
      ctx.beginPath();
      ctx.moveTo(centerX + neckHalfWidth, 174);
      ctx.quadraticCurveTo(centerX + shoulderHalfWidth - 4, 185, centerX + shoulderHalfWidth + 4, 203);
      ctx.quadraticCurveTo(centerX + shoulderHalfWidth + 14, 300, centerX + 42, 485);
      ctx.lineTo(centerX + 18, 485);
      ctx.quadraticCurveTo(centerX + 24, 320, centerX + 12, 205);
      ctx.lineTo(centerX + neckHalfWidth, 174);
      ctx.closePath();
      ctx.fill();

      // Viền mép lót trong của vạt mở
      ctx.strokeStyle = '#FAF8F5';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(centerX - 12, 205);
      ctx.lineTo(centerX - 18, 485);
      ctx.moveTo(centerX + 12, 205);
      ctx.lineTo(centerX + 18, 485);
      ctx.stroke();

      // Nếu là Áo Nhật Bình mở tà: nẹp chữ nhật viền ở hai vạt mở
      if (isNhatBinh) {
        ctx.fillStyle = '#D97706';
        ctx.fillRect(centerX - 22, 200, 8, 280);
        ctx.fillRect(centerX + 14, 200, 8, 280);
        ctx.strokeStyle = '#FEF08A';
        ctx.lineWidth = 1;
        ctx.strokeRect(centerX - 22, 200, 8, 280);
        ctx.strokeRect(centerX + 14, 200, 8, 280);
      }
    } else {
      // --------------------------------------------------------------
      // PHONG CÁCH CÀI CÚC KÍN ĐÁO CHUẨN MỰC
      // --------------------------------------------------------------
      ctx.beginPath();
      ctx.moveTo(centerX - shoulderHalfWidth - 4, 203);
      ctx.quadraticCurveTo(centerX - shoulderHalfWidth, 260, centerX - 42, 330);
      ctx.quadraticCurveTo(centerX - 46, 400, centerX - 50, 485);
      ctx.quadraticCurveTo(centerX, 498, centerX + 50, 485);
      ctx.quadraticCurveTo(centerX + 46, 400, centerX + 42, 330);
      ctx.quadraticCurveTo(centerX + shoulderHalfWidth, 260, centerX + shoulderHalfWidth + 4, 203);
      ctx.quadraticCurveTo(centerX + neckHalfWidth + 10, 178, centerX + neckHalfWidth, 174);
      ctx.lineTo(centerX - neckHalfWidth, 174);
      ctx.quadraticCurveTo(centerX - neckHalfWidth - 10, 178, centerX - shoulderHalfWidth - 4, 203);
      ctx.closePath();
      ctx.fill();
    }

    // High-resolution Silk Micro-Slub Weave (Đũi tơ tằm thô)
    ctx.save();
    ctx.strokeStyle = rgbaStr('#FFFFFF', 0.08);
    ctx.lineWidth = 0.6;
    for (let slubY = 220; slubY <= 480; slubY += 14) {
      ctx.beginPath();
      ctx.moveTo(centerX - 42, slubY);
      ctx.lineTo(centerX + 42, slubY);
      ctx.stroke();
    }
    ctx.restore();

    // ================================================================
    // 8A. SLEEVES RENDERING (TAY THỤNG ĐẠI LỄ vs TAY CHẼN GỌN GÀNG)
    // ================================================================
    if (isTayThung || isNhatBinh) {
      // ỐNG TAY THỤNG BUÔNG RỦ BỀ THẾ
      ctx.fillStyle = robeGrad;
      ctx.beginPath();
      ctx.moveTo(centerX - shoulderHalfWidth - 4, 203);
      ctx.quadraticCurveTo(centerX - shoulderHalfWidth - 36, 280, centerX - shoulderHalfWidth - 32, 385);
      ctx.lineTo(centerX - 38, 385);
      ctx.quadraticCurveTo(centerX - 42, 310, centerX - shoulderHalfWidth + 12, 218);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centerX + shoulderHalfWidth + 4, 203);
      ctx.quadraticCurveTo(centerX + shoulderHalfWidth + 36, 280, centerX + shoulderHalfWidth + 32, 385);
      ctx.lineTo(centerX + 38, 385);
      ctx.quadraticCurveTo(centerX + 42, 310, centerX + shoulderHalfWidth - 12, 218);
      ctx.closePath();
      ctx.fill();

      if (isNhatBinh) {
        // DẢI NGŨ SẮC NGŨ HÀNH CỔ TAY ÁO NHẬT BÌNH
        const drawNguSacBands = (x1: number, x2: number, y: number) => {
          const colors = ['#1E3A8A', '#EAB308', '#B91C1C', '#FAF8F5', '#15803D'];
          colors.forEach((col, idx) => {
            ctx.fillStyle = col;
            ctx.fillRect(Math.min(x1, x2), y - (5 - idx) * 4.5, Math.abs(x2 - x1), 4);
          });
        };
        drawNguSacBands(centerX - shoulderHalfWidth - 32, centerX - 38, 385);
        drawNguSacBands(centerX + shoulderHalfWidth + 32, centerX + 38, 385);
      } else {
        // Gấu tay thụng lót lụa tơ tằm trắng ngà
        ctx.strokeStyle = '#FAF8F5';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(centerX - shoulderHalfWidth - 32, 385);
        ctx.lineTo(centerX - 38, 385);
        ctx.moveTo(centerX + shoulderHalfWidth + 32, 385);
        ctx.lineTo(centerX + 38, 385);
        ctx.stroke();
      }
    } else {
      // ỐNG TAY CHẼN GỌN GÀNG
      ctx.fillStyle = robeGrad;
      ctx.beginPath();
      ctx.moveTo(centerX - shoulderHalfWidth - 4, 203);
      ctx.quadraticCurveTo(centerX - shoulderHalfWidth - 16, 275, centerX - shoulderHalfWidth - 10, 340);
      ctx.lineTo(centerX - 42, 365);
      ctx.quadraticCurveTo(centerX - 44, 305, centerX - shoulderHalfWidth + 12, 218);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centerX + shoulderHalfWidth + 4, 203);
      ctx.quadraticCurveTo(centerX + shoulderHalfWidth + 16, 275, centerX + shoulderHalfWidth + 10, 340);
      ctx.lineTo(centerX + 42, 365);
      ctx.quadraticCurveTo(centerX + 44, 305, centerX + shoulderHalfWidth - 12, 218);
      ctx.closePath();
      ctx.fill();

      // Gấu tay lót lụa tơ tằm
      ctx.strokeStyle = '#FAF8F5';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(centerX - shoulderHalfWidth - 10, 340);
      ctx.lineTo(centerX - 42, 365);
      ctx.moveTo(centerX + shoulderHalfWidth + 10, 340);
      ctx.lineTo(centerX + 42, 365);
      ctx.stroke();
    }

    // ================================================================
    // 8A-1. REALISTIC HANDS & WRISTS (BÀN TAY BÚP MĂNG & VÒNG NGỌC PHỈ THÚY)
    // ================================================================
    if (!isGhost && !isAtelierMannequin && !isBack) {
      const drawRealisticHand = (handX: number, handY: number, isRight: boolean) => {
        const handDir = isRight ? 1 : -1;
        const handGrad = ctx.createLinearGradient(handX - 6, 0, handX + 6, 0);
        handGrad.addColorStop(0, shadeColor(effectiveSkinTone, -12));
        handGrad.addColorStop(0.4, effectiveSkinTone);
        handGrad.addColorStop(1, shadeColor(effectiveSkinTone, -18));
        ctx.fillStyle = handGrad;

        // Cổ tay
        ctx.beginPath();
        ctx.roundRect(handX - 5, handY - 10, 10, 14, 3);
        ctx.fill();

        // Bàn tay & Ngón tay thon thả búp măng
        ctx.beginPath();
        ctx.moveTo(handX - 4, handY + 2);
        ctx.lineTo(handX - handDir * 2, handY + 16);
        ctx.quadraticCurveTo(handX, handY + 18, handX + handDir * 3, handY + 16);
        ctx.lineTo(handX + 4, handY + 2);
        ctx.closePath();
        ctx.fill();

        // Kẽ ngón tay tự nhiên
        ctx.strokeStyle = rgbaStr('#78350F', 0.22);
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(handX - 1.5, handY + 6);
        ctx.lineTo(handX - 1.5, handY + 14);
        ctx.moveTo(handX + 1, handY + 6);
        ctx.lineTo(handX + 1, handY + 14);
        ctx.stroke();

        // Móng tay hồng hào tự nhiên
        ctx.fillStyle = 'rgba(251, 113, 133, 0.45)';
        ctx.beginPath();
        ctx.arc(handX - 1.5, handY + 14.5, 0.9, 0, Math.PI * 2);
        ctx.arc(handX + 1, handY + 14.5, 0.9, 0, Math.PI * 2);
        ctx.fill();

        // Vòng ngọc bích Phỉ Thúy (Jade Bangle) bên cổ tay nữ
        if (!isRight && !isMale) {
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.ellipse(handX, handY - 4, 7, 3.5, 0.2, 0, Math.PI * 2);
          ctx.stroke();
          // Ánh ngọc bắt sáng
          ctx.strokeStyle = '#A7F3D0';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(handX - 2, handY - 5, 3, Math.PI * 1.1, Math.PI * 1.6);
          ctx.stroke();
        } else if (isRight && isMale) {
          // Nam: Nhẫn đồng bản vuông phong nhã
          ctx.strokeStyle = '#D97706';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.ellipse(handX, handY + 6, 3, 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      };

      const handLeftX = isTayThung || isNhatBinh ? centerX - 38 : centerX - 36;
      const handRightX = isTayThung || isNhatBinh ? centerX + 38 : centerX + 36;
      const handY = isTayThung || isNhatBinh ? 392 : 370;
      drawRealisticHand(handLeftX, handY, false);
      drawRealisticHand(handRightX, handY, true);
    }

    // ================================================================
    // 8B. FRONT TAILORING DETAILS (KHI CÀI CÚC / CHI TIẾT TRANG PHỤC)
    // ================================================================
    if (isBack) {
      // SỐNG ÁO LƯNG LIỀN
      ctx.strokeStyle = rgbaStr(shadeColor(mCol, -42), 0.7);
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(centerX, 174);
      ctx.lineTo(centerX, 492);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2.5, 2.5]);
      ctx.beginPath();
      ctx.moveTo(centerX + 0.8, 176);
      ctx.lineTo(centerX + 0.8, 490);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (!isOpenOuterwear) {
      if (isNhatBinh) {
        // ÁO NHẬT BÌNH: NẸP CHỮ NHẬT NGŨ HÀNH ĐỐI KHÂM
        const bandGrad = ctx.createLinearGradient(centerX - 18, 0, centerX + 18, 0);
        bandGrad.addColorStop(0, '#78350F');
        bandGrad.addColorStop(0.5, '#D97706');
        bandGrad.addColorStop(1, '#78350F');
        ctx.fillStyle = bandGrad;

        ctx.fillRect(centerX - 15, 170, 30, 140);
        ctx.strokeStyle = '#FEF08A';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(centerX - 15, 170, 30, 140);

        // Hoa văn cúc kim tuyến
        ctx.strokeStyle = '#FEF08A';
        ctx.lineWidth = 0.9;
        for (let patY = 185; patY <= 300; patY += 18) {
          ctx.beginPath();
          ctx.arc(centerX, patY, 5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Khuy ngọc bích tâm nẹp áo
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(centerX, 215, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FEF08A';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0,0,0,0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX, 310);
        ctx.lineTo(centerX, 490);
        ctx.stroke();
      } else if (isTuThan) {
        // ÁO TỨ THÂN & THẮT LƯNG ĐIỀU
        ctx.strokeStyle = rgbaStr(shadeColor(mCol, -40), 0.8);
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(centerX - 18, 175);
        ctx.lineTo(centerX - 16, 230);
        ctx.lineTo(centerX - 24, 486);
        ctx.moveTo(centerX + 18, 175);
        ctx.lineTo(centerX + 16, 230);
        ctx.lineTo(centerX + 24, 486);
        ctx.stroke();

        // Thắt lưng lụa màu điều
        const dieuGrad = ctx.createLinearGradient(centerX - 26, 0, centerX + 26, 0);
        dieuGrad.addColorStop(0, '#9F1239');
        dieuGrad.addColorStop(0.5, '#E11D48');
        dieuGrad.addColorStop(1, '#BE123C');
        ctx.fillStyle = dieuGrad;

        ctx.beginPath();
        ctx.roundRect(centerX - 25, 298, 50, 14, 3);
        ctx.fill();

        ctx.fillStyle = '#E11D48';
        ctx.beginPath();
        ctx.arc(centerX, 305, 5, 0, Math.PI * 2);
        ctx.fill();

        // 2 dải lụa bay buông xuống
        ctx.beginPath();
        ctx.moveTo(centerX - 3, 308);
        ctx.quadraticCurveTo(centerX - 10, 380, centerX - 6, 450);
        ctx.lineTo(centerX - 1, 450);
        ctx.quadraticCurveTo(centerX - 5, 380, centerX + 1, 308);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(centerX + 2, 308);
        ctx.quadraticCurveTo(centerX + 10, 380, centerX + 7, 445);
        ctx.lineTo(centerX + 12, 445);
        ctx.quadraticCurveTo(centerX + 15, 380, centerX + 6, 308);
        ctx.closePath();
        ctx.fill();
      } else if (isGiaoLinh) {
        // ÁO GIAO LĨNH: Cổ chéo chữ Y
        ctx.strokeStyle = '#FAF8F5';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(centerX - 16, 172);
        ctx.lineTo(centerX + 24, 250);
        ctx.stroke();

        ctx.strokeStyle = rgbaStr(shadeColor(mCol, -42), 0.85);
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(centerX - 15, 174);
        ctx.lineTo(centerX + 26, 252);
        ctx.lineTo(centerX + 22, 486);
        ctx.stroke();

        ctx.fillStyle = shadeColor(mCol, -20);
        ctx.fillRect(centerX - 26, 302, 52, 12);
        ctx.strokeStyle = '#CA8A04';
        ctx.lineWidth = 1;
        ctx.strokeRect(centerX - 26, 302, 52, 12);
      } else if (isLemur || isCoThuyen) {
        if (isLemur) {
          // Áo Lemur: Cổ cánh sen viền ren Pháp 1934
          ctx.fillStyle = '#FAF8F5';
          ctx.beginPath();
          ctx.ellipse(centerX - 10, 176, 11, 7, -0.2, 0, Math.PI * 2);
          ctx.ellipse(centerX + 10, 176, 11, 7, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#E5E5E5';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else {
          // Áo Cổ thuyền khoét ngang
          ctx.strokeStyle = '#FAF8F5';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(centerX - 20, 176);
          ctx.quadraticCurveTo(centerX, 185, centerX + 20, 176);
          ctx.stroke();
        }

        ctx.strokeStyle = rgbaStr(shadeColor(mCol, -38), 0.65);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(centerX, 310);
        ctx.lineTo(centerX, 486);
        ctx.stroke();
      } else {
        // ÁO NGŨ THÂN: Cổ Lập Lĩnh & 5 Hạt Cúc Ngũ Thường
        const collarGrad = ctx.createLinearGradient(centerX - 16, 0, centerX + 16, 0);
        collarGrad.addColorStop(0, shadeColor(mCol, -20));
        collarGrad.addColorStop(0.5, shadeColor(mCol, 12));
        collarGrad.addColorStop(1, shadeColor(mCol, -25));
        ctx.fillStyle = collarGrad;

        ctx.beginPath();
        ctx.moveTo(centerX - 16, 174);
        ctx.lineTo(centerX - 15, 156);
        ctx.quadraticCurveTo(centerX, 159, centerX + 15, 156);
        ctx.lineTo(centerX + 16, 174);
        ctx.quadraticCurveTo(centerX, 179, centerX - 16, 174);
        ctx.closePath();
        ctx.fill();

        // Viền lót tơ tằm cổ
        ctx.strokeStyle = '#FAF8F5';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(centerX - 14, 158);
        ctx.quadraticCurveTo(centerX, 161, centerX + 14, 158);
        ctx.stroke();

        // Vạt Hữu Nhậm / Tả Nhậm
        const isRightLapel = lapelDirection === 'right';
        ctx.strokeStyle = rgbaStr(shadeColor(mCol, -42), 0.85);
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (isRightLapel) {
          ctx.moveTo(centerX, 175);
          ctx.quadraticCurveTo(centerX + 18, 205, centerX + 34, 255);
          ctx.lineTo(centerX + 32, 486);
        } else {
          ctx.moveTo(centerX, 175);
          ctx.quadraticCurveTo(centerX - 18, 205, centerX - 34, 255);
          ctx.lineTo(centerX - 32, 486);
        }
        ctx.stroke();

        // 5 Hạt Cúc Ngũ Thường
        const buttonPositions = isRightLapel
          ? [
              { x: centerX, y: 166 },
              { x: centerX + 9, y: 185 },
              { x: centerX + 20, y: 212 },
              { x: centerX + 28, y: 242 },
              { x: centerX + 31, y: 282 }
            ]
          : [
              { x: centerX, y: 166 },
              { x: centerX - 9, y: 185 },
              { x: centerX - 20, y: 212 },
              { x: centerX - 28, y: 242 },
              { x: centerX - 31, y: 282 }
            ];

        buttonPositions.forEach((pos) => {
          ctx.fillStyle = 'rgba(15, 12, 10, 0.45)';
          ctx.beginPath();
          ctx.arc(pos.x + 1.2, pos.y + 1.2, 3.2, 0, Math.PI * 2);
          ctx.fill();

          const btnGrad = ctx.createRadialGradient(pos.x - 0.8, pos.y - 0.8, 0.5, pos.x, pos.y, 3);
          btnGrad.addColorStop(0, '#FEF08A');
          btnGrad.addColorStop(0.3, '#CA8A04');
          btnGrad.addColorStop(0.8, '#854D0E');
          btnGrad.addColorStop(1, '#3B1E08');
          ctx.fillStyle = btnGrad;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(pos.x - 0.9, pos.y - 0.9, 0.75, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    // ================================================================
    // 9. ACCESSORIES (QUẠT NAN / NÓN / TÚI THỔ CẨM / KÍNH RÂM / KHĂN)
    // ================================================================
    const accId = accessory?.id || '';

    if (accId === 'kinh_mat_oval_y2k') {
      // Kính Râm Oval Cyber Retro trên sống mũi
      const glassY = 111;
      ctx.strokeStyle = '#D4D4D8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(centerX - 15, glassY);
      ctx.lineTo(centerX + 15, glassY);
      ctx.stroke();

      ctx.fillStyle = '#18181B';
      ctx.beginPath();
      ctx.ellipse(centerX - 9, glassY, 7, 4.5, 0, 0, Math.PI * 2);
      ctx.ellipse(centerX + 9, glassY, 7, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#CA8A04';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Glint
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 12, glassY + 1);
      ctx.lineTo(centerX - 8, glassY - 2);
      ctx.moveTo(centerX + 6, glassY + 1);
      ctx.lineTo(centerX + 10, glassY - 2);
      ctx.stroke();
    } else if (accId === 'non_quai_thao') {
      // Nón Quai Thao / Nón Ba Tầm
      const nonX = centerX - 42;
      const nonY = 320;
      const nonGrad = ctx.createLinearGradient(nonX - 25, 0, nonX + 25, 0);
      nonGrad.addColorStop(0, '#CA8A04');
      nonGrad.addColorStop(0.5, '#FEF08A');
      nonGrad.addColorStop(1, '#92400E');
      ctx.fillStyle = nonGrad;

      ctx.beginPath();
      ctx.ellipse(nonX, nonY, 28, 12, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Dải quai thao
      ctx.strokeStyle = '#E11D48';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(nonX - 10, nonY + 8);
      ctx.lineTo(nonX - 6, nonY + 60);
      ctx.stroke();
    } else if (accId === 'quat_chang_son' || accId === 'acc_fan_bamboo') {
      // Quạt Nan Tre Bồi Điệp Xứ Đoài
      const fanX = centerX + 44;
      const fanY = 385;
      const fanGrad = ctx.createRadialGradient(fanX, fanY, 2, fanX, fanY, 28);
      fanGrad.addColorStop(0, '#FAF8F5');
      fanGrad.addColorStop(0.7, '#FDE68A');
      fanGrad.addColorStop(1, '#D97706');
      ctx.fillStyle = fanGrad;

      ctx.beginPath();
      ctx.moveTo(fanX, fanY);
      ctx.arc(fanX, fanY, 26, -Math.PI * 0.8, -Math.PI * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      ctx.arc(fanX - 6, fanY - 14, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (accId === 'tui_tho_cam_hmong') {
      // Túi Thổ Cẩm H'Mông
      const bagX = centerX - 36;
      const bagY = 360;
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX + 24, 195);
      ctx.lineTo(bagX + 12, bagY);
      ctx.stroke();

      ctx.fillStyle = '#0369A1';
      ctx.fillRect(bagX, bagY, 26, 28);
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 1;
      ctx.strokeRect(bagX, bagY, 26, 28);

      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      ctx.moveTo(bagX + 13, bagY + 4);
      ctx.lineTo(bagX + 22, bagY + 14);
      ctx.lineTo(bagX + 13, bagY + 24);
      ctx.lineTo(bagX + 4, bagY + 14);
      ctx.closePath();
      ctx.fill();
    } else if (accId === 'tui_crossbody_harness' || accId === 'acc_leather_harness') {
      // Crossbody Leather Harness
      ctx.strokeStyle = '#18181B';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX - shoulderHalfWidth + 8, 203);
      ctx.lineTo(centerX + 34, 345);
      ctx.stroke();

      const pouchGrad = ctx.createLinearGradient(centerX + 26, 335, centerX + 50, 365);
      pouchGrad.addColorStop(0, '#27272A');
      pouchGrad.addColorStop(1, '#09090B');
      ctx.fillStyle = pouchGrad;
      ctx.beginPath();
      ctx.roundRect(centerX + 26, 335, 24, 28, 4);
      ctx.fill();
      ctx.fillStyle = '#CA8A04';
      ctx.fillRect(centerX + 35, 342, 6, 8);
    }
  }, [
    gender,
    skinTone,
    turntableAngle,
    graphicsPass,
    lightingMode,
    showWireframeLines,
    mainGarment,
    innerGarment,
    bottomGarment,
    shoes,
    accessory,
    mainColor,
    innerColor,
    bottomColor,
    hairStyle,
    lapelDirection,
    displayMode,
    isOpenOuterwear
  ]);

  // Perspective calculation for interactive overlays
  const rad = (turntableAngle * Math.PI) / 180;
  const turnSide = Math.sin(rad);
  const facing = Math.cos(rad);
  const isBack = facing < 0;
  const perspectiveShiftX = turnSide * 16;

  const isNhatBinh = mainGarment?.id === 'nhat_binh' || mainGarment?.subType === 'nhat_binh';
  const isTuThan = mainGarment?.id === 'tu_than' || mainGarment?.subType === 'tu_than';

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      {/* 2D/3D Canvas Rendering Engine */}
      <canvas
        ref={canvasRef}
        width={500}
        height={750}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        suppressHydrationWarning
      />

      {/* Interactive Vector Overlay for Hotspots, Exploded Orbit & Blueprints */}
      <svg
        viewBox="0 0 500 750"
        className="relative w-full h-full pointer-events-auto overflow-visible z-10"
        suppressHydrationWarning
      >
        <defs>
          <filter id="overlay-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1.5" dy="2.5" stdDeviation="2.5" floodColor="#0C0A09" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Dynamic Transformed Interactive Components Group */}
        <g transform={`translate(${perspectiveShiftX}, 0)`}>
          {/* STRUCTURAL PASS: ANTHROPOMETRIC ANATOMY GRID (7.5 HEADS) */}
          {graphicsPass === 'anatomy_grid' && (
            <g id="pass-anatomy-grid-overlay" className="pointer-events-none">
              <line x1="250" y1="52" x2="250" y2="685" stroke="#E11D48" strokeWidth="1.2" strokeDasharray="4,4" />

              {[
                { y: 62, label: 'Đỉnh Đầu' },
                { y: 152, label: '1. Cằm (Chin)' },
                { y: 220, label: '2. Ngực (Chest)' },
                { y: 310, label: '3. Eo (Waist)' },
                { y: 395, label: '4. Đáy Quần' },
                { y: 496, label: '5. Khớp Gối' },
                { y: 595, label: '6. Cẳng Chân' },
                { y: 672, label: '7.5 Gót Chân' }
              ].map((guide, idx) => (
                <g key={idx}>
                  <line x1="120" y1={guide.y} x2="380" y2={guide.y} stroke="#CA8A04" strokeWidth="0.8" strokeDasharray="2,3" opacity="0.85" />
                  <rect x="75" y={guide.y - 7} width="72" height="14" rx="3" fill="#1C1917" opacity="0.85" />
                  <text x="111" y={guide.y + 3} fill="#FEF08A" fontSize="7" fontFamily="monospace" textAnchor="middle">
                    {guide.label}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* STRUCTURAL PASS: SEAM BLUEPRINT */}
          {graphicsPass === 'seam_blueprint' && (
            <g id="pass-seam-blueprint-overlay" className="pointer-events-none">
              {!isBack ? (
                <>
                  <g transform="translate(295, 166)">
                    <line x1="0" y1="0" x2="52" y2="-20" stroke="#0284C7" strokeWidth="1.2" />
                    <circle cx="52" cy="-20" r="2" fill="#0284C7" />
                    <text x="58" y="-18" fontSize="8" fill="#0284C7" fontFamily="monospace" fontWeight="bold">
                      {isNhatBinh ? 'NẸP CHỮ NHẬT' : isTuThan ? 'CỔ CHỮ V KHOE YẾM' : 'LẬP LĨNH (H: 3.2cm)'}
                    </text>
                  </g>
                  <g transform="translate(298, 235)">
                    <line x1="0" y1="0" x2="55" y2="0" stroke="#0284C7" strokeWidth="1.2" />
                    <circle cx="55" cy="0" r="2" fill="#0284C7" />
                    <text x="62" y="3" fontSize="8" fill="#0284C7" fontFamily="monospace" fontWeight="bold">
                      {isNhatBinh ? 'KHUY NGỌC BÍCH' : isTuThan ? 'THẮT LƯNG ĐIỀU' : 'HỮU NHẬM (∠ 45°)'}
                    </text>
                  </g>
                </>
              ) : (
                <g transform="translate(250, 260)">
                  <line x1="0" y1="0" x2="75" y2="-10" stroke="#0284C7" strokeWidth="1.2" />
                  <circle cx="75" cy="-10" r="2" fill="#0284C7" />
                  <text x="80" y="-8" fontSize="8" fill="#0284C7" fontFamily="monospace" fontWeight="bold">
                    SỐNG ÁO LƯNG LIỀN
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Wireframe Pass */}
          {showWireframeLines && (
            <g id="pass-wireframe-overlay" opacity="0.45" stroke="#38BDF8" strokeWidth="0.8" fill="none">
              <path d="M196 205 L234 168 L250 154 L266 168 L304 205 L296 290 L278 395 L265 610 L274 658" />
              <path d="M250 62 L250 672" />
            </g>
          )}

          {/* Interactive Cultural Hotspots */}
          {showHotspots && (
            <g id="interactive-hotspots-group" className="cursor-pointer">
              {!isBack ? (
                <>
                  {/* Hotspot 1: Collar / Nẹp Cổ */}
                  <g
                    transform="translate(250, 166)"
                    onClick={() => onSelectHotspot('lap_linh_collar')}
                    className="hover:scale-125 transition-transform"
                  >
                    <circle cx="0" cy="0" r="9" fill="#B91C1C" stroke="#FFFFFF" strokeWidth="2" className="animate-ping opacity-75" />
                    <circle cx="0" cy="0" r="9" fill="#B91C1C" stroke="#FFFFFF" strokeWidth="2" filter="url(#overlay-shadow)" />
                    <text x="0" y="3.5" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">1</text>
                  </g>

                  {/* Hotspot 2: Cúc Ngũ Thường / Khuy Ngọc */}
                  <g
                    transform="translate(268, 212)"
                    onClick={() => onSelectHotspot('ngu_thuong_buttons')}
                    className="hover:scale-125 transition-transform"
                  >
                    <circle cx="0" cy="0" r="9" fill="#CA8A04" stroke="#FFFFFF" strokeWidth="2" className="animate-ping opacity-75" />
                    <circle cx="0" cy="0" r="9" fill="#CA8A04" stroke="#FFFFFF" strokeWidth="2" filter="url(#overlay-shadow)" />
                    <text x="0" y="3.5" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">2</text>
                  </g>

                  {/* Hotspot 3: Vạt Áo / Dải Ngũ Sắc */}
                  <g
                    transform="translate(284, 255)"
                    onClick={() => onSelectHotspot('huu_nham_lapel')}
                    className="hover:scale-125 transition-transform"
                  >
                    <circle cx="0" cy="0" r="9" fill="#059669" stroke="#FFFFFF" strokeWidth="2" className="animate-ping opacity-75" />
                    <circle cx="0" cy="0" r="9" fill="#059669" stroke="#FFFFFF" strokeWidth="2" filter="url(#overlay-shadow)" />
                    <text x="0" y="3.5" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">3</text>
                  </g>
                </>
              ) : (
                /* Hotspot 4: Sống Áo Lưng Liền */
                <g
                  transform="translate(250, 270)"
                  onClick={() => onSelectHotspot('song_ao_back_seam')}
                  className="hover:scale-125 transition-transform"
                >
                  <circle cx="0" cy="0" r="9" fill="#4338CA" stroke="#FFFFFF" strokeWidth="2" className="animate-ping opacity-75" />
                  <circle cx="0" cy="0" r="9" fill="#4338CA" stroke="#FFFFFF" strokeWidth="2" filter="url(#overlay-shadow)" />
                  <text x="0" y="3.5" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">4</text>
                </g>
              )}
            </g>
          )}

          {/* EXPLODED ORBIT PASS */}
          {graphicsPass === 'exploded_orbit' && (
            <g id="pass-exploded-orbit-overlay">
              {PBR_MATERIALS.map((mat, i) => {
                const ox = i % 2 === 0 ? 80 : 420;
                const oy = 180 + i * 115;
                return (
                  <g
                    key={mat.id}
                    transform={`translate(${ox}, ${oy})`}
                    className="cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => onInspectMaterial && onInspectMaterial(mat)}
                  >
                    <circle cx="0" cy="0" r="26" fill="#1C1917" stroke="#A8A29E" strokeWidth="1.5" filter="url(#overlay-shadow)" />
                    <circle cx="0" cy="0" r="20" fill={mat.previewColor} opacity="0.9" />
                    <circle cx="-6" cy="-6" r="6" fill="#FFFFFF" opacity="0.5" />
                    <text
                      x={0}
                      y={36}
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {mat.vietnameseName.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
