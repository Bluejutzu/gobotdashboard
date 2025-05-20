import { NextRequest } from "next/server";
import { z } from "zod";
import { CACHE_KEYS, setCache, getCache, invalidateCache, CACHE_TTL } from "@/lib/redis";
import { Database } from "../types/supabase";
import supabase from "../supabase/client";
import { AutoModerationRule } from "../types/types";

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

function getServerIdFromRequest(req: NextRequest): string {
    const url = new URL(req.url);
    return url.searchParams.get("serverId") || "";
}

export async function getModerationCases(serverId: string): Promise<ModerationCase[]> {
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

export async function deleteModerationCase(arg: NextRequest | string) {
    let id: string = "";
    if (typeof arg === 'string') {
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

export const getAutoModerationSettings = async (serverId: string) => {
    const data = await getCache<AutoModerationRule>(`${CACHE_KEYS.AUTO_MODERATION_SETTINGS}${serverId}`);
    return data ? data : null;
};

export const updateAutoModerationSettings = async (serverId: string, settings: any) => {
    await setCache(`${CACHE_KEYS.AUTO_MODERATION_SETTINGS}${serverId}`, JSON.stringify(settings), CACHE_TTL.AUTO_MODERATION_SETTINGS);
};

export async function updateModerationCase(id: string, data: Partial<ModerationCase>) {
    return supabase.from('moderation_cases').update(data).eq('id', id);
  }