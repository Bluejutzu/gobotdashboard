import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { BotSettings, Server } from "@/lib/types/types";
import { ServerError } from "@/components/dashboard/server-error";
import { SettingsPageContent } from "@/components/dashboard/settings-page-content";

type SettingsPageProps = Promise<{ id: string }>;

/**
 * Renders the settings page for a server, fetching server and bot settings data by server ID.
 *
 * Displays an error component if the server or its bot settings cannot be retrieved or found.
 *
 * @param params - An object containing the server ID to load settings for.
 * @returns The settings page content if data is found, or an error component if retrieval fails.
 */
export default async function SettingsPage({ params }: { params: SettingsPageProps }) {
    const { id }: { id: string } = await params;
    const supabase = await createServerSupabaseClient();

    // Get server data
    const { data: server, error: serverError } = await supabase
        .from("servers")
        .select("*")
        .eq("id", id)
        .single<Server>();

    if (serverError) {
        return (
            <ServerError
                title="Database Error"
                message="We couldn't retrieve your server data from our database."
                code={serverError.code}
            />
        );
    }

    if (!server) {
        return (
            <ServerError
                title="Server Not Found"
                message="The server you're looking for doesn't exist or you don't have access to it."
            />
        );
    }

    // Get bot settings
    const { data: botSettings, error: botSettingsError } = await supabase
        .from("bot_settings")
        .select("*")
        .eq("server_id", server.id)
        .single<BotSettings>();

    if (botSettingsError) {
        return (
            <ServerError
                title="Database Error"
                message="We couldn't retrieve your bot settings from our database."
                code={botSettingsError.code}
            />
        );
    }

    if (!botSettings) {
        return (
            <ServerError
                title="Bot Settings Not Found"
                message="The bot settings for this server could not be found."
            />
        );
    }

    return <SettingsPageContent id={id} server={server} botSettings={botSettings} />;
}
