import supabase from "@/lib/supabase/client";
import {
	getCachedUserGuilds,
	cacheUserGuilds,
	getCachedBotGuilds,
	cacheBotGuilds,
	invalidateUserGuildsCache,
	invalidateBotGuildsCache,
} from "@/lib/cache-utils";
import type { DiscordPartialGuild, Server } from "../types/types";
import axios from "axios";

const PERMISSION_ADMIN = 0x8;
const PERMISSION_MANAGE_SERVER = 0x20;
const PERMISSION_MANAGE_CHANNELS = 0x10;
const PERMISSION_MANAGE_ROLES = 0x10000000;

const BASE_URL =
	process.env.NODE_ENV === "production"
		? "https://gobotdashboard.vercel.app"
		: "http://localhost:3000";

/**
 * Fetch user's Discord guilds with caching
 */
export async function fetchUserGuilds(
	userId: string,
	superbase_user_id: string,
	forceRefresh = false,
): Promise<DiscordPartialGuild[]> {
	// Try to get from cache first (unless force refresh is requested)
	if (!forceRefresh) {
		const cachedGuilds = await getCachedUserGuilds(userId);
		if (cachedGuilds) {
			return cachedGuilds;
		}
	}

	// If not in cache or force refresh, fetch from Discord API
	try {
		// Get Discord bearer token
		const bearerToken = await axios.post(
			`${BASE_URL}/api/get-token`,
			{
				userId,
				superbase_user_id,
			},
			{
				headers: { "Content-Type": "application/json" },
			},
		);

		console.log(bearerToken, bearerToken.data);

		if (bearerToken.status !== 200) {
			throw new Error("Could not retrieve Discord token", {
				cause: bearerToken.statusText,
			});
		}

		if (!bearerToken) {
			throw new Error("No discord token found");
		}

		// Fetch guilds from Discord API
		const response = await fetch(
			"https://discord.com/api/v10/users/@me/guilds",
			{
				headers: {
					Authorization: `Bearer ${bearerToken}`,
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Discord API error: ${response.status}`);
		}

		const rawDiscordGuilds: DiscordPartialGuild[] = await response.json();
		const discordGuilds = rawDiscordGuilds.filter((guild) => {
			const permInt = Number.parseInt(`${guild.permissions}`, 10);
			return (
				(permInt & PERMISSION_ADMIN) !== 0 ||
				(permInt & PERMISSION_MANAGE_SERVER) !== 0 ||
				(permInt & PERMISSION_MANAGE_CHANNELS) !== 0 ||
				(permInt & PERMISSION_MANAGE_ROLES) !== 0
			);
		});

		await cacheUserGuilds(userId, discordGuilds);

		return discordGuilds;
	} catch (error) {
		console.error("Error fetching user guilds:", error);
		throw error;
	}
}

/**
 * Fetch bot's guilds with caching
 */
export async function fetchBotGuilds(forceRefresh = false): Promise<string[]> {
	// Try to get from cache first (unless force refresh is requested)
	if (!forceRefresh) {
		const cachedGuildIds = await getCachedBotGuilds();
		if (cachedGuildIds) {
			return cachedGuildIds;
		}
	}

	// If not in cache or force refresh, fetch from database
	try {
		const { data: botServers, error } = await supabase
			.from("servers")
			.select("discord_id");

		if (error) {
			throw error;
		}

		const guildIds = botServers?.map((s) => s.discord_id) || [];

		// Cache the results
		await cacheBotGuilds(guildIds);

		return guildIds;
	} catch (error) {
		console.error("Error fetching bot guilds:", error);
		throw error;
	}
}

/**
 * Retrieves a list of Discord servers where the user has administrative or management permissions, including bot presence and server metadata.
 *
 * Fetches the user's guilds and the bot's guild IDs in parallel, filters for servers where the user has sufficient permissions, and formats each server with relevant details such as icon URL, permissions, bot presence, member counts, features, and stickers.
 *
 * @param userId - The Discord user ID.
 * @param superbase_user_id - The corresponding Supabase user ID.
 * @param forceRefresh - If true, bypasses cache and fetches fresh data.
 * @param src - Optional source identifier for logging.
 * @returns An array of formatted {@link Server} objects representing the user's manageable Discord servers.
 *
 * @throws {Error} If fetching guild data fails.
 */
export async function getFormattedServerList(
	userId: string,
	superbase_user_id: string,
	forceRefresh = false,
	src?: string,
): Promise<Server[]> {
	console.log(
		`[GUILD-SERVICE ${src}]: Getting formatted server list for ${userId}, ${superbase_user_id}`,
	);
	try {
		// Fetch user guilds and bot guilds in parallel
		const [discordGuilds, botGuildIds] = await Promise.all([
			fetchUserGuilds(userId, superbase_user_id, forceRefresh),
			fetchBotGuilds(forceRefresh),
		]);

		const botServerIds = new Set(botGuildIds);

		return discordGuilds
			.filter((guild) => {
				const permInt = Number.parseInt(`${guild.permissions}`, 10);
				return (permInt & 0x8) !== 0 || (permInt & 0x20) !== 0;
			})

			.map((guild) => ({
				id: guild.id,
				name: guild.name,
				icon: guild.icon
					? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
					: null,
				permissions: Number.parseInt(`${guild.permissions}`, 10),
				botPresent: botServerIds.has(guild.id),
				approximate_member_count: guild.approximate_member_count || 0, // fallback if not always available
				approximate_presence_count: guild.approximate_presence_count || 0, // fallback if not always available
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				features: guild.features,
				stickers: guild.stickers,
			}));
	} catch (error) {
		console.error("Error getting formatted server list:", error);
		throw error;
	}
}

/**
 * Invalidates cached guild data for the specified user and all bot guilds.
 *
 * Removes both the user's guild cache and the bot's guild cache to ensure fresh data is fetched on subsequent requests.
 *
 * @param userId - The Discord user ID whose guild cache should be invalidated.
 */
export async function invalidateGuildCaches(userId: string): Promise<void> {
	await Promise.all([
		invalidateUserGuildsCache(userId),
		invalidateBotGuildsCache(),
	]);
}
