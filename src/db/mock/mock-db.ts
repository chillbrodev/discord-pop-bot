// deno-lint-ignore-file require-await
import { DatabaseInterface } from '../db-interface.ts';
import { PlayerFlag, PlayerProgress } from '../model/player-models.ts';

/**
 * Mock database implementation for testing purposes.
 * Stores all data in memory.
 */
export class MockDB implements DatabaseInterface {
  private players: Map<string, {
    userId: string;
    guildId: string;
    displayName: string;
    lastUpdated: Date;
  }> = new Map();

  private flags: Map<string, Map<string, { completed: boolean; completedAt: string | null }>> = new Map();

  private getPlayerKey(userId: string, guildId: string): string {
    return `${userId}:${guildId}`;
  }

  async initPlayer(userId: string, guildId: string, displayName: string): Promise<boolean> {
    const key = this.getPlayerKey(userId, guildId);
    const now = new Date();

    this.players.set(key, {
      userId,
      guildId,
      displayName,
      lastUpdated: now,
    });

    // Initialize flags for this player if they don't exist
    if (!this.flags.has(key)) {
      this.flags.set(
        key,
        new Map([
          ['knowledge', { completed: true, completedAt: now.toISOString() }],
        ]),
      );
    }

    return true;
  }

  async getPlayerFlags(userId: string, guildId: string): Promise<PlayerFlag[]> {
    const key = this.getPlayerKey(userId, guildId);
    const playerFlags = this.flags.get(key) || new Map([
      ['knowledge', { completed: true, completedAt: new Date().toISOString() }],
    ]);

    const result: PlayerFlag[] = [];
    playerFlags.forEach((value, flagKey) => {
      result.push({
        user_id: userId,
        guild_id: guildId,
        flag_key: flagKey,
        completed: value.completed,
        completed_at: value.completedAt,
      });
    });

    return result;
  }

  async setFlag(userId: string, guildId: string, flagKey: string, completed: boolean): Promise<boolean> {
    const key = this.getPlayerKey(userId, guildId);

    // Create player entry if it doesn't exist
    if (!this.players.has(key)) {
      await this.initPlayer(userId, guildId, userId);
    }

    // Update or create flags map for this player
    let playerFlags = this.flags.get(key);
    if (!playerFlags) {
      playerFlags = new Map();
      this.flags.set(key, playerFlags);
    }

    // Set the flag
    const now = new Date().toISOString();
    playerFlags.set(flagKey, {
      completed,
      completedAt: completed ? now : null,
    });

    // Update last updated timestamp
    const playerData = this.players.get(key);
    if (playerData) {
      playerData.lastUpdated = new Date();
    }

    return true;
  }

  async resetFlags(userId: string, guildId: string): Promise<boolean> {
    const key = this.getPlayerKey(userId, guildId);
    const now = new Date().toISOString();

    // Reset flags to just knowledge
    this.flags.set(
      key,
      new Map([
        ['knowledge', { completed: true, completedAt: now }],
      ]),
    );

    // Update last updated timestamp
    const playerData = this.players.get(key);
    if (playerData) {
      playerData.lastUpdated = new Date();
    }

    return true;
  }

  async getLastUpdated(userId: string, guildId: string): Promise<Date> {
    const key = this.getPlayerKey(userId, guildId);
    const playerData = this.players.get(key);
    return playerData?.lastUpdated || new Date();
  }

  async getGuildProgress(guildId: string): Promise<PlayerProgress[]> {
    const progress: PlayerProgress[] = [];

    // Find all players in this guild and calculate their progress
    this.players.forEach((player, key) => {
      if (player.guildId === guildId) {
        const playerFlags = this.flags.get(key) || new Map();
        const flagsCompleted = Array.from(playerFlags.entries())
          .filter(([_, data]) => data.completed)
          .length;

        const quarmFlag = playerFlags.get('quarm');

        progress.push({
          userId: player.userId,
          displayName: player.displayName,
          lastUpdated: player.lastUpdated.toISOString(),
          flagsCompleted,
          quarmDefeated: quarmFlag?.completed || false,
        });
      }
    });

    return progress;
  }
}
