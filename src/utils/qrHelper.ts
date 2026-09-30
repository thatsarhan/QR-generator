import QRCode from 'qrcode';
import { QRConfig } from '../types';

export async function generateQRCodeCanvas(
  canvas: HTMLCanvasElement,
  config: QRConfig,
  size: number = 400
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = size;
  canvas.height = size;

  // Generate QR matrix using qrcode
  const qrData = config.data || 'https://rive.ai';
  const qrObject = QRCode.create(qrData, {
    errorCorrectionLevel: 'H', // High error correction needed for logos
  });

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
    // Top-left: (0,0) to (6,6)
    if (row <= 6 && col <= 6) return true;
    // Top-right: (0, moduleCount-7) to (6, moduleCount-1)
    if (row <= 6 && col >= moduleCount - 7) return true;
    // Bottom-left: (moduleCount-7, 0) to (moduleCount-1, 6)
    if (row >= moduleCount - 7 && col <= 6) return true;
    return false;
  };

  // 2. Draw standard modules (dots/squares/rounded)
  ctx.fillStyle = config.patternColor || '#2F2F35';

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isFinderPattern(row, col)) continue; // Skip finder patterns, draw them separately

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
          ctx.roundRect(x + cellSize * 0.1, y + cellSize * 0.1, cellSize * 0.8, cellSize * 0.8, radius);
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
          ctx.roundRect(x + cellSize * 0.05, y + cellSize * 0.05, cellSize * 0.9, cellSize * 0.9, [cellSize * 0.3, 0, cellSize * 0.3, 0]);
          ctx.fill();
        } else {
          // Default square
          ctx.fillRect(x, y, cellSize * 1.02, cellSize * 1.02);
        }
      }
    }
  }

  // 3. Draw Finder Patterns (Eyes) at (0,0), (0, moduleCount-7), (moduleCount-7, 0)
  const drawEye = (startRow: number, startCol: number) => {
    const x = startCol * cellSize;
    const y = startRow * cellSize;
    const eyeSize = 7 * cellSize;

    ctx.save();
    ctx.fillStyle = config.eyeColor || config.patternColor || '#2F2F35';

    if (config.eyeStyle === 'circle') {
      // Outer ring
      ctx.beginPath();
      ctx.arc(x + eyeSize / 2, y + eyeSize / 2, eyeSize / 2, 0, Math.PI * 2);
      ctx.arc(x + eyeSize / 2, y + eyeSize / 2, eyeSize / 2 - cellSize * 1.5, 0, Math.PI * 2, true);
      ctx.fillStyle = config.eyeColor;
      ctx.fill();

      // Inner dot
      ctx.beginPath();
      ctx.arc(x + eyeSize / 2, y + eyeSize / 2, cellSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (config.eyeStyle === 'rounded') {
      // Outer rounded box matching the reference image
      const radius = cellSize * 2.2;
      ctx.beginPath();
      ctx.roundRect(x, y, eyeSize, eyeSize, radius);
      ctx.roundRect(x + cellSize, y + cellSize, eyeSize - cellSize * 2, eyeSize - cellSize * 2, radius * 0.6);
      ctx.clip('evenodd');
      ctx.fillRect(x, y, eyeSize, eyeSize);
      ctx.restore();

      ctx.save();
      // Inner rounded square dot
      ctx.fillStyle = config.eyeColor;
      ctx.beginPath();
      ctx.roundRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3, cellSize * 1.2);
      ctx.fill();
    } else if (config.eyeStyle === 'leafy') {
      ctx.beginPath();
      ctx.roundRect(x, y, eyeSize, eyeSize, [cellSize * 2, cellSize * 0.5, cellSize * 2, cellSize * 0.5]);
      ctx.rect(x + cellSize * 1.5, y + cellSize * 1.5, eyeSize - cellSize * 3, eyeSize - cellSize * 3);
      ctx.clip('evenodd');
      ctx.fillRect(x, y, eyeSize, eyeSize);
      ctx.restore();

      ctx.save();
      ctx.fillStyle = config.eyeColor;
      ctx.beginPath();
      ctx.roundRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3, cellSize * 1);
      ctx.fill();
    } else {
      // Default square eye
      ctx.beginPath();
      ctx.rect(x, y, eyeSize, eyeSize);
      ctx.rect(x + cellSize * 1.5, y + cellSize * 1.5, eyeSize - cellSize * 3, eyeSize - cellSize * 3);
      ctx.clip('evenodd');
      ctx.fillRect(x, y, eyeSize, eyeSize);
      ctx.restore();

      // Inner box
      ctx.fillStyle = config.eyeColor;
      ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
    }
    ctx.restore();
  };

  drawEye(0, 0);
  drawEye(0, moduleCount - 7);
  drawEye(moduleCount - 7, 0);

  // 4. Draw Logo in Center if provided
  if (config.logoUrl) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const logoFraction = (config.logoSize || 25) / 100;
        const logoSizePx = size * logoFraction;
        const logoX = (size - logoSizePx) / 2;
        const logoY = (size - logoSizePx) / 2;

        ctx.save();

        if (config.logoBg) {
          ctx.fillStyle = config.backgroundColor && !config.isTransparentBg ? config.backgroundColor : '#FFFFFF';
          if (config.logoRound) {
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, logoSizePx / 2 + 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.lineWidth = 2;
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.roundRect(logoX - 6, logoY - 6, logoSizePx + 12, logoSizePx + 12, 12);
            ctx.fill();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
            ctx.shadowBlur = 10;
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
          ctx.roundRect(logoX, logoY, logoSizePx, logoSizePx, config.logoBg ? 8 : 4);
        }
        ctx.clip();

        ctx.drawImage(img, logoX, logoY, logoSizePx, logoSizePx);
        ctx.restore();
        resolve();
      };
      img.onerror = () => {
        resolve(); // Continue even if logo fails
      };
      img.src = config.logoUrl!;
    });
  }
}
