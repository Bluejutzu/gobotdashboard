import type { DBThemeData, ThemeData } from "../types/types";
import supabase from "./client";

export async function getThemes(isPublic = true) {
	try {
		const { data, error } = await supabase
			.from("user_themes")
			.select("*")
			.eq("is_public", isPublic)
			.order("created_at", { ascending: false });

		if (error) throw error;

		return data?.map(formatThemeFromDb) || [];
	} catch (error) {
		console.error("Error fetching themes:", error);
		return [];
	}
}

export async function getUserThemes(userId: string) {
	try {
		const { data, error } = await supabase
			.from("user_themes")
			.select("*")
			.eq("user_id", userId)
			.order("created_at", { ascending: false });

		if (error) throw error;

		return data?.map(formatThemeFromDb) || [];
	} catch (error) {
		console.error("Error fetching user themes:", error);
		return [];
	}
}

export async function saveTheme(theme: DBThemeData) {
	try {
		// Get the current user
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		// Create the theme data with explicit mapping to database column names
		const themeData = {
			name: theme.name,
			primary_color: theme.primary_color, // Map to primary_color instead of primary
			secondary_color: theme.secondary_color, // Map to secondary_color instead of secondary
			accent_color: theme.accent_color, // Map to accent_color instead of accent
			border_radius: theme.border_radius,
			user_id2: user.id,
			is_public: theme.isPublic || false,
			creator_name:
				user.user_metadata?.name ||
				user.user_metadata?.full_name ||
				"Anonymous",
			likes: 0,
		};

		console.log("Saving theme data:", themeData); // Add this for debugging

		const { data, error } = await supabase
			.from("user_themes")
			.insert([themeData])
			.select();

		if (error) {
			console.error("Supabase error:", error);
			throw error;
		}

		return data?.[0] ? formatThemeFromDb(data[0]) : null;
	} catch (error) {
		console.error("Error saving theme:", error);
		return null;
	}
}

export async function updateTheme(
	id: number | string,
	theme: Partial<ThemeData>,
) {
	try {
		const updates = formatThemeForDb(theme as ThemeData);

		const { data, error } = await supabase
			.from("user_themes")
			.update(updates)
			.eq("id", id)
			.select();

		if (error) throw error;

		return data?.[0] ? formatThemeFromDb(data[0]) : null;
	} catch (error) {
		console.error("Error updating theme:", error);
		return null;
	}
}

export async function deleteTheme(id: number | string) {
	try {
		const { error } = await supabase.from("user_themes").delete().eq("id", id);

		if (error) throw error;

		return true;
	} catch (error) {
		console.error("Error deleting theme:", error);
		return false;
	}
}

export async function likeTheme(id: number | string) {
	try {
		// First get the current likes
		const { data: theme, error: fetchError } = await supabase
			.from("user_themes")
			.select("likes")
			.eq("id", id)
			.single();

		if (fetchError) throw fetchError;

		// Then increment the likes
		const { data, error } = await supabase
			.from("user_themes")
			.update({ likes: (theme?.likes || 0) + 1 })
			.eq("id", id)
			.select();

		if (error) throw error;

		return data?.[0] ? formatThemeFromDb(data[0]) : null;
	} catch (error) {
		console.error("Error liking theme:", error);
		return null;
	}
}

// Format theme from database to match our ThemeData interface
export function formatThemeFromDb(theme: any): ThemeData {
	return {
		id: theme.id,
		name: theme.name,
		primary: theme.primary_color, // Map from primary_color to primary
		secondary: theme.secondary_color, // Map from secondary_color to secondary
		accent: theme.accent_color, // Map from accent_color to accent
		borderRadius: theme.border_radius,
		creator: theme.creator_name,
		likes: theme.likes || 0,
		isPublic: theme.is_public || false,
		userId: theme.user_id,
		createdAt: theme.created_at,
	};
}

// Format theme for database to match your database schema
export function formatThemeForDb(theme: Partial<ThemeData>): any {
	const dbTheme: any = {};

	if (theme.name !== undefined) dbTheme.name = theme.name;
	if (theme.primary !== undefined) dbTheme.primary_color = theme.primary;
	if (theme.secondary !== undefined) dbTheme.secondary_color = theme.secondary;
	if (theme.accent !== undefined) dbTheme.accent_color = theme.accent;
	if (theme.borderRadius !== undefined)
		dbTheme.border_radius = theme.borderRadius;
	if (theme.isPublic !== undefined) dbTheme.is_public = theme.isPublic;
	if (theme.userId !== undefined) dbTheme.user_id2 = theme.userId;
	if (theme.creator !== undefined) dbTheme.creator_name = theme.creator;

	return dbTheme;
}
