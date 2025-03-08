import { configs } from '../config.ts';
import { DatabaseFactory, DatabaseInterface } from './index.ts';
import { PlayerFlag } from './model/player-models.ts';

// Create the appropriate database implementation
const db: DatabaseInterface = DatabaseFactory.createDatabase(configs);

// Now you can use the db interface without knowing the specific implementation
async function trackPlayerProgress(userId: string, guildId: string, displayName: string) {
  // Initialize the player
  await db.initPlayer(userId, guildId, displayName);

  // Set some flags
  await db.setFlag(userId, guildId, 'earth', true);
  await db.setFlag(userId, guildId, 'air', true);

  // Get player's current flag status
  const flags = await db.getPlayerFlags(userId, guildId);
  console.log(`Player ${displayName} has completed ${flags.filter((f) => f.completed).length} flags`);

  // Log individual flags
  flags.forEach((flag: PlayerFlag) => {
    console.log(`Flag ${flag.flag_key}: ${flag.completed ? 'Completed' : 'Not completed'}`);
  });

  // Get guild progress
  const guildProgress = await db.getGuildProgress(guildId);
  console.log(`Guild has ${guildProgress.length} members`);
}

// Usage
trackPlayerProgress('123456789', 'server123', 'Player1');
