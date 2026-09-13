import * as THREE from 'three';

// Cache generated textures so they are only created once
const textureCache: { [key: string]: THREE.CanvasTexture } = {};

/**
 * Generates an organic lush grass turf texture
 */
export function getGrassTexture(): THREE.CanvasTexture {
  if (textureCache['grass']) return textureCache['grass'];

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Base green
    ctx.fillStyle = '#265430';
    ctx.fillRect(0, 0, 512, 512);

    // Multi-tonal grass patches
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const length = 4 + Math.random() * 8;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;

      const greens = ['#2d6a38', '#347a42', '#1e4827', '#3d8b4e', '#459958'];
      ctx.strokeStyle = greens[Math.floor(Math.random() * greens.length)];
      ctx.lineWidth = 1 + Math.random() * 1.5;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  textureCache['grass'] = texture;
  return texture;
}

/**
 * Generates an architectural cobblestone/brick paver texture
 */
export function getPaverTexture(): THREE.CanvasTexture {
  if (textureCache['paver']) return textureCache['paver'];

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Mortar color
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 512, 512);

    const rows = 16;
    const cols = 8;
    const brickH = 512 / rows;
    const brickW = 512 / cols;

    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * (brickW / 2);
      for (let c = -1; c <= cols; c++) {
        const x = c * brickW + offset;
        const y = r * brickH;

        // Subtle variation in paver stone tone
        const brightness = 210 + Math.floor(Math.random() * 35);
        const rTone = brightness + Math.floor(Math.random() * 8);
        const gTone = brightness;
        const bTone = brightness - Math.floor(Math.random() * 12);
        ctx.fillStyle = `rgb(${rTone}, ${gTone}, ${bTone})`;

        // Draw rounded brick paver
        ctx.fillRect(x + 2, y + 2, brickW - 4, brickH - 4);

        // Weathering noise
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        for (let n = 0; n < 8; n++) {
          ctx.fillRect(
            x + 3 + Math.random() * (brickW - 8),
            y + 3 + Math.random() * (brickH - 8),
            Math.random() * 4,
            Math.random() * 4
          );
        }
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 24);
  textureCache['paver'] = texture;
  return texture;
}

/**
 * Generates a polished oak wood parquet texture for classroom interior
 */
export function getOakWoodTexture(): THREE.CanvasTexture {
  if (textureCache['wood']) return textureCache['wood'];

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Warm honey oak base
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, 512, 512);

    // Parquet planks
    const plankH = 32;
    for (let y = 0; y < 512; y += plankH) {
      const shadeOffset = (Math.random() - 0.5) * 20;
      ctx.fillStyle = `rgb(${180 + shadeOffset}, ${83 + shadeOffset / 2}, ${9 + shadeOffset / 4})`;
      ctx.fillRect(0, y, 512, plankH);

      // Wood grain lines
      ctx.fillStyle = 'rgba(120, 53, 15, 0.15)';
      for (let g = 0; g < 6; g++) {
        const grainY = y + Math.random() * plankH;
        ctx.fillRect(0, grainY, 512, 1 + Math.random() * 1.5);
      }

      // Plank seam line
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, y, 512, 1.5);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  textureCache['wood'] = texture;
  return texture;
}

/**
 * Generates an architectural concrete / limestone wall texture
 */
export function getLimestoneTexture(): THREE.CanvasTexture {
  if (textureCache['limestone']) return textureCache['limestone'];

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 512, 512);

    // Stone panel grid lines
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    for (let x = 0; x <= 512; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Subtle stone speckling
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    for (let i = 0; i < 800; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache['limestone'] = texture;
  return texture;
}

/**
 * Generates an interactive Smartboard screen texture
 */
export function getSmartBoardTexture(): THREE.CanvasTexture {
  if (textureCache['smartboard']) return textureCache['smartboard'];

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep modern navy digital board
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, '#0a0f1d');
    grad.addColorStop(1, '#131b2e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Digital UI border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 984, 472);

    // Header bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(24, 24, 976, 60);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('DIGIGURU SMARTBOARD  •  NURSERY FOUNDATION', 50, 65);

    // Math Numbers Visuals
    const numbers = [
      { n: '1', label: 'One Apple', icon: '🍎' },
      { n: '2', label: 'Two Stars', icon: '⭐⭐' },
      { n: '3', label: 'Three Birds', icon: '🐦🐦🐦' },
      { n: '4', label: 'Four Leaves', icon: '🍀🍀🍀🍀' },
      { n: '5', label: 'Five Hearts', icon: '💖💖💖💖💖' },
    ];

    numbers.forEach((item, idx) => {
      const cardX = 60 + idx * 180;
      const cardY = 130;

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, 160, 280, 16);
      ctx.fill();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Number badge
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText(item.n, cardX + 60, cardY + 70);

      // Icon display
      ctx.font = '24px sans-serif';
      ctx.fillText(item.icon, cardX + 20, cardY + 150);

      // Label
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(item.label, cardX + 30, cardY + 240);
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache['smartboard'] = texture;
  return texture;
}
