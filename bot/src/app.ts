import { Client, GatewayIntentBits, IntentsBitField } from 'discord.js';
import { CommandKit } from 'commandkit';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { loadCommands } from './utils/commandLoader';

config({ debug: true });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

new CommandKit({ client });

// Function to check for bot events
async function checkBotEvents() {
    try {
        const { data: events, error } = await supabase
            .from('bot_events')
            .select('*')
            .eq('type', 'RELOAD_COMMANDS')
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) throw error;
        if (events && events.length > 0) {
            const event = events[0];

            // Delete the event after processing
            await supabase
                .from('bot_events')
                .delete()
                .eq('id', event.id);

            // Reload commands for the specific server
            console.log(event)
            if (event.server_id) {
                await loadCommands(client, supabase, event.server_id);
                console.log(`Reloaded commands for server ${event.server_id}`);
            }
        }
    } catch (error) {
        console.error('Error checking bot events:', error);
    }
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}`);
    await loadCommands(client, supabase);

    // Check for bot events every 10 seconds
    setInterval(checkBotEvents, 10000);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { data: command } = await supabase
        .from('commands')
        .select('*')
        .eq('guild_id', interaction.guildId)
        .eq('name', interaction.commandName)
        .single();

    if (!command) {
        await interaction.reply({
            content: 'This command is no longer available.',
            ephemeral: true,
        });
        return;
    }

    try {
        // Command execution logic will be handled by CommandKit
        // This is just for database validation
    } catch (error) {
        console.error('Error executing command:', error);
        await interaction.reply({
            content: 'There was an error executing this command.',
            ephemeral: true,
        });
    }
});

export default client