import QRCode from 'qrcode';
import { QRConfig } from '../types';

export async function generateQRCodeCanvas(
  canvas: HTMLCanvasElement,
  config: QRConfig,
  size: number = 500
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = size;
  canvas.height = size;

  // Determine error correction level (force H if logo is present)
  let ecLevel = config.errorCorrectionLevel || 'M';
  if (config.logoUrl) {
    ecLevel = 'H';
  }

  // Generate QR matrix using qrcode
  const qrData = config.data || 'https://go.rive.ai/brochure';
  let qrObject;
  try {
    qrObject = QRCode.create(qrData, {
      errorCorrectionLevel: ecLevel,
    });
  } catch (e) {
    qrObject = QRCode.create('https://go.rive.ai', { errorCorrectionLevel: 'M' });
  }

  const qrModule = qrObject.modules;
  const moduleCount = qrModule.size;
  const cellSize = size / moduleCount;

  // 1. Background
  if (config.isTransparentBg) {
    ctx.clearRect(0, 0, size, size);
  } else {
    ctx.fillStyle = config.backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
  }

  // Helper to check if a module is part of the 3 finder patterns (eyes)
  const isFinderPattern = (row: number, col: number) => {
    if (row <= 6 && col <= 6) return true;
    if (row <= 6 && col >= moduleCount - 7) return true;
    if (row >= moduleCount - 7 && col <= 6) return true;
    return false;
  };

  // 2. Draw standard modules (dots/squares/rounded/extra-rounded/classy/diamond)
  ctx.fillStyle = config.patternColor || '#0E3415';

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isFinderPattern(row, col)) continue;

      if (qrModule.get(row, col)) {
        const x = col * cellSize;
        const y = row * cellSize;

        if (config.patternStyle === 'dots') {
          ctx.beginPath();
          ctx.arc(
            x + cellSize / 2,
            y + cellSize / 2,
            (cellSize / 2) * 0.85,
            0,
            Math.PI * 2
          );
          ctx.fill();
        } else if (config.patternStyle === 'rounded') {
          const radius = cellSize * 0.35;
          ctx.beginPath();
          ctx.roundRect(x + cellSize * 0.08, y + cellSize * 0.08, cellSize * 0.84, cellSize * 0.84, radius);
          ctx.fill();
        } else if (config.patternStyle === 'extra-rounded') {
          const radius = cellSize * 0.5;
          ctx.beginPath();
          ctx.roundRect(x + cellSize * 0.05, y + cellSize * 0.05, cellSize * 0.9, cellSize * 0.9, radius);
          ctx.fill();
        } else if (config.patternStyle === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(x + cellSize / 2, y);
          ctx.lineTo(x + cellSize, y + cellSize / 2);
          ctx.lineTo(x + cellSize / 2, y + cellSize);
          ctx.lineTo(x, y + cellSize / 2);
          ctx.closePath();
          ctx.fill();
        } else if (config.patternStyle === 'classy') {
          ctx.beginPath();
          ctx.roundRect(x + cellSize * 0.05, y + cellSize * 0.05, cellSize * 0.9, cellSize * 0.9, [cellSize * 0.35, 0, cellSize * 0.35, 0]);
          ctx.fill();
        } else {
          // Default square
          ctx.fillRect(x, y, cellSize * 1.02, cellSize * 1.02);
        }
      }
    }
  }

  // 3. Draw Finder Patterns (Eyes) with separate outer frame and inner dot colors
  const drawEye = (startRow: number, startCol: number) => {
    const x = startCol * cellSize;
    const y = startRow * cellSize;
    const eyeSize = 7 * cellSize;

    const outerColor = config.isEyesLinked ? (config.patternColor || '#0E3415') : (config.eyeOuterColor || config.patternColor || '#0E3415');
    const innerColor = config.isEyesLinked ? (config.patternColor || '#0E3415') : (config.eyeInnerColor || config.patternColor || '#0E3415');

    ctx.save();

    if (config.eyeStyle === 'circle') {
      // Outer ring
      ctx.fillStyle = outerColor;
      ctx.beginPath();
      ctx.arc(x + eyeSize / 2, y + eyeSize / 2, eyeSize / 2, 0, Math.PI * 2);
      ctx.arc(x + eyeSize / 2, y + eyeSize / 2, eyeSize / 2 - cellSize * 1.5, 0, Math.PI * 2, true);
      ctx.fill();

      // Inner dot
      ctx.fillStyle = innerColor;
      ctx.beginPath();
      ctx.arc(x + eyeSize / 2, y + eyeSize / 2, cellSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (config.eyeStyle === 'rounded') {
      // Outer rounded frame
      ctx.fillStyle = outerColor;
      const radius = cellSize * 2.2;
      ctx.beginPath();
      ctx.roundRect(x, y, eyeSize, eyeSize, radius);
      ctx.roundRect(x + cellSize, y + cellSize, eyeSize - cellSize * 2, eyeSize - cellSize * 2, radius * 0.6);
      ctx.clip('evenodd');
      ctx.fillRect(x, y, eyeSize, eyeSize);
      ctx.restore();

      ctx.save();
      // Inner rounded square dot
      ctx.fillStyle = innerColor;
      ctx.beginPath();
      ctx.roundRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3, cellSize * 1.2);
      ctx.fill();
    } else {
      // Default square eye
      ctx.fillStyle = outerColor;
      ctx.beginPath();
      ctx.rect(x, y, eyeSize, eyeSize);
      ctx.rect(x + cellSize * 1.5, y + cellSize * 1.5, eyeSize - cellSize * 3, eyeSize - cellSize * 3);
      ctx.clip('evenodd');
      ctx.fillRect(x, y, eyeSize, eyeSize);
      ctx.restore();

      ctx.save();
      ctx.fillStyle = innerColor;
      ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
    }
    ctx.restore();
  };

  drawEye(0, 0);
  drawEye(0, moduleCount - 7);
  drawEye(moduleCount - 7, 0);

  // 4. Draw Logo in Center if provided (size capped at 25-30% with white plate option)
  if (config.logoUrl) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const logoFraction = Math.min(Math.max(config.logoSize || 22, 15), 28) / 100;
        const logoSizePx = size * logoFraction;
        const logoX = (size - logoSizePx) / 2;
        const logoY = (size - logoSizePx) / 2;

        ctx.save();

        if (config.logoBg) {
          // White plate behind logo
          ctx.fillStyle = config.backgroundColor && !config.isTransparentBg ? config.backgroundColor : '#FFFFFF';
          if (config.logoRound) {
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, logoSizePx / 2 + 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
            ctx.shadowBlur = 12;
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.lineWidth = 2;
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.roundRect(logoX - 8, logoY - 8, logoSizePx + 16, logoSizePx + 16, 14);
            ctx.fill();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
            ctx.shadowBlur = 12;
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }

        // Clip for logo image
        ctx.beginPath();
        if (config.logoRound && !config.logoBg) {
          ctx.arc(size / 2, size / 2, logoSizePx / 2, 0, Math.PI * 2);
        } else {
          ctx.roundRect(logoX, logoY, logoSizePx, logoSizePx, 8);
        }
        ctx.clip();

        ctx.drawImage(img, logoX, logoY, logoSizePx, logoSizePx);
        ctx.restore();
        resolve();
      };
      img.onerror = () => {
        resolve();
      };
      img.src = config.logoUrl!;
    });
  }
}
