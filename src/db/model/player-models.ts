// Data models for player tracking

export interface PlayerData {
  user_id: string;
  guild_id: string;
  display_name: string;
  last_updated: string;
}

export interface PlayerFlag {
  user_id: string;
  guild_id: string;
  flag_key: string;
  completed: boolean;
  completed_at: string | null;
}

export interface PlayerProgress {
  userId: string;
  displayName: string;
  lastUpdated: string;
  flagsCompleted: number;
  quarmDefeated: boolean;
}
