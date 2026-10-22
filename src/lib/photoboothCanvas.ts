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
 * Draws cute Y2K 4-pointed sparkle star
 */
function drawY2KStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
  glow: boolean = false
) {
  ctx.save();
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.lineTo(
      cx + Math.cos(angle + Math.PI / 4) * (r * 0.22),
      cy + Math.sin(angle + Math.PI / 4) * (r * 0.22)
    );
  }
  ctx.closePath();
  ctx.fill();

  // Little center white gleam
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Draws a cute vector heart with optional shine
 */
function drawCuteHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  withHighlight: boolean = true
) {
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

  if (withHighlight) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(x - size * 0.22, y + size * 0.26, size * 0.1, size * 0.05, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Draws a cute coquette ribbon bow with flowing tails
 */
function drawCoquetteBow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;

  // Left loop
  ctx.beginPath();
  ctx.ellipse(cx - size * 0.75, cy, size * 0.7, size * 0.38, -Math.PI / 7, 0, Math.PI * 2);
  ctx.fill();

  // Right loop
  ctx.beginPath();
  ctx.ellipse(cx + size * 0.75, cy, size * 0.7, size * 0.38, Math.PI / 7, 0, Math.PI * 2);
  ctx.fill();

  // Inner loop hole cutouts
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.ellipse(cx - size * 0.75, cy, size * 0.28, size * 0.15, -Math.PI / 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + size * 0.75, cy, size * 0.28, size * 0.15, Math.PI / 7, 0, Math.PI * 2);
  ctx.fill();

  // Center knot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.38, 0, Math.PI * 2);
  ctx.fill();

  // Flowing ribbon tails
  ctx.beginPath();
  ctx.moveTo(cx - 3, cy + 4);
  ctx.quadraticCurveTo(cx - size * 0.6, cy + size * 1.1, cx - size * 0.9, cy + size * 1.4);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 3, cy + 4);
  ctx.quadraticCurveTo(cx + size * 0.6, cy + size * 1.1, cx + size * 0.9, cy + size * 1.4);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws a pair of cute red cherries with green stems and leaves
 */
function drawCherries(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  // Green stems
  ctx.strokeStyle = '#4ADE80';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(cx, cy - size * 1.1);
  ctx.quadraticCurveTo(cx - size * 0.5, cy - size * 0.5, cx - size * 0.6, cy + size * 0.2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy - size * 1.1);
  ctx.quadraticCurveTo(cx + size * 0.5, cy - size * 0.5, cx + size * 0.6, cy + size * 0.2);
  ctx.stroke();

  // Little green leaf
  ctx.fillStyle = '#22C55E';
  ctx.beginPath();
  ctx.ellipse(cx + size * 0.3, cy - size * 0.85, size * 0.35, size * 0.18, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Left red cherry
  const leftX = cx - size * 0.6;
  const cherryY = cy + size * 0.4;
  ctx.fillStyle = '#E11D48';
  ctx.beginPath();
  ctx.arc(leftX, cherryY, size * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // Left shine
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(leftX - size * 0.18, cherryY - size * 0.18, size * 0.16, 0, Math.PI * 2);
  ctx.fill();

  // Right red cherry
  const rightX = cx + size * 0.6;
  ctx.fillStyle = '#E11D48';
  ctx.beginPath();
  ctx.arc(rightX, cherryY, size * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // Right shine
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(rightX - size * 0.18, cherryY - size * 0.18, size * 0.16, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws a cute daisy blossom with white petals and yellow center
 */
function drawDaisy(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  const petalCount = 8;
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 4;

  for (let i = 0; i < petalCount; i++) {
    const angle = (i * Math.PI * 2) / petalCount;
    const px = cx + Math.cos(angle) * size * 0.6;
    const py = cy + Math.sin(angle) * size * 0.6;
    ctx.beginPath();
    ctx.ellipse(px, py, size * 0.45, size * 0.28, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  // Yellow center with happy blush
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#FBBF24';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Happy smiley face inside daisy center
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  // Left eye
  ctx.beginPath();
  ctx.arc(cx - size * 0.14, cy - size * 0.06, 1.2, 0, Math.PI * 2);
  ctx.fillStyle = '#78350F';
  ctx.fill();
  // Right eye
  ctx.beginPath();
  ctx.arc(cx + size * 0.14, cy - size * 0.06, 1.2, 0, Math.PI * 2);
  ctx.fill();
  // Smile
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.2, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws a fluffy pastel cloud
 */
function drawFluffyCloud(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(186, 230, 253, 0.4)';
  ctx.shadowBlur = 8;

  ctx.beginPath();
  ctx.arc(cx - 18 * scale, cy, 14 * scale, 0, Math.PI * 2);
  ctx.arc(cx - 6 * scale, cy - 10 * scale, 18 * scale, 0, Math.PI * 2);
  ctx.arc(cx + 12 * scale, cy - 8 * scale, 16 * scale, 0, Math.PI * 2);
  ctx.arc(cx + 22 * scale, cy, 13 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Cute pink cheeks
  ctx.fillStyle = '#FDA4AF';
  ctx.beginPath();
  ctx.arc(cx - 12 * scale, cy + 4 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.arc(cx + 14 * scale, cy + 4 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws cute translucent washi tape strip across a corner
 */
function drawWashiTape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  angle: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.fillStyle = color;
  ctx.fillRect(-width / 2, -height / 2, width, height);
  // Tape serrated / zigzag edges
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-width / 2, -height / 2, width, height);
  ctx.restore();
}

/**
 * Draws a cute modern barcode with mini heart
 */
function drawCuteBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) {
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
 * Generates a full high-resolution Gen-Z photobooth strip on canvas
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

  // High-resolution Canvas (Crisp 720px width)
  const STRIP_WIDTH = 720;
  const numPhotos = Math.max(photos.length, 3);

  // Photo dimensions (4:3 aspect ratio landscape frames)
  const PADDING_X = 48;
  const PHOTO_WIDTH = STRIP_WIDTH - PADDING_X * 2; // 624px
  const PHOTO_HEIGHT = Math.round((PHOTO_WIDTH * 3) / 4); // 468px
  const PHOTO_GAP = 30;

  // Header & Footer Heights
  const HEADER_HEIGHT = 150;
  const FOOTER_HEIGHT = 290;

  const STRIP_HEIGHT = HEADER_HEIGHT + numPhotos * PHOTO_HEIGHT + (numPhotos - 1) * PHOTO_GAP + FOOTER_HEIGHT;

  const canvas = document.createElement('canvas');
  canvas.width = STRIP_WIDTH;
  canvas.height = STRIP_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2d context for photobooth canvas');
  }

  // 1. Draw Themed Background
  if (theme.id === 'coquette-cherry') {
    // Sweet strawberry milk pastel gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, STRIP_HEIGHT);
    bgGrad.addColorStop(0, '#FFF0F5');
    bgGrad.addColorStop(0.3, '#FFE4EC');
    bgGrad.addColorStop(0.7, '#FFF0F5');
    bgGrad.addColorStop(1, '#FCE7F3');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    // Subtle polka dot pattern
    ctx.fillStyle = 'rgba(244, 114, 182, 0.12)';
    for (let dx = 30; dx < STRIP_WIDTH; dx += 40) {
      for (let dy = 30; dy < STRIP_HEIGHT; dy += 40) {
        ctx.beginPath();
        ctx.arc(dx, dy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Outer scalloped/soft border
    ctx.strokeStyle = '#FDA4AF';
    ctx.lineWidth = 3;
    roundedRect(ctx, 16, 16, STRIP_WIDTH - 32, STRIP_HEIGHT - 32, 28);
    ctx.stroke();
  } else if (theme.id === 'lavender-stars') {
    // Dreamy fairy lilac gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, STRIP_HEIGHT);
    bgGrad.addColorStop(0, '#F5EEFD');
    bgGrad.addColorStop(0.5, '#EDE9FE');
    bgGrad.addColorStop(1, '#FCE7F3');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    // Floating little sparkles in background
    for (let sy = 80; sy < STRIP_HEIGHT - 80; sy += 120) {
      drawY2KStar(ctx, 28, sy, 8, '#C084FC', true);
      drawY2KStar(ctx, STRIP_WIDTH - 28, sy + 60, 8, '#C084FC', true);
    }

    ctx.strokeStyle = '#D8B4FE';
    ctx.lineWidth = 3;
    roundedRect(ctx, 16, 16, STRIP_WIDTH - 32, STRIP_HEIGHT - 32, 28);
    ctx.stroke();
  } else if (theme.id === 'matcha-butter') {
    // Butter cream to matcha pastel
    const bgGrad = ctx.createLinearGradient(0, 0, 0, STRIP_HEIGHT);
    bgGrad.addColorStop(0, '#FEF9C3');
    bgGrad.addColorStop(0.4, '#FFFBEB');
    bgGrad.addColorStop(0.8, '#F0FDF4');
    bgGrad.addColorStop(1, '#DCFCE7');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    ctx.strokeStyle = '#86EFAC';
    ctx.lineWidth = 3;
    roundedRect(ctx, 16, 16, STRIP_WIDTH - 32, STRIP_HEIGHT - 32, 28);
    ctx.stroke();
  } else if (theme.id === 'baby-blue-pop') {
    // Baby blue sky to peach sunset ombre
    const bgGrad = ctx.createLinearGradient(0, 0, 0, STRIP_HEIGHT);
    bgGrad.addColorStop(0, '#E0F2FE');
    bgGrad.addColorStop(0.5, '#F0F9FF');
    bgGrad.addColorStop(1, '#FFE4E6');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    // Fluffy clouds at corners
    drawFluffyCloud(ctx, 45, 50, 0.9);
    drawFluffyCloud(ctx, STRIP_WIDTH - 50, 50, 0.9);

    ctx.strokeStyle = '#7DD3FC';
    ctx.lineWidth = 3;
    roundedRect(ctx, 16, 16, STRIP_WIDTH - 32, STRIP_HEIGHT - 32, 28);
    ctx.stroke();
  } else {
    // Cyber Pop & Pink
    const bgGrad = ctx.createLinearGradient(0, 0, 0, STRIP_HEIGHT);
    bgGrad.addColorStop(0, '#111216');
    bgGrad.addColorStop(0.5, '#161822');
    bgGrad.addColorStop(1, '#111216');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    // Neon pink cyber lines
    ctx.strokeStyle = 'rgba(255, 46, 147, 0.7)';
    ctx.lineWidth = 2.5;
    roundedRect(ctx, 16, 16, STRIP_WIDTH - 32, STRIP_HEIGHT - 32, 24);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(226, 232, 240, 0.25)';
    ctx.lineWidth = 1;
    roundedRect(ctx, 24, 24, STRIP_WIDTH - 48, STRIP_HEIGHT - 48, 18);
    ctx.stroke();
  }

  // 2. Draw Header
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (theme.id === 'coquette-cherry') {
    drawCoquetteBow(ctx, STRIP_WIDTH / 2, 44, 18, '#E11D48');
    drawCherries(ctx, 75, 48, 14);
    drawCherries(ctx, STRIP_WIDTH - 75, 48, 14);

    ctx.fillStyle = '#E11D48';
    ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('୨ৎ  STRAWBERRY MILK PHOTOBOOTH  ୨ৎ', STRIP_WIDTH / 2, 78);

    ctx.fillStyle = '#9F1239';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, 108);
  } else if (theme.id === 'lavender-stars') {
    drawY2KStar(ctx, STRIP_WIDTH / 2 - 130, 48, 14, '#9333EA', true);
    drawY2KStar(ctx, STRIP_WIDTH / 2 + 130, 48, 14, '#9333EA', true);

    ctx.fillStyle = '#9333EA';
    ctx.font = '600 12px monospace';
    ctx.fillText('[● REC]  HARU DREAM EDITION  ★  00:26', STRIP_WIDTH / 2, 50);

    ctx.fillStyle = '#581C87';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, 90);

    ctx.fillStyle = '#9333EA';
    ctx.font = 'italic 14px Georgia, serif';
    ctx.fillText('★ main character energy • starry vibes ★', STRIP_WIDTH / 2, 120);
  } else if (theme.id === 'matcha-butter') {
    drawDaisy(ctx, 70, 52, 18);
    drawDaisy(ctx, STRIP_WIDTH - 70, 52, 18);
    drawDaisy(ctx, STRIP_WIDTH / 2, 40, 16);

    ctx.fillStyle = '#4D7C0F';
    ctx.font = '700 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('✿  SUNNY MATCHA & DAISY CLUB  ✿', STRIP_WIDTH / 2, 75);

    ctx.fillStyle = '#365314';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, 106);
  } else if (theme.id === 'baby-blue-pop') {
    ctx.fillStyle = '#0284C7';
    ctx.font = '700 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('☁️  LIFE4CUTS CLOUD 9 EDITION  ☁️', STRIP_WIDTH / 2, 54);

    ctx.fillStyle = '#0369A1';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, 90);

    ctx.fillStyle = '#0284C7';
    ctx.font = 'italic 14px Georgia, serif';
    ctx.fillText('♡ best day ever with you ♡', STRIP_WIDTH / 2, 118);
  } else {
    // Cyber Pop & Pink
    drawY2KStar(ctx, STRIP_WIDTH / 2 - 140, 52, 12, '#FF2E93', true);
    drawY2KStar(ctx, STRIP_WIDTH / 2 + 140, 52, 12, '#FF2E93', true);

    ctx.fillStyle = '#FF2E93';
    ctx.font = '700 12px monospace';
    ctx.fillText('// CYBER ARCHIVE // 08.07.26 // COOL KIDS CLUB', STRIP_WIDTH / 2, 52);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 30px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(eventInfo.welcomeTitle.toUpperCase(), STRIP_WIDTH / 2, 92);
  }

  // 3. Draw Photo Frames
  let currentY = HEADER_HEIGHT;

  for (let i = 0; i < numPhotos; i++) {
    const photoSrc = photos[i] || photos[0];
    const slotX = PADDING_X;
    const slotY = currentY;

    // Draw Frame Background & Drop Shadow
    ctx.save();
    if (theme.id === 'coquette-cherry') {
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(244, 114, 182, 0.35)';
      ctx.shadowBlur = 14;
      roundedRect(ctx, slotX - 6, slotY - 6, PHOTO_WIDTH + 12, PHOTO_HEIGHT + 12, 22);
      ctx.fill();

      // Cute washi tape on alternating top corners
      if (i % 2 === 0) {
        drawWashiTape(ctx, slotX + 18, slotY - 4, 46, 16, -14, 'rgba(254, 205, 211, 0.85)');
      } else {
        drawWashiTape(ctx, slotX + PHOTO_WIDTH - 18, slotY - 4, 46, 16, 14, 'rgba(254, 205, 211, 0.85)');
      }

      // Cute mini heart in bottom corner
      drawCuteHeart(ctx, slotX + PHOTO_WIDTH - 20, slotY + PHOTO_HEIGHT - 6, 14, '#E11D48');
    } else if (theme.id === 'lavender-stars') {
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(147, 51, 234, 0.25)';
      ctx.shadowBlur = 14;
      roundedRect(ctx, slotX - 6, slotY - 6, PHOTO_WIDTH + 12, PHOTO_HEIGHT + 12, 22);
      ctx.fill();

      // Y2K sparkle on corner
      drawY2KStar(ctx, slotX + PHOTO_WIDTH - 16, slotY + 16, 10, '#C084FC', true);
    } else if (theme.id === 'matcha-butter') {
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(101, 163, 13, 0.25)';
      ctx.shadowBlur = 14;
      roundedRect(ctx, slotX - 6, slotY - 6, PHOTO_WIDTH + 12, PHOTO_HEIGHT + 12, 22);
      ctx.fill();

      // Cute daisy sticker on corner
      if (i === 0 || i === numPhotos - 1) {
        drawDaisy(ctx, slotX + 16, slotY + 16, 12);
      }
    } else if (theme.id === 'baby-blue-pop') {
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(2, 132, 199, 0.25)';
      ctx.shadowBlur = 14;
      roundedRect(ctx, slotX - 6, slotY - 6, PHOTO_WIDTH + 12, PHOTO_HEIGHT + 12, 22);
      ctx.fill();

      // Cloud sticker
      if (i % 2 === 1) {
        drawFluffyCloud(ctx, slotX + PHOTO_WIDTH - 24, slotY + 14, 0.5);
      }
    } else {
      // Cyber Pop & Pink
      ctx.fillStyle = '#1E2028';
      ctx.strokeStyle = '#FF2E93';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(255, 46, 147, 0.4)';
      ctx.shadowBlur = 12;
      roundedRect(ctx, slotX - 4, slotY - 4, PHOTO_WIDTH + 8, PHOTO_HEIGHT + 8, 16);
      ctx.fill();
      ctx.stroke();

      drawY2KStar(ctx, slotX + 18, slotY + 18, 9, '#FF2E93', true);
    }
    ctx.restore();

    // Render photo inside rounded clip
    if (photoSrc) {
      try {
        const img = await loadImage(photoSrc);

        ctx.save();
        roundedRect(ctx, slotX, slotY, PHOTO_WIDTH, PHOTO_HEIGHT, 16);
        ctx.clip();

        // Filter
        if (filter && filter.id !== 'original' && filter.canvasFilter !== 'none') {
          try {
            ctx.filter = filter.canvasFilter;
          } catch {
            // ignore
          }
        }

        // Cover fit
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
        console.warn('Failed to draw photo', i, err);
      }
    }

    // Number stamp
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    if (theme.id === 'cyber-heart') {
      ctx.fillStyle = '#FF2E93';
      ctx.font = '700 12px monospace';
      ctx.fillText(`FRAME [0${i + 1}/0${numPhotos}]`, slotX + PHOTO_WIDTH - 12, slotY + PHOTO_HEIGHT - 10);
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '700 12px -apple-system, sans-serif';
      roundedRect(ctx, slotX + PHOTO_WIDTH - 38, slotY + PHOTO_HEIGHT - 26, 28, 18, 6);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`0${i + 1}`, slotX + PHOTO_WIDTH - 18, slotY + PHOTO_HEIGHT - 13);
    }
    ctx.restore();

    currentY += PHOTO_HEIGHT + PHOTO_GAP;
  }

  // 4. Draw Footer
  const footerCenterY = currentY + FOOTER_HEIGHT / 2 - 10;
  ctx.textAlign = 'center';

  if (theme.id === 'coquette-cherry') {
    drawCoquetteBow(ctx, STRIP_WIDTH / 2, footerCenterY - 60, 16, '#E11D48');
    drawCherries(ctx, STRIP_WIDTH / 2 - 120, footerCenterY - 20, 14);
    drawCherries(ctx, STRIP_WIDTH / 2 + 120, footerCenterY - 20, 14);

    ctx.fillStyle = '#9F1239';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, footerCenterY - 20);

    ctx.fillStyle = '#E11D48';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('certified cuties ♡ 100% in love forever', STRIP_WIDTH / 2, footerCenterY + 12);

    ctx.fillStyle = '#BE123C';
    ctx.font = '700 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${eventInfo.date} • ${eventInfo.venue} • ${eventInfo.hashtag}`, STRIP_WIDTH / 2, footerCenterY + 40);

    drawCuteBarcode(ctx, STRIP_WIDTH / 2 - 90, footerCenterY + 65, 180, 22, '#E11D48');
  } else if (theme.id === 'lavender-stars') {
    drawY2KStar(ctx, STRIP_WIDTH / 2, footerCenterY - 60, 16, '#9333EA', true);

    ctx.fillStyle = '#581C87';
    ctx.font = 'bold 32px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, footerCenterY - 20);

    ctx.fillStyle = '#9333EA';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('★ starry love & aesthetic moments ★', STRIP_WIDTH / 2, footerCenterY + 14);

    ctx.fillStyle = '#6B21A8';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${eventInfo.date} • ${eventInfo.venue} • ${eventInfo.hashtag}`, STRIP_WIDTH / 2, footerCenterY + 42);

    drawCuteBarcode(ctx, STRIP_WIDTH / 2 - 90, footerCenterY + 68, 180, 22, '#9333EA');
  } else if (theme.id === 'matcha-butter') {
    drawDaisy(ctx, STRIP_WIDTH / 2, footerCenterY - 55, 18);

    ctx.fillStyle = '#365314';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, footerCenterY - 16);

    ctx.fillStyle = '#4D7C0F';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('happy moments only ✿ so lucky to have you', STRIP_WIDTH / 2, footerCenterY + 15);

    ctx.fillStyle = '#15803D';
    ctx.font = '700 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${eventInfo.date} • ${eventInfo.venue} • ${eventInfo.hashtag}`, STRIP_WIDTH / 2, footerCenterY + 42);

    drawCuteBarcode(ctx, STRIP_WIDTH / 2 - 90, footerCenterY + 68, 180, 22, '#4D7C0F');
  } else if (theme.id === 'baby-blue-pop') {
    drawFluffyCloud(ctx, STRIP_WIDTH / 2, footerCenterY - 55, 1.1);

    ctx.fillStyle = '#0369A1';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.fillText(eventInfo.welcomeTitle, STRIP_WIDTH / 2, footerCenterY - 14);

    ctx.fillStyle = '#0284C7';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('on cloud nine with you ♡ best memories', STRIP_WIDTH / 2, footerCenterY + 16);

    ctx.fillStyle = '#075985';
    ctx.font = '700 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${eventInfo.date} • ${eventInfo.venue} • ${eventInfo.hashtag}`, STRIP_WIDTH / 2, footerCenterY + 44);

    drawCuteBarcode(ctx, STRIP_WIDTH / 2 - 90, footerCenterY + 70, 180, 22, '#0284C7');
  } else {
    // Cyber Pop & Pink
    drawY2KStar(ctx, STRIP_WIDTH / 2, footerCenterY - 55, 16, '#FF2E93', true);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 32px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(eventInfo.welcomeTitle.toUpperCase(), STRIP_WIDTH / 2, footerCenterY - 15);

    ctx.fillStyle = '#FF2E93';
    ctx.font = '700 14px monospace';
    ctx.fillText(`// COOL KIDS CLUB // ${eventInfo.hashtag} // ✦`, STRIP_WIDTH / 2, footerCenterY + 16);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '500 12px monospace';
    ctx.fillText(`${eventInfo.date.toUpperCase()} • ${eventInfo.venue.toUpperCase()}`, STRIP_WIDTH / 2, footerCenterY + 42);

    drawCuteBarcode(ctx, STRIP_WIDTH / 2 - 110, footerCenterY + 68, 220, 24, '#FFFFFF');
  }

  return canvas.toDataURL('image/jpeg', 0.94);
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
