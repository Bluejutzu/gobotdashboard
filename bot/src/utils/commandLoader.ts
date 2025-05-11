import { Client, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { SupabaseClient } from '@supabase/supabase-js';
import axios from 'axios'

export async function loadCommands(client: Client, supabase: SupabaseClient, serverId?: string) {
  try {
    // Ensure client is ready before proceeding
    if (!client.isReady()) {
      throw new Error('Discord client is not ready');
    }

    // Ensure we have a valid client.user
    if (!client.user) {
      throw new Error('Client user is not initialized');
    }

    let query = supabase.from('commands').select('*');

    // If serverId is provided, only load commands for that server
    if (serverId) {
      query = query.eq('server_id', serverId);
    }

    const { data: commands, error } = await query;

    if (error) throw error;

    // Group commands by server
    const guildCommands = new Map<string, any[]>();
    commands?.forEach((cmd) => {
      if (!guildCommands.has(cmd.server_id)) {
        guildCommands.set(cmd.server_id, []);
      }
      guildCommands.get(cmd.server_id)?.push(cmd);
    });
console.log(guildCommands)

    // Register commands for each guild
    for (const [guildId, guildCmds] of guildCommands) {
      try {
        console.log(`Fetching guild: ${guildId}`);
        
        // First try to get the guild from Discord.js cache
        let guild = client.guilds.cache.get(guildId);
        
        // If not in cache, try to fetch it
        if (!guild) {
          try {
            guild = await client.guilds.fetch(guildId);
          } catch (error) {
            console.error(`Failed to fetch guild ${guildId} via Discord.js:`, error);
            
            // As fallback, try the REST API
            try {
              const res = await axios.get(`https://discord.com/api/v10/guilds/${guildId}`, {
                headers: {
                  Authorization: `Bot ${process.env.DISCORD_TOKEN}`
                }
              });
              
              if (res.status !== 200 || !res.data) {
                throw new Error('Guild not found via REST API');
              }
              
              console.log(`Fetched guild via REST API: ${res.data.name}`);
            } catch (restError) {
              console.error(`Could not fetch guild ${guildId} via any method:`, restError);
              
              // Mark the event as processed if this was the target server
              if (serverId === guildId) {
                await supabase
                  .from('bot_events')
                  .update({ processed_at: new Date().toISOString() })
                  .eq('type', 'RELOAD_COMMANDS')
                  .eq('server_id', serverId)
                  .is('processed_at', null);
              }
              continue;
            }
          }
        }
        
        // Check if the bot has permission to create commands
        let botHasPermission = false;
        try {
          if (guild) {
            const botMember = await guild.members.fetch(client.user.id);
            botHasPermission = botMember.permissions.has(PermissionFlagsBits.UseApplicationCommands);
            
            if (!botHasPermission) {
              console.error(`Bot lacks application commands permission in guild ${guildId}, skipping command registration`);
              continue;
            }
          }
        } catch (memberError) {
          console.error(`Failed to check bot permissions for guild ${guildId}:`, memberError);
          // Continue anyway - Discord's API will reject the command registration if permissions are missing
        }

        // Register the commands with Discord API
        const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

        const commands = guildCmds.map((cmd) => {
          const command = new SlashCommandBuilder()
            .setName(cmd.name)
            .setDescription(cmd.description || 'No description provided');

          // Add options based on nodes that are of type 'option'
          const optionNodes = cmd.nodes?.filter((node: any) => node.type === 'option') || [];

          optionNodes.forEach((node: any) => {
            const optionData = node.data;
            switch (optionData.optionType) {
              case 'string':
                command.addStringOption((opt) =>
                  opt
                    .setName(optionData.name)
                    .setDescription(optionData.description || 'No description')
                    .setRequired(optionData.required ?? false)
                );
                break;
              case 'number':
                command.addNumberOption((opt) =>
                  opt
                    .setName(optionData.name)
                    .setDescription(optionData.description || 'No description')
                    .setRequired(optionData.required ?? false)
                );
                break;
              case 'user':
                command.addUserOption((opt) =>
                  opt
                    .setName(optionData.name)
                    .setDescription(optionData.description || 'No description')
                    .setRequired(optionData.required ?? false)
                );
                break;
              case 'channel':
                command.addChannelOption((opt) =>
                  opt
                    .setName(optionData.name)
                    .setDescription(optionData.description || 'No description')
                    .setRequired(optionData.required ?? false)
                );
                break;
              case 'role':
                command.addRoleOption((opt) =>
                  opt
                    .setName(optionData.name)
                    .setDescription(optionData.description || 'No description')
                    .setRequired(optionData.required ?? false)
                );
                break;
            }
          });

          return command.toJSON();
        });

        try {
          await rest.put(
            Routes.applicationGuildCommands(client.user!.id, guildId),
            { body: commands }
          );
          console.log(`Successfully registered ${commands.length} commands for guild ${guildId}`);
        } catch (registerError: any) {
          console.error(`Error registering commands for guild ${guildId}:`, registerError);
          if (registerError.code === 50001) {
            console.error(`Bot lacks permissions in guild ${guildId}. Please ensure the bot:
1. Is in the server
2. Has the 'applications.commands' scope
3. Has the required permissions`);
          }
        }

        // Mark the event as processed if this was the target server
        if (serverId === guildId) {
          await supabase
            .from('bot_events')
            .update({ processed_at: new Date().toISOString() })
            .eq('type', 'RELOAD_COMMANDS')
            .eq('server_id', serverId)
            .is('processed_at', null);
        }
      } catch (error) {
        console.error(`Error processing commands for guild ${guildId}:`, error);
        
        // Mark the event as processed even if it failed
        if (serverId === guildId) {
          await supabase
            .from('bot_events')
            .update({ processed_at: new Date().toISOString() })
            .eq('type', 'RELOAD_COMMANDS')
            .eq('server_id', serverId)
            .is('processed_at', null);
        }
      }
    }
  } catch (error) {
    console.error('Error loading commands:', error);
    throw error; // Re-throw to handle it in the caller
  }
} 