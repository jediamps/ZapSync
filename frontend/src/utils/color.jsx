export const lightenColor = (hex, percent) => {
  // Ensure hex is valid
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
    return '#A1D2CE'; // fallback to your original light color
  }

  // Remove # if present
  hex = hex.replace('#', '');

  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  // Validate hex length
  if (hex.length !== 6) {
    return '#A1D2CE'; // fallback
  }

  // Parse r, g, b values
  let r, g, b;
  try {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } catch (e) {
    return '#A1D2CE'; // fallback if parsing fails
  }

  // Validate parsed values
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return '#A1D2CE'; // fallback
  }

  // Convert to HSL
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Lighten by percentage (ensure between 0-1)
  const lightPercent = Math.min(1, Math.max(0, percent));
  l = Math.min(0.99, l + (1 - l) * lightPercent);

  // Convert back to RGB
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let newR, newG, newB;
  if (s === 0) {
    newR = newG = newB = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    newR = hue2rgb(p, q, h + 1/3);
    newG = hue2rgb(p, q, h);
    newB = hue2rgb(p, q, h - 1/3);
  }

  // Convert to hex with proper padding
  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
};