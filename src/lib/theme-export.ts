import type { ThemeData } from "@/lib/types/types";

/**
 * Exports a theme to a JSON file that is downloaded by the browser
 */
export function exportThemeToJson(theme: ThemeData) {
	// Create a JSON string from the theme data
	const themeJson = JSON.stringify(theme, null, 2);

	// Create a blob from the JSON string
	const blob = new Blob([themeJson], { type: "application/json" });

	// Create a URL for the blob
	const url = URL.createObjectURL(blob);

	// Create a link element to trigger the download
	const link = document.createElement("a");
	link.href = url;
	link.download = `${theme.name.toLowerCase().replace(/\s+/g, "-")}-theme.json`;

	// Append the link to the body, click it, and remove it
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	// Clean up the URL
	URL.revokeObjectURL(url);
}

/**
 * Validates that the imported data is a valid theme
 */
export function validateThemeData(data: any): data is ThemeData {
	// Check if the data has the required properties
	if (!data || typeof data !== "object") return false;

	// Check for required string properties
	if (typeof data.name !== "string" || data.name.trim() === "") return false;
	if (typeof data.primary !== "string" || !isValidHexColor(data.primary))
		return false;
	if (typeof data.secondary !== "string" || !isValidHexColor(data.secondary))
		return false;
	if (typeof data.accent !== "string" || !isValidHexColor(data.accent))
		return false;

	// Check for required number properties
	if (typeof data.borderRadius !== "number" || data.borderRadius < 0)
		return false;

	// Check optional category if present
	if (data.category !== undefined && typeof data.category !== "string")
		return false;

	// If we got here, the data is valid
	return true;
}

/**
 * Checks if a string is a valid hex color
 */
function isValidHexColor(color: string): boolean {
	return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Imports a theme from a JSON file
 */
export function importThemeFromJson(file: File): Promise<ThemeData> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event) => {
			try {
				// Parse the JSON data
				const data = JSON.parse(event.target?.result as string);

				// Validate the data
				if (!validateThemeData(data)) {
					reject(new Error("Invalid theme data"));
					return;
				}

				// Generate a new ID for the imported theme
				const theme: ThemeData = {
					...data,
					id: `imported-${Date.now()}`,
				};

				resolve(theme);
			} catch (error) {
				reject(new Error("Failed to parse theme file", { cause: error }));
			}
		};

		reader.onerror = () => {
			reject(new Error("Failed to read theme file"));
		};

		reader.readAsText(file);
	});
}
