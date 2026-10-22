'use client';

import React from 'react';
import { PHOTOBOOTH_STRIP_THEMES, PhotoboothStripTheme } from './stripThemes';
import { PHOTO_FILTERS } from '@/components/PhotoFilterSelector';
import { Sparkles, Heart, Camera, Plus, RotateCcw } from 'lucide-react';

interface PhotoboothStripViewProps {
  photos: string[];
  themeId: PhotoboothStripTheme['id'];
  filterId?: string;
  activeSlotIndex?: number | null;
  onSelectSlot?: (index: number) => void;
  onClearSlot?: (index: number) => void;
  eventInfo?: {
    welcomeTitle: string;
    miniTitle?: string;
    date: string;
    venue: string;
    hashtag: string;
  };
  totalSlots?: number;
  compact?: boolean;
}

export default function PhotoboothStripView({
  photos,
  themeId,
  filterId = 'original',
  activeSlotIndex = null,
  onSelectSlot,
  onClearSlot,
  eventInfo = {
    welcomeTitle: 'Arman & Farah',
    miniTitle: 'Majlis Perkahwinan',
    date: '08 Jul 2026',
    venue: 'Hotel memoira',
    hashtag: '#ArmanFarah',
  },
  totalSlots = 4,
  compact = false,
}: PhotoboothStripViewProps) {
  const currentTheme =
    PHOTOBOOTH_STRIP_THEMES.find((t) => t.id === themeId) || PHOTOBOOTH_STRIP_THEMES[0];
  const currentFilter = PHOTO_FILTERS.find((f) => f.id === filterId);

  // Generate array for slot count
  const slots = Array.from({ length: totalSlots }, (_, i) => photos[i] || null);

  return (
    <div
      className={`relative mx-auto rounded-3xl transition-all duration-300 shadow-2xl select-none ${
        compact ? 'w-full max-w-[280px] p-3.5' : 'w-full max-w-[340px] sm:max-w-[360px] p-4 sm:p-5'
      } ${
        currentTheme.id === 'coquette-cherry'
          ? 'bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#FFF5F8] text-[#9F1239] border-2 border-[#FDA4AF] shadow-[0_15px_40px_rgba(244,114,182,0.25)]'
          : currentTheme.id === 'lavender-stars'
          ? 'bg-gradient-to-b from-[#F5EEFD] via-[#EDE9FE] to-[#FCE7F3] text-[#581C87] border-2 border-[#D8B4FE] shadow-[0_15px_40px_rgba(147,51,234,0.2)]'
          : currentTheme.id === 'matcha-butter'
          ? 'bg-gradient-to-b from-[#FEF9C3] via-[#FFFBEB] to-[#ECFDF5] text-[#365314] border-2 border-[#86EFAC] shadow-[0_15px_40px_rgba(101,163,13,0.2)]'
          : currentTheme.id === 'baby-blue-pop'
          ? 'bg-gradient-to-b from-[#E0F2FE] via-[#F0F9FF] to-[#FFE4E6] text-[#0369A1] border-2 border-[#7DD3FC] shadow-[0_15px_40px_rgba(2,132,199,0.2)]'
          : 'bg-gradient-to-b from-[#111216] via-[#161822] to-[#111216] text-white border-2 border-[#FF2E93]/70 shadow-[0_15px_40px_rgba(255,46,147,0.3)]'
      }`}
    >
      {/* Decorative Corner Accents */}
      {currentTheme.id === 'coquette-cherry' && (
        <>
          <div className="absolute top-2.5 left-3 text-sm pointer-events-none">🍒</div>
          <div className="absolute top-2.5 right-3 text-sm pointer-events-none">🍒</div>
          <div className="absolute bottom-2.5 left-3 text-xs text-[#E11D48] pointer-events-none">୨ৎ</div>
          <div className="absolute bottom-2.5 right-3 text-xs text-[#E11D48] pointer-events-none">୨ৎ</div>
        </>
      )}

      {currentTheme.id === 'lavender-stars' && (
        <>
          <div className="absolute top-2.5 left-3 text-[#9333EA] text-xs pointer-events-none animate-pulse">✦</div>
          <div className="absolute top-2.5 right-3 text-[#9333EA] text-xs pointer-events-none animate-pulse">✦</div>
          <div className="absolute bottom-2.5 left-3 text-[#C084FC] text-xs pointer-events-none">✧</div>
          <div className="absolute bottom-2.5 right-3 text-[#C084FC] text-xs pointer-events-none">✧</div>
        </>
      )}

      {currentTheme.id === 'matcha-butter' && (
        <>
          <div className="absolute top-2.5 left-3 text-xs pointer-events-none">✿</div>
          <div className="absolute top-2.5 right-3 text-xs pointer-events-none">✿</div>
          <div className="absolute bottom-2.5 left-3 text-xs pointer-events-none">❀</div>
          <div className="absolute bottom-2.5 right-3 text-xs pointer-events-none">❀</div>
        </>
      )}

      {currentTheme.id === 'baby-blue-pop' && (
        <>
          <div className="absolute top-2.5 left-3 text-xs pointer-events-none">☁️</div>
          <div className="absolute top-2.5 right-3 text-xs pointer-events-none">☁️</div>
          <div className="absolute bottom-2.5 left-3 text-xs text-[#0284C7] pointer-events-none">✦</div>
          <div className="absolute bottom-2.5 right-3 text-xs text-[#0284C7] pointer-events-none">✦</div>
        </>
      )}

      {currentTheme.id === 'cyber-heart' && (
        <>
          <div className="absolute top-2.5 left-3 text-[#FF2E93] text-xs pointer-events-none">★</div>
          <div className="absolute top-2.5 right-3 text-[#FF2E93] text-xs pointer-events-none">★</div>
          <div className="absolute bottom-2.5 left-3 text-[#FF2E93] text-xs pointer-events-none">✦</div>
          <div className="absolute bottom-2.5 right-3 text-[#FF2E93] text-xs pointer-events-none">✦</div>
        </>
      )}

      {/* Strip Header */}
      <div className="text-center pb-3 pt-1">
        {currentTheme.id === 'coquette-cherry' && (
          <div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#E11D48] font-bold">
              <span>୨ৎ</span>
              <span className="text-[10px] uppercase tracking-widest bg-rose-100/90 px-2 py-0.5 rounded-full border border-rose-200">
                Coquette Cut
              </span>
              <span>୨ৎ</span>
            </div>
            <h4 className="font-serif font-black text-base text-[#9F1239] mt-1 tracking-tight">
              {eventInfo.welcomeTitle}
            </h4>
          </div>
        )}

        {currentTheme.id === 'lavender-stars' && (
          <div>
            <div className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest font-mono text-[#9333EA] font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>[● REC] HARU DREAM 00:26</span>
            </div>
            <h4 className="font-serif font-black text-base text-[#581C87] mt-0.5">
              {eventInfo.welcomeTitle}
            </h4>
            <span className="text-[10px] font-serif italic text-[#9333EA] block">
              ★ main character energy ★
            </span>
          </div>
        )}

        {currentTheme.id === 'matcha-butter' && (
          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#4D7C0F] font-bold">
              <span>✿</span>
              <span className="text-[10px] uppercase tracking-wider bg-lime-100/90 px-2 py-0.5 rounded-full border border-lime-200">
                Matcha & Daisy
              </span>
              <span>✿</span>
            </div>
            <h4 className="font-serif font-black text-base text-[#365314] mt-1">
              {eventInfo.welcomeTitle}
            </h4>
          </div>
        )}

        {currentTheme.id === 'baby-blue-pop' && (
          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#0284C7] font-bold">
              <span>☁️</span>
              <span className="text-[10px] uppercase tracking-wider bg-sky-100/90 px-2 py-0.5 rounded-full border border-sky-200">
                Life4Cuts Cloud 9
              </span>
              <span>☁️</span>
            </div>
            <h4 className="font-serif font-black text-base text-[#0369A1] mt-1">
              {eventInfo.welcomeTitle}
            </h4>
          </div>
        )}

        {currentTheme.id === 'cyber-heart' && (
          <div>
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-[#FF2E93]">
              <span>// CYBER ARCHIVE // 08.07.26</span>
            </div>
            <h4 className="font-sans font-black text-base tracking-widest text-white mt-0.5">
              {eventInfo.welcomeTitle.toUpperCase()}
            </h4>
            <span className="text-[9px] font-mono text-neutral-400 block tracking-wider">
              ✦ COOL KIDS WEDDING CLUB ✦
            </span>
          </div>
        )}
      </div>

      {/* Photo Slots Column */}
      <div className="flex flex-col gap-3">
        {slots.map((photo, idx) => {
          const isActive = activeSlotIndex === idx;

          return (
            <div
              key={idx}
              className={`relative rounded-2xl overflow-hidden aspect-[4/3] transition-all cursor-pointer group shadow-sm ${
                currentTheme.id === 'coquette-cherry'
                  ? 'bg-white border-2 border-rose-200'
                  : currentTheme.id === 'lavender-stars'
                  ? 'bg-white border-2 border-purple-200'
                  : currentTheme.id === 'matcha-butter'
                  ? 'bg-white border-2 border-lime-200'
                  : currentTheme.id === 'baby-blue-pop'
                  ? 'bg-white border-2 border-sky-200'
                  : 'bg-[#1C1E26] border-2 border-[#FF2E93]/60'
              } ${isActive ? 'ring-4 ring-pink-400 scale-[1.01]' : ''}`}
              onClick={() => onSelectSlot && onSelectSlot(idx)}
            >
              {/* Cute Washi Tape Decor for Coquette */}
              {currentTheme.id === 'coquette-cherry' && (
                <div
                  className={`absolute -top-1.5 ${
                    idx % 2 === 0 ? '-left-2 -rotate-12' : '-right-2 rotate-12'
                  } w-10 h-3.5 bg-rose-200/90 rounded-xs border border-white/60 pointer-events-none z-10`}
                />
              )}

              {/* Cute Daisy Decor for Matcha */}
              {currentTheme.id === 'matcha-butter' && (idx === 0 || idx === 3) && (
                <div className="absolute top-1 left-1.5 text-xs pointer-events-none z-10">
                  🌼
                </div>
              )}

              {/* Cute Cloud Decor for Baby Blue */}
              {currentTheme.id === 'baby-blue-pop' && idx % 2 === 1 && (
                <div className="absolute top-1 right-1.5 text-xs pointer-events-none z-10">
                  ☁️
                </div>
              )}

              {/* Y2K Star for Lavender */}
              {currentTheme.id === 'lavender-stars' && (
                <div className="absolute top-1 right-1.5 text-[#9333EA] text-xs pointer-events-none z-10">
                  ✦
                </div>
              )}

              {photo ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt={`Photobooth shot ${idx + 1}`}
                    className="w-full h-full object-cover"
                    style={{ filter: currentFilter?.cssFilter || 'none' }}
                  />

                  {/* Slot Number Badge */}
                  <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-black/60 text-white backdrop-blur-[2px]">
                    0{idx + 1}
                  </div>

                  {/* Hover / Tap Action overlay */}
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSlot && onSelectSlot(idx);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white text-warm-900 text-xs font-bold flex items-center gap-1 shadow-md active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5 text-pink-600" />
                      <span>Retake</span>
                    </button>
                    {onClearSlot && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClearSlot(idx);
                        }}
                        className="p-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-md active:scale-95"
                        title="Padam slot"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center transition group-hover:bg-black/5">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center mb-1 transition-transform group-hover:scale-110 shadow-xs ${
                      currentTheme.id === 'coquette-cherry'
                        ? 'bg-rose-100 text-rose-600'
                        : currentTheme.id === 'lavender-stars'
                        ? 'bg-purple-100 text-purple-700'
                        : currentTheme.id === 'matcha-butter'
                        ? 'bg-lime-100 text-lime-700'
                        : currentTheme.id === 'baby-blue-pop'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-[#FF2E93]/20 text-[#FF2E93]'
                    }`}
                  >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-bold opacity-85">
                    Slot {idx + 1}
                  </span>
                  <span className="text-[10px] opacity-60">
                    Snap or upload
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Strip Footer */}
      <div className="text-center pt-4 pb-1">
        {currentTheme.id === 'coquette-cherry' && (
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 text-[#E11D48] text-xs">
              <span>୨ৎ</span>
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>୨ৎ</span>
            </div>
            <h5 className="font-serif font-black text-base text-[#9F1239]">
              {eventInfo.welcomeTitle}
            </h5>
            <span className="text-[11px] font-serif italic text-[#E11D48] font-semibold">
              certified cuties ♡ in love forever
            </span>
            <span className="text-[10px] text-[#BE123C] font-semibold mt-0.5">
              {eventInfo.date} • {eventInfo.hashtag}
            </span>
            <div className="w-28 h-3.5 bg-rose-200/80 rounded-xs mt-1.5" />
          </div>
        )}

        {currentTheme.id === 'lavender-stars' && (
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 text-[#9333EA] text-xs">
              <span>✦</span>
              <span className="text-[10px] font-bold">100% CUTE</span>
              <span>✦</span>
            </div>
            <h5 className="font-serif font-black text-base text-[#581C87]">
              {eventInfo.welcomeTitle}
            </h5>
            <span className="text-[11px] font-serif italic text-[#9333EA]">
              ★ starry love & sweet memories ★
            </span>
            <span className="text-[10px] text-[#6B21A8] font-semibold mt-0.5">
              {eventInfo.date} • {eventInfo.venue}
            </span>
            <div className="w-28 h-3.5 bg-purple-200/80 rounded-xs mt-1.5" />
          </div>
        )}

        {currentTheme.id === 'matcha-butter' && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-sm">✿ ☺ ✿</span>
            <h5 className="font-serif font-black text-base text-[#365314]">
              {eventInfo.welcomeTitle}
            </h5>
            <span className="text-[11px] font-serif italic text-[#4D7C0F]">
              happy moments only ✿ so lucky
            </span>
            <span className="text-[10px] text-[#15803D] font-semibold mt-0.5">
              {eventInfo.date} • {eventInfo.hashtag}
            </span>
            <div className="w-28 h-3.5 bg-lime-200/80 rounded-xs mt-1.5" />
          </div>
        )}

        {currentTheme.id === 'baby-blue-pop' && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs">☁️ ♡ ☁️</span>
            <h5 className="font-serif font-black text-base text-[#0369A1]">
              {eventInfo.welcomeTitle}
            </h5>
            <span className="text-[11px] font-serif italic text-[#0284C7]">
              on cloud nine with you ♡
            </span>
            <span className="text-[10px] text-[#075985] font-semibold mt-0.5">
              {eventInfo.date} • {eventInfo.venue}
            </span>
            <div className="w-28 h-3.5 bg-sky-200/80 rounded-xs mt-1.5" />
          </div>
        )}

        {currentTheme.id === 'cyber-heart' && (
          <div className="flex flex-col items-center gap-1">
            <div className="w-32 h-4 bg-white/20 rounded-xs" />
            <h5 className="font-mono font-black text-base tracking-widest text-white">
              {eventInfo.welcomeTitle.toUpperCase()}
            </h5>
            <span className="text-[10px] font-mono text-[#FF2E93] font-bold">
              // COOL KIDS CLUB // {eventInfo.hashtag}
            </span>
            <span className="text-[9px] font-mono text-neutral-400">
              {eventInfo.date.toUpperCase()} • {eventInfo.venue.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
