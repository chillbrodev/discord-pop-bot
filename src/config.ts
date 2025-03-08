import { load } from '@std/dotenv';
import { DatabaseType } from './db/db-factory.ts';
await load({ export: true });

export function getDenoEnvValueOrThrow(envKey: string): string {
  const envValue = Deno.env.get(envKey);
  if (!envValue) {
    throw new Error(`*** ALERT *** Missing ${envKey}`);
  }

  return envValue.toString();
}

const token = getDenoEnvValueOrThrow('BOT_TOKEN');
const supabaseUrl = getDenoEnvValueOrThrow('SUPABASE_URL');
const supabaseKey = getDenoEnvValueOrThrow('SUPABASE_KEY');
const dbType = getDenoEnvValueOrThrow('DB_TYPE');

export const configs: Config = {
  token,
  supabaseUrl,
  supabaseKey,
  dbType: dbType as DatabaseType,
};

export interface Config {
  token: string;
  supabaseUrl: string;
  supabaseKey: string;
  dbType: DatabaseType;
}
