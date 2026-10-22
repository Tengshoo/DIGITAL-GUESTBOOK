'use client';

import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  Send,
  X,
  Heart,
  ArrowRight,
  Tv,
  Calendar,
  MapPin,
  ChevronDown,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import Link from 'next/link';
import VoiceRecorder from '@/components/VoiceRecorder';
import PhotoFilterSelector, {
  PHOTO_FILTERS,
  PhotoFilter,
} from '@/components/PhotoFilterSelector';
import PhotoFrameSelector, {
  PHOTO_FRAMES,
  PhotoFrameConfig,
  LivePhotoFrameOverlay,
  applyFilterAndFrameToCanvas,
} from '@/components/PhotoFrameSelector';
import PhotoboothStudio from '@/components/Photobooth/PhotoboothStudio';
import { submitGuestbookEntry } from '@/lib/supabase';
import { getAssetPath } from '@/lib/assets';

export default function GuestbookPage() {
  // Event details matching the demo
  const eventDetails = {
    miniTitle: 'Majlis Perkahwinan',
    welcomeTitle: 'Arman & Farah',
    date: '08 Jul 2026',
    venue: 'Hotel memoira',
    hashtag: '#ArmanFarah',
    welcomeMessage:
      'Kongsi gambar, video, atau momen indah yang anda rakam bersama kami.',
    bgImage: getAssetPath('/assets/img/arman-farah-venue.png?v=2'),
    avatarImage: getAssetPath('/assets/img/arman-farah-welcome.jpg'),
  };

  // Form states
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rawPhotoBase64, setRawPhotoBase64] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter['id']>('original');
  const [selectedFrame, setSelectedFrame] = useState<PhotoFrameConfig['id']>('none');
  const [voiceBase64, setVoiceBase64] = useState<string | null>(null);

  // Modal / Drawer toggle
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPhotoboothModalOpen, setIsPhotoboothModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    const doc = document as unknown as {
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
      exitFullscreen?: () => Promise<void>;
      webkitExitFullscreen?: () => Promise<void>;
    };
    const el = document.documentElement as unknown as {
      requestFullscreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => Promise<void>;
    };

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
      };
      setIsFullscreen(Boolean(doc.fullscreenElement || doc.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Check for pending photobooth strip from /photobooth route or query param
  useEffect(() => {
    try {
      const pendingPhoto = sessionStorage.getItem('pending_guestbook_photo');
      if (pendingPhoto) {
        setRawPhotoBase64(pendingPhoto);
        setPhotoBase64(pendingPhoto);
        setSelectedFilter('original');
        setSelectedFrame('none');
        setIsFormOpen(true);
        sessionStorage.removeItem('pending_guestbook_photo');
      }

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('openModal') === 'true') {
          setIsFormOpen(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handlePhotoboothComplete = (stripDataUrl: string) => {
    setRawPhotoBase64(stripDataUrl);
    setPhotoBase64(stripDataUrl);
    setSelectedFilter('original');
    setSelectedFrame('none');
    setIsPhotoboothModalOpen(false);
    setIsFormOpen(true);
  };

  // Photo upload handling & client-side compression
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type
      ? file.type.startsWith('image/')
      : /\.(jpe?g|png|webp|heic|heif|gif)$/i.test(file.name);
    if (!isImage && file.type) {
      setErrorMsg('Sila pilih fail gambar yang sah (JPEG/PNG/HEIC).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setRawPhotoBase64(compressed);
          setPhotoBase64(compressed);
          setSelectedFilter('original');
          setSelectedFrame('none');
          setErrorMsg(null);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setRawPhotoBase64(null);
    setPhotoBase64(null);
    setSelectedFilter('original');
    setSelectedFrame('none');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const triggerConfetti = () => {
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#E5C378', '#FCE7EB', '#DF4F67', '#FFFFFF'],
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch (e) {
      console.warn('Confetti animation failed:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Sila masukkan nama anda.');
      return;
    }

    if (!message.trim()) {
      setErrorMsg('Sila tinggalkan ucapan atau doa tulus anda.');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalPhotoUrl: string | null = null;
      if (rawPhotoBase64) {
        finalPhotoUrl = await applyFilterAndFrameToCanvas(
          rawPhotoBase64,
          selectedFilter,
          selectedFrame
        );
      }

      const result = await submitGuestbookEntry({
        name: name.trim(),
        message: message.trim(),
        photo_url: finalPhotoUrl,
        audio_url: voiceBase64,
      });

      if (!result.success) {
        throw new Error(result.error || 'Gagal menghantar ucapan.');
      }

      setIsSuccess(true);
      triggerConfetti();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Berlaku ralat semasa menyimpan memori anda.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setMessage('');
    setRawPhotoBase64(null);
    setPhotoBase64(null);
    setSelectedFilter('original');
    setSelectedFrame('none');
    setVoiceBase64(null);
    setErrorMsg(null);
    setIsSuccess(false);
    setIsFormOpen(false);
  };

  const openFormWithName = () => {
    setIsFormOpen(true);
  };

  const currentFilterConfig =
    PHOTO_FILTERS.find((f) => f.id === selectedFilter) || PHOTO_FILTERS[0];

  const currentFrameConfig =
    PHOTO_FRAMES.find((f) => f.id === selectedFrame) || PHOTO_FRAMES[0];

  return (
    <div className="relative w-full min-h-screen min-h-[100dvh] flex flex-col justify-between overflow-x-hidden text-white select-none">
      {/* 1. Full-Bleed Cinematic Background with GPU Compositing */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none gpu-layer"
        style={{ backgroundImage: `url(${eventDetails.bgImage})` }}
      >
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/40 to-black/75" />
      </div>

      {/* 2. Top Event Navigation Bar */}
      <header className="relative z-10 w-full max-w-lg mx-auto safe-pt px-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/40 sm:bg-white/15 backdrop-blur-xs sm:backdrop-blur-md border border-white/20 text-champagne-200 text-xs font-semibold tracking-wide shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-champagne-300" />
          <span>{eventDetails.hashtag}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs sm:backdrop-blur-md border border-white/20 text-xs text-warm-200 transition-colors"
            title={isFullscreen ? 'Keluar Skrin Penuh' : 'Skrin Penuh (Fullscreen)'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-champagne-300" />
                <span className="hidden sm:inline">Keluar</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-champagne-300" />
                <span className="hidden sm:inline">Skrin Penuh</span>
              </>
            )}
          </button>

          <Link
            href="/wall"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs sm:backdrop-blur-md border border-white/20 text-xs text-warm-200 transition-colors"
          >
            <Tv className="w-3.5 h-3.5 text-champagne-400" />
            <span>Live Wall</span>
          </Link>
        </div>
      </header>

      {/* 3. Main Centered Cover Content */}
      <main className="relative z-10 w-full max-w-md mx-auto px-5 py-8 my-auto flex flex-col items-center text-center animate-fade-in gpu-layer">
        {/* Couple Circular Avatar */}
        <div className="relative mb-5 group">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.5)] ring-4 ring-champagne-400/40 transition-transform duration-300 group-hover:scale-105 bg-warm-200 gpu-layer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={eventDetails.avatarImage}
              alt={eventDetails.welcomeTitle}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-champagne-500 text-white flex items-center justify-center shadow-md border-2 border-white">
            <Heart className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Mini Title */}
        <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-champagne-300 mb-2 drop-shadow-sm font-sans">
          {eventDetails.miniTitle}
        </span>

        {/* Main Couple Title */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          {eventDetails.welcomeTitle}
        </h1>

        {/* Event Metadata (Date & Venue) */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-2 rounded-full bg-black/40 sm:bg-white/10 backdrop-blur-xs sm:backdrop-blur-md border border-white/20 text-xs sm:text-sm text-warm-100 shadow-sm mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-champagne-300" />
            <span>{eventDetails.date}</span>
          </span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-300" />
            <span>{eventDetails.venue}</span>
          </span>
        </div>

        {/* Welcoming Message */}
        <p className="font-serif italic text-base sm:text-lg text-warm-200/95 leading-relaxed max-w-sm mb-8 drop-shadow">
          &ldquo;{eventDetails.welcomeMessage}&rdquo;
        </p>

        {/* 4. Guest Entry Box */}
        <div className="w-full bg-black/60 sm:bg-black/40 backdrop-blur-sm sm:backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col gap-3.5 gpu-layer">
          <div className="flex flex-col gap-1.5 text-left">
            <label
              htmlFor="guest-name-cover"
              className="text-xs uppercase font-semibold tracking-wider text-champagne-300"
            >
              Nama anda
            </label>
            <input
              id="guest-name-cover"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama anda..."
              className="w-full px-4 py-3.5 rounded-2xl border border-white/25 bg-white/10 text-white placeholder-white/50 text-center text-[16px] sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-champagne-400 focus:bg-black/40 transition-colors"
            />
          </div>

          {/* Primary Action Button: "Kongsikan Momen" */}
          <button
            type="button"
            onClick={openFormWithName}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-champagne-500 via-champagne-400 to-champagne-500 hover:from-champagne-600 hover:to-champagne-500 text-warm-950 font-bold text-sm tracking-wide shadow-champagne transition-transform duration-150 active:scale-[0.98] flex items-center justify-center gap-2 gpu-layer"
          >
            <Camera className="w-4 h-4 fill-warm-950" />
            <span>Kongsikan Momen</span>
          </button>

          {/* Photobooth Studio Action: "📸 Studio Photobooth (6 Pilihan Strip)" */}
          <Link
            href="/photobooth"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-champagne-800/80 via-warm-900/90 to-amber-900/80 hover:from-champagne-800 hover:to-amber-900 border border-champagne-400/40 text-white font-bold text-xs tracking-wide shadow-lg transition-transform duration-150 active:scale-[0.98] flex items-center justify-center gap-2 group backdrop-blur-xs sm:backdrop-blur-sm gpu-layer"
          >
            <Sparkles className="w-4 h-4 text-champagne-300 group-hover:rotate-12 transition-transform duration-200" />
            <span>📸 Studio Photobooth (6 Pilihan Strip)</span>
          </Link>

          {/* Secondary Action: "Buka Galeri & Live Wall" */}
          <Link
            href="/wall"
            className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Tv className="w-3.5 h-3.5 text-champagne-300" />
            <span>Buka Galeri & Live Wall</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-4 safe-pb text-[11px] text-white/50 backdrop-blur-xs sm:backdrop-blur-sm">
        <p>memoira • {eventDetails.welcomeTitle} Celebration</p>
      </footer>

      {/* 5. Interactive Submission Modal / Sheet */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 sm:bg-black/60 backdrop-blur-xs sm:backdrop-blur-sm animate-fade-in gpu-layer">
          <div className="w-full max-w-lg max-h-[90dvh] overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] bg-[#FAF8F5] text-warm-900 rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl border-t sm:border border-champagne-300 relative animate-fade-up gpu-layer">
            {/* Mobile bottom-sheet drag handle */}
            <div className="w-12 h-1.5 bg-warm-300 rounded-full mx-auto -mt-1 mb-3.5 sm:hidden" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-warm-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-champagne-100 flex items-center justify-center text-champagne-700">
                  <Heart className="w-4 h-4 fill-rose-500/20 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-warm-900">
                    Tinggalkan Momen & Ucapan
                  </h3>
                  <p className="text-[11px] text-warm-500">
                    Untuk {eventDetails.welcomeTitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-full hover:bg-warm-200 text-warm-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Celebration View */}
            {isSuccess ? (
              <div className="py-8 text-center animate-fade-up">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-champagne-100 border-2 border-champagne-300 flex items-center justify-center text-champagne-700 shadow-champagne">
                  <Sparkles className="w-8 h-8 animate-pulse text-champagne-600" />
                </div>

                <h2 className="font-serif text-3xl font-bold text-warm-900 mb-2">
                  Terima Kasih, {name}!
                </h2>
                <p className="font-serif italic text-base text-champagne-800 mb-2">
                  Ucapan & memori indah anda telah selamat disimpan.
                </p>
                <p className="text-xs text-warm-600 max-w-sm mx-auto mb-6">
                  Memori anda akan dipaparkan secara langsung pada skrin Live Wall majlis.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white hover:bg-warm-100 text-warm-800 border border-warm-300 font-medium text-xs transition"
                  >
                    Hantar Ucapan Lain
                  </button>
                  <Link
                    href="/wall"
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-champagne-600 hover:bg-champagne-700 text-white font-medium text-xs transition shadow-champagne"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Tonton Live Wall</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Submission Form */
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-rose-200 flex-shrink-0 flex items-center justify-center text-rose-700 text-[10px] font-bold">
                      !
                    </div>
                    <p>{errorMsg}</p>
                  </div>
                )}

                {/* Field 1: Guest Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="guest-name-modal"
                    className="text-xs font-semibold uppercase tracking-wider text-warm-700"
                  >
                    Nama Anda <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="guest-name-modal"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Sarah & Michael"
                    maxLength={100}
                    className="w-full px-4 py-2.5 rounded-xl border border-warm-200 bg-white text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-champagne-400 text-[16px] sm:text-sm"
                  />
                </div>

                {/* Field 2: Well Wishes / Message */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="guest-message-modal"
                    className="text-xs font-semibold uppercase tracking-wider text-warm-700"
                  >
                    Ucapan & Doa Tulus <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="guest-message-modal"
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan ucapan tahniah, doa keberkatan, atau memori bersama pasangan..."
                    maxLength={2000}
                    className="w-full px-4 py-2.5 rounded-xl border border-warm-200 bg-white text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-champagne-400 text-[16px] sm:text-sm resize-none"
                  />
                  <span className="text-[10px] text-right text-warm-400">
                    {message.length} / 2000 aksara
                  </span>
                </div>

                {/* Field 3: Photo Upload with 4 Filters & Optional Cute Frames */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-warm-700">
                    Gambar / Selfie (Pilihan)
                  </span>

                  {rawPhotoBase64 ? (
                    <div className="flex flex-col gap-3">
                      <div className="relative group">
                        <LivePhotoFrameOverlay frameId={selectedFrame}>
                          <div className="relative overflow-hidden bg-warm-100 rounded-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={rawPhotoBase64}
                              alt="Guest memory preview"
                              className="w-full max-h-64 object-cover object-center transition-all duration-300"
                              style={{ filter: currentFilterConfig.cssFilter }}
                            />

                            <button
                              type="button"
                              onClick={removePhoto}
                              aria-label="Padam gambar"
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition shadow-md z-20"
                            >
                              <X className="w-4 h-4" />
                            </button>

                            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1.5 border border-white/20 shadow-sm z-20">
                              <Sparkles className="w-3 h-3 text-champagne-300" />
                              <span>
                                {currentFilterConfig.name}
                                {selectedFrame !== 'none' &&
                                  ` • ${currentFrameConfig.shortLabel}`}
                              </span>
                            </div>
                          </div>
                        </LivePhotoFrameOverlay>
                      </div>

                      {/* 4 Sets of Photo Filters */}
                      <PhotoFilterSelector
                        photoUrl={rawPhotoBase64}
                        selectedFilter={selectedFilter}
                        onSelectFilter={(fid) => setSelectedFilter(fid)}
                      />

                      {/* Aesthetic & Cute Frames Picker */}
                      <PhotoFrameSelector
                        selectedFrame={selectedFrame}
                        onSelectFrame={(fId) => setSelectedFrame(fId)}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsPhotoboothModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-champagne-300 bg-gradient-to-r from-amber-50 via-champagne-50 to-rose-50 hover:from-amber-100 hover:to-rose-100 text-champagne-950 font-bold text-xs shadow-xs transition active:scale-[0.98] group"
                      >
                        <Sparkles className="w-4 h-4 text-champagne-700 group-hover:rotate-12 transition-transform" />
                        <span>✨ Ambil Strip Photobooth (5 Gaya Pilihan)</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          ref={cameraInputRef}
                          type="file"
                          accept="image/*"
                          capture="user"
                          onClick={(e) => {
                            (e.target as HTMLInputElement).value = '';
                          }}
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onClick={(e) => {
                            (e.target as HTMLInputElement).value = '';
                          }}
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border border-warm-200 bg-white hover:bg-champagne-50 hover:border-champagne-300 transition text-warm-800 group"
                        >
                          <div className="w-8 h-8 rounded-full bg-champagne-100 group-hover:bg-champagne-200 flex items-center justify-center text-champagne-700 transition">
                            <Camera className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium">Ambil Selfie</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border border-warm-200 bg-white hover:bg-warm-100 hover:border-warm-300 transition text-warm-800 group"
                        >
                          <div className="w-8 h-8 rounded-full bg-warm-200 flex items-center justify-center text-warm-700 transition">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium">Pilih Gambar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Field 4: Voice Note Recorder */}
                <div className="pt-1">
                  <VoiceRecorder onChange={(audio) => setVoiceBase64(audio)} />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-champagne-600 via-champagne-500 to-champagne-600 hover:from-champagne-700 hover:to-champagne-600 text-white font-medium text-sm tracking-wide shadow-champagne transition-transform duration-150 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 gpu-layer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Menyimpan memori...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 fill-current" />
                      <span>Hantar Ucapan</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. In-Page Photobooth Studio Modal */}
      {isPhotoboothModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl max-h-[94dvh] overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] bg-[#FAF8F5] rounded-3xl p-4 sm:p-7 shadow-2xl border border-champagne-300 relative">
            <PhotoboothStudio
              eventInfo={eventDetails}
              onClose={() => setIsPhotoboothModalOpen(false)}
              onAttachToGuestbook={handlePhotoboothComplete}
              isModal
            />
          </div>
        </div>
      )}
    </div>
  );
}
