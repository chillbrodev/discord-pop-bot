import { PlayerFlag, PlayerProgress } from './model/player-models.ts';

/**
 * Interface defining the contract for any database implementation
 * used to track player flags and progress.
 */
export interface DatabaseInterface {
  /**
   * Initialize a player in the database if they don't exist
   */
  initPlayer(userId: string, guildId: string, displayName: string): Promise<boolean>;

  /**
   * Get all flag status for a player
   */
  getPlayerFlags(userId: string, guildId: string): Promise<PlayerFlag[]>;

  /**
   * Set flag status for a player
   */
  setFlag(userId: string, guildId: string, flagKey: string, completed: boolean): Promise<boolean>;

  /**
   * Reset all flags for a player
   */
  resetFlags(userId: string, guildId: string): Promise<boolean>;

  /**
   * Get player's last updated timestamp
   */
  getLastUpdated(userId: string, guildId: string): Promise<Date>;

  /**
   * Get all players in a guild with completed flags count
   */
  getGuildProgress(guildId: string): Promise<PlayerProgress[]>;
}
