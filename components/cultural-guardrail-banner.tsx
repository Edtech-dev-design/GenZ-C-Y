'use client';

import React, { useState } from 'react';
import { GuardrailCheck } from '@/lib/heritage-data';
import { ShieldCheck, AlertTriangle, Info, CheckCircle2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface GuardrailBannerProps {
  checks: GuardrailCheck[];
  harmonyScore: {
    score: number;
    heritageScore: number;
    fusionScore: number;
    colorScore: number;
    summary: string;
  };
  onFixLapel?: () => void;
}

export default function CulturalGuardrailBanner({
  checks,
  harmonyScore,
  onFixLapel
}: GuardrailBannerProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const hasWarnings = checks.some((c) => c.status === 'warning');
  const hasNotices = checks.some((c) => c.status === 'notice');

  return (
    <div className="w-full bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Top Banner Row */}
      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-stone-50 via-white to-amber-50/40 border-b border-stone-200/70">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              hasWarnings
                ? 'bg-rose-100 text-rose-700'
                : hasNotices
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {hasWarnings ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Cultural Guardrail</span>
              <span className="text-stone-300">·</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  hasWarnings
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : hasNotices
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {hasWarnings ? 'Cần Lưu Ý Lệch Chuẩn' : hasNotices ? 'Mách Nhỏ Văn Hóa' : 'Chuẩn Mực & Tao Nhã'}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-semibold text-stone-900 mt-0.5">
              Hệ Thống Trợ Lý Kiểm Soát Chuẩn Mực Văn Hóa
            </h4>
          </div>
        </div>

        {/* Harmony Score Pill Cluster */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-stone-500">Chỉ Số Hòa Hợp (Harmony)</div>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-2xl font-bold font-serif-title tabular-nums text-stone-900">
                {harmonyScore.score}
              </span>
              <span className="text-xs text-stone-500">/ 100</span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            title={isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
            aria-label="Toggle guardrail details"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="p-5 space-y-4 bg-stone-50/40">
          {/* Harmony Score breakdown bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600">Độ Chuẩn Di Sản:</span>
                <span className="font-semibold text-stone-900 tabular-nums">{harmonyScore.heritageScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-700 rounded-full transition-all duration-500"
                  style={{ width: `${harmonyScore.heritageScore}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600">Sáng Tạo Gen Z Fusion:</span>
                <span className="font-semibold text-stone-900 tabular-nums">{harmonyScore.fusionScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${harmonyScore.fusionScore}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600">Hòa Sắc Ngũ Hành:</span>
                <span className="font-semibold text-stone-900 tabular-nums">{harmonyScore.colorScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${harmonyScore.colorScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Real-time guardrail alert cards */}
          <div className="space-y-2.5">
            {checks.map((check, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                  check.status === 'warning'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                    : check.status === 'notice'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                    : 'bg-emerald-50/50 border-emerald-200/80 text-emerald-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {check.status === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    ) : check.status === 'notice' ? (
                      <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold block">{check.title}</span>
                      <p className="mt-0.5 text-stone-700">{check.message}</p>
                      <p className="mt-1 font-medium text-stone-900">{check.advice}</p>
                    </div>
                  </div>

                  {check.code === 'TA_NHAM_ALERT' && onFixLapel && (
                    <button
                      onClick={onFixLapel}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg shrink-0 transition-colors shadow-sm"
                    >
                      Đổi sang Hữu Nhậm
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-stone-500 italic">
            * Hệ thống Cảnh báo Lệch Chuẩn tôn trọng quyền tự do sáng tạo và cá tính của bạn; những lời nhắc nhở nhằm giúp bạn tự tin xuống phố mà không lo &quot;phạm quy&quot; hay bị chỉ trích.
          </div>
        </div>
      )}
    </div>
  );
}
