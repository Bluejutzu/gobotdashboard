/**
 * Converts a hex color to HSL format for CSS variables
 * @param hex Hex color code (e.g., #0ea5e9)
 * @returns HSL values as a string (e.g., "201 100% 50%")
 */
export function hexToHSL(hex: string): string {
	// Remove the # if present
	hex = hex.replace("#", "");

	// Convert hex to RGB
	const r = Number.parseInt(hex.substring(0, 2), 16) / 255;
	const g = Number.parseInt(hex.substring(2, 4), 16) / 255;
	const b = Number.parseInt(hex.substring(4, 6), 16) / 255;

	// Find the min and max values to calculate the lightness
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	// Calculate the lightness
	let l = (max + min) / 2;

	let h = 0;
	let s = 0;

	if (max !== min) {
		// Calculate the saturation
		s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);

		// Calculate the hue
		if (max === r) {
			h = (g - b) / (max - min) + (g < b ? 6 : 0);
		} else if (max === g) {
			h = (b - r) / (max - min) + 2;
		} else {
			h = (r - g) / (max - min) + 4;
		}

		h = h * 60;
	}

	// Round the values
	h = Math.round(h);
	s = Math.round(s * 100);
	l = Math.round(l * 100);

	return `${h} ${s}% ${l}%`;
}

/**
 * Converts HSL values to a hex color
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @returns Hex color code
 */
export function hslToHex(h: number, s: number, l: number): string {
	s /= 100;
	l /= 100;

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let r = 0,
		g = 0,
		b = 0;

	if (0 <= h && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (60 <= h && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (120 <= h && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (180 <= h && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (240 <= h && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (300 <= h && h < 360) {
		r = c;
		g = 0;
		b = x;
	}

	// Convert to hex
	const toHex = (c: number) => {
		const hex = Math.round((c + m) * 255).toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generates a complementary color for a given hex color
 * @param hex Hex color code
 * @returns Complementary hex color
 */
export function getComplementaryColor(hex: string): string {
	// Remove the # if present
	hex = hex.replace("#", "");

	// Convert hex to RGB
	const r = Number.parseInt(hex.substring(0, 2), 16);
	const g = Number.parseInt(hex.substring(2, 4), 16);
	const b = Number.parseInt(hex.substring(4, 6), 16);

	// Compute complementary color
	const compR = 255 - r;
	const compG = 255 - g;
	const compB = 255 - b;

	// Convert back to hex
	return `#${compR.toString(16).padStart(2, "0")}${compG.toString(16).padStart(2, "0")}${compB.toString(16).padStart(2, "0")}`;
}

/**
 * Darkens a hex color by a given percentage
 * @param hex Hex color code
 * @param percent Percentage to darken (0-100)
 * @returns Darkened hex color
 */
export function darkenColor(hex: string, percent: number): string {
	// Remove the # if present
	hex = hex.replace("#", "");

	// Convert hex to RGB
	const r = Number.parseInt(hex.substring(0, 2), 16);
	const g = Number.parseInt(hex.substring(2, 4), 16);
	const b = Number.parseInt(hex.substring(4, 6), 16);

	// Darken the color
	const darkenAmount = 1 - percent / 100;
	const dr = Math.max(0, Math.floor(r * darkenAmount));
	const dg = Math.max(0, Math.floor(g * darkenAmount));
	const db = Math.max(0, Math.floor(b * darkenAmount));

	// Convert back to hex
	return `#${dr.toString(16).padStart(2, "0")}${dg.toString(16).padStart(2, "0")}${db.toString(16).padStart(2, "0")}`;
}

/**
 * Lightens a hex color by a given percentage
 * @param hex Hex color code
 * @param percent Percentage to lighten (0-100)
 * @returns Lightened hex color
 */
export function lightenColor(hex: string, percent: number): string {
	// Remove the # if present
	hex = hex.replace("#", "");

	// Convert hex to RGB
	const r = Number.parseInt(hex.substring(0, 2), 16);
	const g = Number.parseInt(hex.substring(2, 4), 16);
	const b = Number.parseInt(hex.substring(4, 6), 16);

	// Lighten the color
	const lightenAmount = percent / 100;
	const lr = Math.min(255, Math.floor(r + (255 - r) * lightenAmount));
	const lg = Math.min(255, Math.floor(g + (255 - g) * lightenAmount));
	const lb = Math.min(255, Math.floor(b + (255 - b) * lightenAmount));

	// Convert back to hex
	return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}

/**
 * Checks if a color is light or dark
 * @param hex Hex color code
 * @returns Boolean indicating if the color is light (true) or dark (false)
 */
export function isLightColor(hex: string): boolean {
	// Remove the # if present
	hex = hex.replace("#", "");

	// Convert hex to RGB
	const r = Number.parseInt(hex.substring(0, 2), 16);
	const g = Number.parseInt(hex.substring(2, 4), 16);
	const b = Number.parseInt(hex.substring(4, 6), 16);

	// Calculate the perceived brightness using the formula:
	// (0.299*R + 0.587*G + 0.114*B)
	const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

	// Return true if the color is light (brightness > 0.5)
	return brightness > 0.5;
}

/**
 * Generates a contrasting text color (black or white) based on the background color
 * @param bgHex Background hex color code
 * @returns Contrasting text color (#000000 or #ffffff)
 */
export function getContrastingTextColor(bgHex: string): string {
	return isLightColor(bgHex) ? "#000000" : "#ffffff";
}
