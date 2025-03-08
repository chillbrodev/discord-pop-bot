import { PlayerProgress } from "../../db/index.ts";

export interface GuildProgressReport {
  quarmSlayers: number;
  guildProgress: number;
  topPlayers: PlayerProgress[];
  playerList: string;
}
