export type { DatabaseInterface } from './db-interface.ts';
export type { PlayerData, PlayerFlag, PlayerProgress } from './model/player-models.ts';
export { DatabaseFactory, DatabaseType } from './db-factory.ts';

// Re-export the implementations directly if needed
export { SupabaseDB } from './supabase/supabase-db.ts';
export { MockDB } from './mock/mock-db.ts';
