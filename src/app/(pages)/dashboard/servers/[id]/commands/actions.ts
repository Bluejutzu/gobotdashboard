"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function createNewCommand(formData: FormData) {
    const serverId = formData.get("serverId") as string;
    redirect(`/command-builder/${serverId}/new`);
}

export async function editCommand(formData: FormData) {
    const serverId = formData.get("serverId") as string;
    const commandId = formData.get("commandId") as string;
    redirect(`/dashboard/servers/${serverId}/commands/${commandId}`);
}

export async function deleteCommand(formData: FormData) {
    const commandId = formData.get("commandId") as string;
    const serverId = formData.get("serverId") as string;

    const supabase = await createServerSupabaseClient();
    await supabase.from("commands").delete().eq("id", commandId);

    // Stay on the same page after deletion
    redirect(`/dashboard/servers/${serverId}/commands`);
}
