import { NextRequest } from "next/server";
import { z } from "zod";
import {
	CACHE_KEYS,
	setCache,
	getCache,
	invalidateCache,
	CACHE_TTL,
} from "@/lib/redis";
import type { Database } from "../types/supabase";
import supabase from "../supabase/client";
import type { AutoModerationRule } from "../types/types";

type ModerationCase = Database["public"]["Tables"]["moderation_cases"]["Row"];

const createCaseSchema = z.object({
	userId: z.string(),
	type: z.enum(["WARN", "BAN", "KICK", "MUTE"]),
	reason: z.string(),
});

async function getServer(id: string) {
	const { data, error } = await supabase
		.from("servers")
		.select("*")
		.eq("id", id)
		.single();
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Server not found");

	return data;
}

/**
 * Extracts the "serverId" query parameter from a request URL.
 *
 * @param req - The incoming request object.
 * @returns The value of the "serverId" query parameter, or an empty string if not present.
 */
function getServerIdFromRequest(req: NextRequest): string {
	const url = new URL(req.url);
	return url.searchParams.get("serverId") || "";
}

/**
 * Retrieves all moderation cases for a given server, using cache when available.
 *
 * @param serverId - The unique identifier of the server.
 * @returns A promise that resolves to an array of moderation cases for the specified server.
 *
 * @throws {Error} If the database query fails.
 */
export async function getModerationCases(
	serverId: string,
): Promise<ModerationCase[]> {
	const cacheKey = `${CACHE_KEYS.MODERATION_CASES}${serverId}`;
	const cached = await getCache<ModerationCase[]>(cacheKey);
	if (cached) return cached;

	const { data, error } = await supabase
		.from("moderation_cases")
		.select("*")
		.eq("server_id", serverId)
		.order("created_at", { ascending: false });

	if (error) throw new Error(error.message);

	await setCache(cacheKey, data, 60 * 5); // cache for 5 minutes
	return data;
}

/**
 * Creates or updates a moderation case for a server based on the request data.
 *
 * Validates the request body and upserts a moderation case in the database. Returns the created or updated moderation case as JSON. Responds with appropriate HTTP status codes for missing servers, invalid input, or database errors.
 *
 * @returns A JSON response containing the moderation case, or an error response with status 400, 404, or 500.
 */
export async function createModerationCase(req: NextRequest) {
	const serverId = getServerIdFromRequest(req);
	const server = await getServer(serverId);
	if (!server) return new Response("Server not found", { status: 404 });

	const json = await req.json();
	const body = createCaseSchema.safeParse(json);
	if (!body.success) return new Response("Invalid body", { status: 400 });

	const { data, error } = await supabase
		.from("moderation_cases")
		.upsert([
			{
				server_id: serverId,
				user_id: body.data.userId,
				type: body.data.type,
				reason: body.data.reason,
			},
		])
		.select()
		.single();

	if (error) return new Response(error.message, { status: 500 });

	await invalidateCache(`${CACHE_KEYS.MODERATION_CASES}${serverId}`);
	return Response.json(data);
}

/**
 * Deletes a moderation case by its ID or from a request containing the ID.
 *
 * If a {@link NextRequest} is provided, validates the server and parses the case ID from the request body. If a string is provided, deletes the case with that ID directly.
 *
 * @param arg - The moderation case ID as a string, or a {@link NextRequest} containing the ID in its JSON body.
 * @returns A 204 No Content response on success, 404 if the server is not found, or 500 if a database error occurs.
 */
export async function deleteModerationCase(arg: NextRequest | string) {
	let id = "";
	if (typeof arg === "string") {
		id = arg;
	} else if (arg instanceof NextRequest) {
		const serverId = getServerIdFromRequest(arg);
		const server = await getServer(serverId);
		if (!server) return new Response("Server not found", { status: 404 });
		const json = await arg.json();
		id = z.string().parse(json.id);
	}

	const { error } = await supabase
		.from("moderation_cases")
		.delete()
		.eq("id", id);

	if (error) return new Response(error.message, { status: 500 });

	await invalidateCache(`${CACHE_KEYS.MODERATION_CASES}${id}`);
	return new Response(null, { status: 204 });
}

export const getAutoModerationSettings = async (
	serverId: string
): Promise<AutoModerationRule | null> => {
	const cached = await getCache<AutoModerationRule>(
		`${CACHE_KEYS.AUTO_MODERATION_SETTINGS}${serverId}`
	);
	return cached ?? null;
};

export const updateAutoModerationSettings = async (
	serverId: string,
	settings: AutoModerationRule
) => {
	await setCache(
		`${CACHE_KEYS.AUTO_MODERATION_SETTINGS}${serverId}`,
		settings,                           // let the cache layer handle serialisation
		CACHE_TTL.AUTO_MODERATION_SETTINGS
	);
};

/**
 * Updates a moderation case with the specified fields and returns the updated record.
 *
 * @param id - The ID of the moderation case to update.
 * @param data - An object containing the fields to update.
 * @returns The updated moderation case record, including the associated {@link server_id}.
 *
 * @throws {PostgrestError} If the update operation fails.
 */
export async function updateModerationCase(
	id: string,
	data: Partial<ModerationCase>,
) {
	const { data: updated, error } = await supabase
		.from("moderation_cases")
		.update(data)
		.eq("id", id)
		.select("server_id")
		.single();

	if (error) throw error;
	await invalidateCache(`${CACHE_KEYS.MODERATION_CASES}${updated.server_id}`);
	return updated;
}
