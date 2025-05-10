import { Client, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { SupabaseClient } from '@supabase/supabase-js';

export async function loadCommands(client: Client, supabase: SupabaseClient, serverId?: string) {
  try {
    // Ensure client is ready before proceeding
    if (!client.isReady()) {
      throw new Error('Discord client is not ready');
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

    // Register commands for each guild
    for (const [guildId, guildCmds] of guildCommands) {
      try {
        // Check if bot has access to the guild
        let guild;
        try {
          // First try to get from cache
          guild = client.guilds.cache.get(guildId);
          
          // If not in cache, try to fetch
          if (!guild) {
            guild = await client.guilds.fetch(guildId);
          }
        } catch (err) {
          console.error(`Failed to fetch guild ${guildId}:`, err);
          guild = null;
        }

        if (!guild) {
          console.error(`Bot is not in guild ${guildId} or guild ID is invalid, skipping command registration`);
          
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

        // Check if bot has required permissions
        let botMember;
        try {
          // First try to get from cache
          botMember = guild.members.cache.get(client.user!.id);
          
          // If not in cache, try to fetch
          if (!botMember) {
            botMember = await guild.members.fetch(client.user!.id);
          }
        } catch (err) {
          console.error(`Failed to fetch bot member for guild ${guildId}:`, err);
          
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

        if (!botMember) {
          console.error(`Bot is not a member of guild ${guildId}, skipping command registration`);
          continue;
        }

        if (!botMember.permissions.has(PermissionFlagsBits.UseApplicationCommands)) {
          console.error(`Bot lacks application commands permission in guild ${guildId}, skipping command registration`);
          continue;
        }

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

        await rest.put(
          Routes.applicationGuildCommands(client.user!.id, guildId),
          { body: commands }
        );
        console.log(`Successfully registered commands for guild ${guildId}`);
      } catch (error: any) {
        if (error.code === 50001) {
          console.error(`Bot lacks permissions in guild ${guildId}. Please ensure the bot:
1. Is in the server
2. Has the 'applications.commands' scope
3. Has the required permissions`);
        } else {
          console.error(`Error registering commands for guild ${guildId}:`, error);
        }
        
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