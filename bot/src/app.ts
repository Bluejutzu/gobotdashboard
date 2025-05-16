/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Client, IntentsBitField } from 'discord.js';
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
            .is('processed_at', null)
            .order('created_at', { ascending: true })
            .limit(5);

        if (error) throw error;
        
        if (events && events.length > 0) {
            console.log(`Found ${events.length} unprocessed command reload events`);
            
            for (const event of events) {
                try {
                    if (event.server_id) {
                        await loadCommands(client, supabase, event.server_id);
                        console.log(`Reloaded commands for server ${event.server_id}`);
                    }
                    
                    // Mark event as processed
                    await supabase
                        .from('bot_events')
                        .update({ processed_at: new Date().toISOString() })
                        .eq('id', event.id);
                } catch (eventError) {
                    console.error(`Error processing event ${event.id}:`, eventError);
                    // Mark as processed anyway to avoid endless retries
                    await supabase
                        .from('bot_events')
                        .update({ processed_at: new Date().toISOString() })
                        .eq('id', event.id);
                }
            }
        }
    } catch (error) {
        console.error('Error checking bot events:', error);
    }
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}`);
    await loadCommands(client, supabase);

    setInterval(checkBotEvents, 30000);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { data: command } = await supabase
        .from('commands')
        .select('*')
        .eq('server_id', interaction.guildId)
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