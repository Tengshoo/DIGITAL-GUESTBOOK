import { PHOTOBOOTH_STRIP_THEMES, PhotoboothStripTheme } from '@/components/Photobooth/stripThemes';
import { PHOTO_FILTERS } from '@/components/PhotoFilterSelector';

export interface EventInfo {
  welcomeTitle: string;
  miniTitle?: string;
  date: string;
  venue: string;
  hashtag: string;
}

/**
 * Helper to load an image from URL or dataURL into an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Draws rounded rectangle path on canvas
 */
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Draws a 4-pointed star / sparkle
 */
function drawSparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.lineTo(
      cx + Math.cos(angle + Math.PI / 4) * (r * 0.3),
      cy + Math.sin(angle + Math.PI / 4) * (r * 0.3)
    );
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Draws a cute vector heart
 */
function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurve = size * 0.3;
  ctx.moveTo(x, y + topCurve);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurve);
  ctx.bezierCurveTo(x - size / 2, y + (size + topCurve) / 2, x, y + size, x, y + size);
  ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurve) / 2, x + size / 2, y + topCurve);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurve);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Draws a cute vector ribbon bow
 */
function drawBow(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // Left loop
  ctx.beginPath();
  ctx.ellipse(cx - size * 0.7, cy, size * 0.65, size * 0.35, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Right loop
  ctx.beginPath();
  ctx.ellipse(cx + size * 0.7, cy, size * 0.65, size * 0.35, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Center knot
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = '#C2185B';
  ctx.fill();

  // Left tail
  ctx.beginPath();
  ctx.moveTo(cx - 2, cy + 4);
  ctx.quadraticCurveTo(cx - size * 0.5, cy + size * 1.1, cx - size * 0.8, cy + size * 1.3);
  ctx.stroke();

  // Right tail
  ctx.beginPath();
  ctx.moveTo(cx + 2, cy + 4);
  ctx.quadraticCurveTo(cx + size * 0.5, cy + size * 1.1, cx + size * 0.8, cy + size * 1.3);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws botanical olive/eucalyptus leaves
 */
function drawBotanicalLeaves(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  // Stem
  ctx.beginPath();
  ctx.moveTo(cx - 30 * scale, cy);
  ctx.quadraticCurveTo(cx, cy - 8 * scale, cx + 30 * scale, cy);
  ctx.stroke();

  // Left leaflets
  [-20, -10, 0, 10, 20].forEach((ox, idx) => {
    ctx.beginPath();
    const leafY = idx % 2 === 0 ? cy - 8 * scale : cy + 8 * scale;
    ctx.ellipse(cx + ox * scale, leafY, 6 * scale, 3 * scale, (idx % 2 === 0 ? -1 : 1) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Draws a modern barcode graphic
 */
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  let curX = x;
  const barWidths = [2, 1, 3, 1, 4, 2, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 1, 2, 4, 1, 2];
  let i = 0;
  while (curX < x + width && i < barWidths.length * 4) {
    const w = barWidths[i % barWidths.length];
    if (i % 2 === 0) {
      ctx.fillRect(curX, y, Math.min(w, x + width - curX), height);
    }
    curX += w + 2;
    i++;
  }
  ctx.restore();
}

/**
 * Generates a full high-resolution photobooth strip on canvas
 */
export async function generatePhotoboothStripCanvas(
  photos: string[],
  themeId: PhotoboothStripTheme['id'],
  filterId: string = 'original',
  eventInfo: EventInfo = {
    welcomeTitle: 'Arman & Farah',
    miniTitle: 'Majlis Perkahwinan',
    date: '08 Jul 2026',
    venue: 'Hotel memoira',
    hashtag: '#ArmanFarah',
  }
): Promise<string> {
  const theme = PHOTOBOOTH_STRIP_THEMES.find((t) => t.id === themeId) || PHOTOBOOTH_STRIP_THEMES[0];
  const filter = PHOTO_FILTERS.find((f) => f.id === filterId);

  // Setup Canvas Dimensions (Crisp 720px width, suitable for mobile sharing and print)
  const STRIP_WIDTH = 720;
  const numPhotos = Math.max(photos.length, 3);
  
  // Photo dimensions (4:3 aspect ratio landscape frames)
  const PADDING_X = 48;
  const PHOTO_WIDTH = STRIP_WIDTH - PADDING_X * 2; // 624px
  const PHOTO_HEIGHT = Math.round((PHOTO_WIDTH * 3) / 4); // 468px
  const PHOTO_GAP = 28;

  // Header & Footer Heights
  const HEADER_HEIGHT = 140;
  const FOOTER_HEIGHT = 280;

  const STRIP_HEIGHT = HEADER_HEIGHT + numPhotos * PHOTO_HEIGHT + (numPhotos - 1) * PHOTO_GAP + FOOTER_HEIGHT;

  const canvas = document.createElement('canvas');
  canvas.width = STRIP_WIDTH;
  canvas.height = STRIP_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2d context for photobooth canvas');
  }

  // 1. Draw Background
  if (theme.id === 'champagne-gold') {
    // Rich gradient for luxury gold
    const bgGrad = ctx.createLinearGradient(0, 0, 0, STRIP_HEIGHT);
    bgGrad.addColorStop(0, '#1E1813');
    bgGrad.addColorStop(0.5, '#15110E');
    bgGrad.addColorStop(1, '#241D17');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    // Subtle inner gold foil border
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 3;
    roundedRect(ctx, 16, 16, STRIP_WIDTH - 32, STRIP_HEIGHT - 32, 24);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.18)';
    ctx.lineWidth = 1;
    roundedRect(ctx, 24, 24, STRIP_WIDTH - 48, STRIP_HEIGHT - 48, 18);
    ctx.stroke();
  } else if (theme.id === 'blush-romance') {
    // Soft pastel gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, STRIP_HEIGHT);
    bgGrad.addColorStop(0, '#FFF2F6');
    bgGrad.addColorStop(0.5, '#FDE8EF');
    bgGrad.addColorStop(1, '#FFF5F8');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    // Sweet inner border
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.4)';
    ctx.lineWidth = 2;
    roundedRect(ctx, 16, 16, STRIP_WIDTH - 32, STRIP_HEIGHT - 32, 20);
    ctx.stroke();
  } else if (theme.id === 'vintage-film') {
    // Warm retro ivory
    ctx.fillStyle = '#F5F0E6';
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    // Film border with subtle vintage grain line
    ctx.strokeStyle = '#2D241E';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, STRIP_WIDTH - 24, STRIP_HEIGHT - 24);

    // Analog film sprockets along left and right sides
    const sprocketYStep = 56;
    for (let sy = 30; sy < STRIP_HEIGHT - 40; sy += sprocketYStep) {
      ctx.fillStyle = '#2D241E';
      roundedRect(ctx, 18, sy, 14, 24, 3);
      ctx.fill();
      roundedRect(ctx, STRIP_WIDTH - 32, sy, 14, 24, 3);
      ctx.fill();
    }
  } else if (theme.id === 'midnight-noir') {
    // Deep editorial matte black
    ctx.fillStyle = '#0F0F10';
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 16, STRIP_WIDTH - 32, STRIP_HEIGHT - 32);
  } else {
    // Botanical Garden: Soft sage
    const bgGrad = ctx.createLinearGradient(0, 0, 0, STRIP_HEIGHT);
    bgGrad.addColorStop(0, '#EEF4EF');
    bgGrad.addColorStop(1, '#E4ECE5');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    ctx.strokeStyle = '#99B898';
    ctx.lineWidth = 2;
    roundedRect(ctx, 18, 18, STRIP_WIDTH - 36, STRIP_HEIGHT - 36, 16);
    ctx.stroke();
  }

  // 2. Draw Top Header
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (theme.id === 'vintage-film') {
    ctx.fillStyle = '#6B584C';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('• MEMOIRA 35MM FILM • SAFETY FILM • EXP 2026 •', STRIP_WIDTH / 2, 55);

    ctx.fillStyle = '#2D241E';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.fillText(`${eventInfo.welcomeTitle.toUpperCase()}`, STRIP_WIDTH / 2, 90);
  } else if (theme.id === 'champagne-gold') {
    drawSparkle(ctx, STRIP_WIDTH / 2 - 130, 68, 8, '#D4AF37');
    drawSparkle(ctx, STRIP_WIDTH / 2 + 130, 68, 8, '#D4AF37');

    ctx.fillStyle = '#D4AF37';
    ctx.font = '500 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('✦  THE WEDDING CELEBRATION  ✦', STRIP_WIDTH / 2, 50);

    ctx.fillStyle = '#FAF4E8';
    ctx.font = 'bold 26px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, 85);
  } else if (theme.id === 'blush-romance') {
    drawBow(ctx, STRIP_WIDTH / 2, 42, 12, '#DF4F67');

    ctx.fillStyle = '#DF4F67';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('♡  HARU MOMENTS PHOTOBOOTH  ♡', STRIP_WIDTH / 2, 70);

    ctx.fillStyle = '#88304E';
    ctx.font = 'bold 24px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, 98);
  } else if (theme.id === 'midnight-noir') {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '500 11px -apple-system, BlinkMacSystemFont, monospace';
    ctx.fillText('ARCHIVE // ISSUE 01 // WEDDING STRIP', STRIP_WIDTH / 2, 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(eventInfo.welcomeTitle.toUpperCase(), STRIP_WIDTH / 2, 85);
  } else {
    // Botanical Garden
    drawBotanicalLeaves(ctx, STRIP_WIDTH / 2, 45, 1.2, '#52796F');

    ctx.fillStyle = '#2D4A3E';
    ctx.font = 'bold 24px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, 85);
  }

  // 3. Draw Photos
  let currentY = HEADER_HEIGHT;

  for (let i = 0; i < numPhotos; i++) {
    const photoSrc = photos[i] || photos[0]; // fallback to first photo if array is short
    const slotX = PADDING_X;
    const slotY = currentY;

    // Outer photo frame backing & drop shadow
    ctx.save();
    if (theme.id === 'vintage-film') {
      ctx.fillStyle = '#1F1A15';
      roundedRect(ctx, slotX - 4, slotY - 4, PHOTO_WIDTH + 8, PHOTO_HEIGHT + 8, 12);
      ctx.fill();
    } else if (theme.id === 'champagne-gold') {
      ctx.fillStyle = '#261F17';
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
      ctx.lineWidth = 2.5;
      roundedRect(ctx, slotX - 4, slotY - 4, PHOTO_WIDTH + 8, PHOTO_HEIGHT + 8, 14);
      ctx.fill();
      ctx.stroke();

      // Golden corner sparkles on alternating photos
      if (i === 0 || i === numPhotos - 1) {
        drawSparkle(ctx, slotX + 14, slotY + 14, 6, '#D4AF37');
        drawSparkle(ctx, slotX + PHOTO_WIDTH - 14, slotY + PHOTO_HEIGHT - 14, 6, '#D4AF37');
      }
    } else if (theme.id === 'blush-romance') {
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(223, 79, 103, 0.2)';
      ctx.shadowBlur = 12;
      roundedRect(ctx, slotX - 5, slotY - 5, PHOTO_WIDTH + 10, PHOTO_HEIGHT + 10, 16);
      ctx.fill();

      // Cute mini heart sticker on top-right of photos
      drawHeart(ctx, slotX + PHOTO_WIDTH - 18, slotY - 2, 10, '#DF4F67');
    } else if (theme.id === 'midnight-noir') {
      ctx.fillStyle = '#18181B';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;
      roundedRect(ctx, slotX - 2, slotY - 2, PHOTO_WIDTH + 4, PHOTO_HEIGHT + 4, 8);
      ctx.fill();
      ctx.stroke();
    } else {
      // Botanical Garden
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(45, 74, 62, 0.15)';
      ctx.shadowBlur = 10;
      roundedRect(ctx, slotX - 5, slotY - 5, PHOTO_WIDTH + 10, PHOTO_HEIGHT + 10, 14);
      ctx.fill();
    }
    ctx.restore();

    // Load and render photo inside clip
    if (photoSrc) {
      try {
        const img = await loadImage(photoSrc);

        ctx.save();
        roundedRect(ctx, slotX, slotY, PHOTO_WIDTH, PHOTO_HEIGHT, 10);
        ctx.clip();

        // Apply photo filter if present
        if (filter && filter.id !== 'original' && filter.canvasFilter !== 'none') {
          try {
            ctx.filter = filter.canvasFilter;
          } catch {
            // ignore if unsupported
          }
        }

        // Calculate aspect fill (cover)
        const imgRatio = img.width / img.height;
        const targetRatio = PHOTO_WIDTH / PHOTO_HEIGHT;
        let sWidth = img.width;
        let sHeight = img.height;
        let sx = 0;
        let sy = 0;

        if (imgRatio > targetRatio) {
          sWidth = img.height * targetRatio;
          sx = (img.width - sWidth) / 2;
        } else {
          sHeight = img.width / targetRatio;
          sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, slotX, slotY, PHOTO_WIDTH, PHOTO_HEIGHT);
        ctx.restore();
      } catch (err) {
        console.warn('Failed to draw photo slot', i, err);
        // Fallback placeholder
        ctx.fillStyle = '#D6D3D1';
        roundedRect(ctx, slotX, slotY, PHOTO_WIDTH, PHOTO_HEIGHT, 10);
        ctx.fill();
      }
    }

    // Numbering / Frame Index
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    if (theme.id === 'vintage-film') {
      ctx.fillStyle = '#E6C687';
      ctx.font = '600 11px monospace';
      ctx.fillText(`▶ 0${i + 1}A`, slotX + PHOTO_WIDTH - 12, slotY + PHOTO_HEIGHT - 8);
    } else if (theme.id === 'midnight-noir') {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '500 10px monospace';
      ctx.fillText(`FRAME [0${i + 1}/0${numPhotos}]`, slotX + PHOTO_WIDTH - 10, slotY + PHOTO_HEIGHT - 8);
    }
    ctx.restore();

    currentY += PHOTO_HEIGHT + PHOTO_GAP;
  }

  // 4. Draw Bottom Footer
  const footerCenterY = currentY + FOOTER_HEIGHT / 2 - 15;
  ctx.textAlign = 'center';

  if (theme.id === 'vintage-film') {
    ctx.fillStyle = '#2D241E';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, footerCenterY - 45);

    ctx.fillStyle = '#854D0E';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText(`${eventInfo.date} • ${eventInfo.venue}`, STRIP_WIDTH / 2, footerCenterY - 12);

    ctx.fillStyle = '#78350F';
    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(eventInfo.hashtag, STRIP_WIDTH / 2, footerCenterY + 18);

    drawBarcode(ctx, STRIP_WIDTH / 2 - 80, footerCenterY + 45, 160, 24, '#2D241E');
  } else if (theme.id === 'champagne-gold') {
    drawSparkle(ctx, STRIP_WIDTH / 2, footerCenterY - 70, 10, '#D4AF37');

    ctx.fillStyle = '#FAF4E8';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, footerCenterY - 32);

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('Forever & Always', STRIP_WIDTH / 2, footerCenterY + 2);

    ctx.fillStyle = 'rgba(250, 244, 232, 0.8)';
    ctx.font = '500 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${eventInfo.date} • ${eventInfo.venue} • ${eventInfo.hashtag}`, STRIP_WIDTH / 2, footerCenterY + 32);

    ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.font = '400 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('MEMOIRA DIGITAL GUESTBOOK PHOTOBOOTH', STRIP_WIDTH / 2, footerCenterY + 62);
  } else if (theme.id === 'blush-romance') {
    drawHeart(ctx, STRIP_WIDTH / 2 - 110, footerCenterY - 35, 12, '#DF4F67');
    drawHeart(ctx, STRIP_WIDTH / 2 + 110, footerCenterY - 35, 12, '#DF4F67');

    ctx.fillStyle = '#88304E';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, footerCenterY - 35);

    ctx.fillStyle = '#DF4F67';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('sweet memories with you ♡ happily ever after', STRIP_WIDTH / 2, footerCenterY - 4);

    ctx.fillStyle = '#9D425E';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${eventInfo.date} • ${eventInfo.venue}`, STRIP_WIDTH / 2, footerCenterY + 26);

    ctx.fillStyle = '#C2185B';
    ctx.font = '700 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(eventInfo.hashtag, STRIP_WIDTH / 2, footerCenterY + 52);
  } else if (theme.id === 'midnight-noir') {
    drawBarcode(ctx, STRIP_WIDTH / 2 - 120, footerCenterY - 60, 240, 28, '#FFFFFF');

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 26px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(eventInfo.welcomeTitle.toUpperCase(), STRIP_WIDTH / 2, footerCenterY - 5);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '500 12px monospace';
    ctx.fillText(`DATE: ${eventInfo.date.toUpperCase()} // VENUE: ${eventInfo.venue.toUpperCase()}`, STRIP_WIDTH / 2, footerCenterY + 28);

    ctx.fillStyle = '#A3A3A3';
    ctx.font = '500 12px monospace';
    ctx.fillText(`${eventInfo.hashtag} // MEMOIRA LIVE WALL ARCHIVE`, STRIP_WIDTH / 2, footerCenterY + 50);
  } else {
    // Botanical Garden
    drawBotanicalLeaves(ctx, STRIP_WIDTH / 2, footerCenterY - 55, 1.3, '#52796F');

    ctx.fillStyle = '#2D4A3E';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, footerCenterY - 20);

    ctx.fillStyle = '#52796F';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('Growing in love together • Forever begins here', STRIP_WIDTH / 2, footerCenterY + 12);

    ctx.fillStyle = '#3E5C46';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${eventInfo.date} • ${eventInfo.venue} • ${eventInfo.hashtag}`, STRIP_WIDTH / 2, footerCenterY + 38);
  }

  // Return crisp high-res data URL
  return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Triggers instant browser download of the photobooth strip
 */
export function downloadStripImage(dataUrl: string, filename: string = 'Arman_Farah_Photobooth_Strip.jpg') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
