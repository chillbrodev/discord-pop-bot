// Supabase database integration for EverQuest PoP Tracker Bot
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Config } from '../../config.ts';
import { PlayerData, PlayerFlag, PlayerProgress } from '../model/player-models.ts';
import { DatabaseInterface } from '../db-interface.ts';

export class SupabaseDB implements DatabaseInterface {
  private supabase: SupabaseClient;

  constructor(config: Config) {
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
  }

  // Initialize player in DB if they don't exist
  async initPlayer(userId: string, guildId: string, displayName: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('player_data')
      .select('*')
      .eq('user_id', userId)
      .eq('guild_id', guildId)
      .single();

    if (error || !data) {
      // Create new player record
      const { error: insertError } = await this.supabase
        .from('player_data')
        .insert({
          user_id: userId,
          guild_id: guildId,
          display_name: displayName,
          last_updated: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error creating player:', insertError);
        return false;
      }

      // Add knowledge flag by default
      await this.setFlag(userId, guildId, 'knowledge', true);
    } else {
      // Update display name if it changed
      if (data.display_name !== displayName) {
        await this.supabase
          .from('player_data')
          .update({
            display_name: displayName,
            last_updated: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .eq('guild_id', guildId);
      }
    }

    return true;
  }

  // Get all flag status for a player
  async getPlayerFlags(userId: string, guildId: string): Promise<PlayerFlag[]> {
    const { data, error } = await this.supabase
      .from('player_flags')
      .select('*')
      .eq('user_id', userId)
      .eq('guild_id', guildId);

    if (error) {
      console.error('Error fetching player flags:', error);
      return [];
    }

    // Ensure knowledge flag exists
    const hasKnowledge = data.some((flag: PlayerFlag) => flag.flag_key === 'knowledge');
    if (!hasKnowledge) {
      // Add knowledge flag if it doesn't exist
      this.setFlag(userId, guildId, 'knowledge', true);

      // Add knowledge flag to the returned data
      const now = new Date().toISOString();
      data.push({
        user_id: userId,
        guild_id: guildId,
        flag_key: 'knowledge',
        completed: true,
        completed_at: now,
      });
    }

    return data;
  }

  // Set flag status for a player
  async setFlag(userId: string, guildId: string, flagKey: string, completed: boolean): Promise<boolean> {
    // Check if flag already exists
    const { data, error } = await this.supabase
      .from('player_flags')
      .select('*')
      .eq('user_id', userId)
      .eq('guild_id', guildId)
      .eq('flag_key', flagKey)
      .single();

    const timestamp = new Date().toISOString();

    if (error || !data) {
      // Create new flag
      const { error: insertError } = await this.supabase
        .from('player_flags')
        .insert({
          user_id: userId,
          guild_id: guildId,
          flag_key: flagKey,
          completed: completed,
          completed_at: completed ? timestamp : null,
        });

      if (insertError) {
        console.error('Error setting flag:', insertError);
        return false;
      }
    } else {
      // Update existing flag
      const { error: updateError } = await this.supabase
        .from('player_flags')
        .update({
          completed: completed,
          completed_at: completed ? timestamp : null,
        })
        .eq('user_id', userId)
        .eq('guild_id', guildId)
        .eq('flag_key', flagKey);

      if (updateError) {
        console.error('Error updating flag:', updateError);
        return false;
      }
    }

    // Update last_updated in player_data
    await this.supabase
      .from('player_data')
      .update({ last_updated: timestamp })
      .eq('user_id', userId)
      .eq('guild_id', guildId);

    return true;
  }

  // Reset all flags for a player
  async resetFlags(userId: string, guildId: string): Promise<boolean> {
    // Delete all flags except knowledge
    const { error } = await this.supabase
      .from('player_flags')
      .delete()
      .eq('user_id', userId)
      .eq('guild_id', guildId)
      .neq('flag_key', 'knowledge');

    if (error) {
      console.error('Error resetting flags:', error);
      return false;
    }

    // Ensure knowledge flag is set
    await this.setFlag(userId, guildId, 'knowledge', true);

    // Update last_updated in player_data
    await this.supabase
      .from('player_data')
      .update({ last_updated: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('guild_id', guildId);

    return true;
  }

  // Get player's last updated timestamp
  async getLastUpdated(userId: string, guildId: string): Promise<Date> {
    const { data, error } = await this.supabase
      .from('player_data')
      .select('last_updated')
      .eq('user_id', userId)
      .eq('guild_id', guildId)
      .single();

    if (error || !data) {
      return new Date();
    }

    return new Date(data.last_updated);
  }

  // Get all players in a guild with completed flags count
  async getGuildProgress(guildId: string): Promise<PlayerProgress[]> {
    // Get all players in the guild
    const { data: players, error: playerError } = await this.supabase
      .from('player_data')
      .select('*')
      .eq('guild_id', guildId);

    if (playerError || !players) {
      console.error('Error fetching guild players:', playerError);
      return [];
    }

    // Get all flags for all users in the guild
    const { data: flags, error: flagError } = await this.supabase
      .from('player_flags')
      .select('*')
      .eq('guild_id', guildId)
      .eq('completed', true);

    if (flagError || !flags) {
      console.error('Error fetching guild flags:', flagError);
      return [];
    }

    // Group flags by user
    const flagsByUser: Record<string, string[]> = {};
    flags.forEach((flag: PlayerFlag) => {
      if (!flagsByUser[flag.user_id]) {
        flagsByUser[flag.user_id] = [];
      }
      flagsByUser[flag.user_id].push(flag.flag_key);
    });

    // Combine data
    return players.map((player: PlayerData) => {
      const userFlags = flagsByUser[player.user_id] || ['knowledge'];
      return {
        userId: player.user_id,
        displayName: player.display_name,
        lastUpdated: player.last_updated,
        flagsCompleted: userFlags.length,
        quarmDefeated: userFlags.includes('quarm'),
      };
    });
  }
}
