import { PlayerProgress } from "../../db/model/player-models.ts";

export interface GuildProgressReport {
  quarmSlayers: number;
  guildProgress: number;
  topPlayers: PlayerProgress[];
  playerList: string;
}
