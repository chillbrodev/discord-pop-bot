import { Config } from '../config.ts';
import { DatabaseInterface } from './db-interface.ts';
import { SupabaseDB } from './supabase/supabase-db.ts';
import { MockDB } from './mock/mock-db.ts';

export enum DatabaseType {
  SUPABASE = 'supabase',
  MOCK = 'mock',
}

/**
 * Factory to create database implementations
 */
export class DatabaseFactory {
  /**
   * Create and return the appropriate database implementation
   */
  static createDatabase(config: Config): DatabaseInterface {
    switch (config.dbType) {
      case DatabaseType.SUPABASE:
        return new SupabaseDB(config);
      case DatabaseType.MOCK:
        return new MockDB();
      default:
        throw new Error(`Unsupported database type: ${config.dbType}`);
    }
  }
}
