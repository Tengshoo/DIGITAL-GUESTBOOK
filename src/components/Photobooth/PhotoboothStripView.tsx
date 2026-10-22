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
        compact ? 'w-full max-w-[280px] p-3' : 'w-full max-w-[340px] sm:max-w-[360px] p-4 sm:p-5'
      } ${
        currentTheme.id === 'vintage-film'
          ? 'bg-[#F5F0E6] text-[#2D241E] border-4 border-[#2D241E]'
          : currentTheme.id === 'champagne-gold'
          ? 'bg-gradient-to-b from-[#1C1612] via-[#14100D] to-[#221B15] text-[#FAF4E8] border-2 border-[#D4AF37]/70 shadow-[0_15px_40px_rgba(212,175,55,0.2)]'
          : currentTheme.id === 'blush-romance'
          ? 'bg-gradient-to-b from-[#FFF2F6] via-[#FDE8EF] to-[#FFF5F8] text-[#88304E] border-2 border-[#F8B4C4] shadow-[0_15px_35px_rgba(223,79,103,0.18)]'
          : currentTheme.id === 'midnight-noir'
          ? 'bg-[#101012] text-white border-2 border-white/20 shadow-2xl'
          : 'bg-gradient-to-b from-[#EEF4EF] to-[#E4ECE5] text-[#2D4A3E] border-2 border-[#CAD2C5] shadow-[0_15px_35px_rgba(45,74,62,0.15)]'
      }`}
    >
      {/* Film Sprockets for Vintage Film */}
      {currentTheme.id === 'vintage-film' && (
        <>
          <div className="absolute top-8 bottom-8 left-1 flex flex-col justify-between pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-1.5 h-3.5 bg-[#2D241E] rounded-sm" />
            ))}
          </div>
          <div className="absolute top-8 bottom-8 right-1 flex flex-col justify-between pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-1.5 h-3.5 bg-[#2D241E] rounded-sm" />
            ))}
          </div>
        </>
      )}

      {/* Golden Corner Accents for Champagne Gold */}
      {currentTheme.id === 'champagne-gold' && (
        <>
          <div className="absolute top-2 left-2 text-[#D4AF37] text-xs pointer-events-none">✦</div>
          <div className="absolute top-2 right-2 text-[#D4AF37] text-xs pointer-events-none">✦</div>
          <div className="absolute bottom-2 left-2 text-[#D4AF37] text-xs pointer-events-none">✦</div>
          <div className="absolute bottom-2 right-2 text-[#D4AF37] text-xs pointer-events-none">✦</div>
        </>
      )}

      {/* Strip Header */}
      <div className="text-center pb-3 pt-1">
        {currentTheme.id === 'vintage-film' && (
          <div>
            <span className="text-[10px] tracking-widest font-mono text-[#854D0E] font-semibold block uppercase">
              • MEMOIRA 35MM FILM •
            </span>
            <h4 className="font-serif font-bold text-sm tracking-wide text-[#2D241E] mt-0.5">
              {eventInfo.welcomeTitle}
            </h4>
          </div>
        )}

        {currentTheme.id === 'champagne-gold' && (
          <div>
            <div className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-medium">
              <span>✦</span>
              <span>Wedding Photobooth</span>
              <span>✦</span>
            </div>
            <h4 className="font-serif font-bold text-base tracking-wide text-[#FAF4E8] mt-0.5">
              {eventInfo.welcomeTitle}
            </h4>
          </div>
        )}

        {currentTheme.id === 'blush-romance' && (
          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#DF4F67]">
              <span>୨ৎ</span>
              <span className="font-semibold text-[10px] uppercase tracking-wider">Haru Cut</span>
              <span>୨ৎ</span>
            </div>
            <h4 className="font-serif font-bold text-sm text-[#88304E] mt-0.5">
              {eventInfo.welcomeTitle}
            </h4>
          </div>
        )}

        {currentTheme.id === 'midnight-noir' && (
          <div>
            <span className="text-[9px] tracking-widest font-mono text-neutral-400 uppercase block">
              ARCHIVE // PHOTO STRIP
            </span>
            <h4 className="font-mono font-bold text-sm tracking-widest text-white mt-0.5">
              {eventInfo.welcomeTitle.toUpperCase()}
            </h4>
          </div>
        )}

        {currentTheme.id === 'botanical-garden' && (
          <div>
            <span className="text-[10px] tracking-wider font-serif italic text-[#52796F] block">
              🌿 botanical memories 🌿
            </span>
            <h4 className="font-serif font-bold text-sm text-[#2D4A3E] mt-0.5">
              {eventInfo.welcomeTitle}
            </h4>
          </div>
        )}
      </div>

      {/* Photo Slots Column */}
      <div className="flex flex-col gap-2.5">
        {slots.map((photo, idx) => {
          const isActive = activeSlotIndex === idx;

          return (
            <div
              key={idx}
              className={`relative rounded-xl overflow-hidden aspect-[4/3] transition-all cursor-pointer group ${
                currentTheme.id === 'vintage-film'
                  ? 'bg-[#1F1A15] border border-[#2D241E]'
                  : currentTheme.id === 'champagne-gold'
                  ? 'bg-[#251E17] border-2 border-[#D4AF37]/60'
                  : currentTheme.id === 'blush-romance'
                  ? 'bg-white border border-[#F8B4C4] shadow-sm'
                  : currentTheme.id === 'midnight-noir'
                  ? 'bg-[#1A1A1E] border border-white/20'
                  : 'bg-white border border-[#CAD2C5] shadow-sm'
              } ${isActive ? 'ring-2 ring-champagne-400 scale-[1.01]' : ''}`}
              onClick={() => onSelectSlot && onSelectSlot(idx)}
            >
              {photo ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt={`Photobooth shot ${idx + 1}`}
                    className="w-full h-full object-cover"
                    style={{ filter: currentFilter?.cssFilter || 'none' }}
                  />

                  {/* Slot Number Stamp */}
                  <div className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/60 text-white backdrop-blur-[1px]">
                    0{idx + 1}
                  </div>

                  {/* Hover / Tap Action overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSlot && onSelectSlot(idx);
                      }}
                      className="px-2 py-1 rounded-lg bg-white/90 text-warm-900 text-[10px] font-semibold flex items-center gap-1 shadow"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Retake</span>
                    </button>
                    {onClearSlot && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClearSlot(idx);
                        }}
                        className="p-1 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 shadow"
                        title="Clear photo"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center transition group-hover:bg-black/10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition group-hover:scale-110 ${
                      currentTheme.id === 'champagne-gold'
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                        : currentTheme.id === 'blush-romance'
                        ? 'bg-rose-100 text-rose-600'
                        : currentTheme.id === 'midnight-noir'
                        ? 'bg-white/10 text-white'
                        : 'bg-warm-200 text-warm-700'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium opacity-80">
                    Slot {idx + 1}
                  </span>
                  <span className="text-[9px] opacity-60">
                    Tap to snap
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Strip Footer */}
      <div className="text-center pt-4 pb-1">
        {currentTheme.id === 'vintage-film' && (
          <div className="flex flex-col items-center gap-1">
            <h5 className="font-serif font-bold text-sm text-[#2D241E]">
              {eventInfo.welcomeTitle}
            </h5>
            <span className="text-[10px] text-[#854D0E] font-medium">
              {eventInfo.date} • {eventInfo.venue}
            </span>
            <span className="text-[9px] font-mono text-[#6B584C] mt-0.5">
              {eventInfo.hashtag} • 35MM CUT
            </span>
          </div>
        )}

        {currentTheme.id === 'champagne-gold' && (
          <div className="flex flex-col items-center gap-0.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] mb-0.5" />
            <h5 className="font-serif font-bold text-base text-[#FAF4E8]">
              {eventInfo.welcomeTitle}
            </h5>
            <span className="text-[11px] font-serif italic text-[#D4AF37]">
              Forever & Always
            </span>
            <span className="text-[9px] text-white/60 mt-0.5">
              {eventInfo.date} • {eventInfo.venue}
            </span>
          </div>
        )}

        {currentTheme.id === 'blush-romance' && (
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 text-[#DF4F67] text-xs">
              <Heart className="w-3 h-3 fill-current" />
              <Heart className="w-3 h-3 fill-current" />
              <Heart className="w-3 h-3 fill-current" />
            </div>
            <h5 className="font-serif font-bold text-sm text-[#88304E]">
              {eventInfo.welcomeTitle}
            </h5>
            <span className="text-[10px] font-serif italic text-[#DF4F67]">
              sweet memories with you ♡
            </span>
            <span className="text-[9px] text-[#9D425E] font-medium">
              {eventInfo.date} • {eventInfo.hashtag}
            </span>
          </div>
        )}

        {currentTheme.id === 'midnight-noir' && (
          <div className="flex flex-col items-center gap-1">
            <div className="w-24 h-4 bg-white/20 rounded-xs mb-1" />
            <h5 className="font-mono font-bold text-sm tracking-wider text-white">
              {eventInfo.welcomeTitle.toUpperCase()}
            </h5>
            <span className="text-[9px] font-mono text-neutral-400">
              {eventInfo.date.toUpperCase()} // {eventInfo.hashtag}
            </span>
          </div>
        )}

        {currentTheme.id === 'botanical-garden' && (
          <div className="flex flex-col items-center gap-0.5">
            <h5 className="font-serif font-bold text-sm text-[#2D4A3E]">
              {eventInfo.welcomeTitle}
            </h5>
            <span className="text-[10px] font-serif italic text-[#52796F]">
              Growing in love together • 08.07.2026
            </span>
            <span className="text-[9px] text-[#3E5C46] font-medium">
              {eventInfo.venue} • {eventInfo.hashtag}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
