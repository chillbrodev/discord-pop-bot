import { load } from "@std/dotenv";
import { DatabaseType } from "./db/db-factory.ts";
await load({ export: true });

export function getDenoEnvValueOrThrow(envKey: string): string {
  const envValue = Deno.env.get(envKey);
  if (!envValue) {
    throw new Error(`*** ALERT *** Missing ${envKey}`);
  }

  return envValue.toString();
}

const token = getDenoEnvValueOrThrow("BOT_TOKEN");
const dbType = getDenoEnvValueOrThrow("DB_TYPE");

export const configs: Config = {
  token,
  dbType: dbType as DatabaseType,
};

export interface Config {
  token: string;
  dbType: DatabaseType;
}
