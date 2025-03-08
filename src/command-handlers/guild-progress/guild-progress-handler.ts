import { SlashCommandBuilder } from "@discord/builders";
import { GuildProgressReport } from "./guild-progress-report.ts";
import { Flag } from "../../flags/flags.ts";
import { DatabaseInterface } from "../../db/db-interface.ts";

export class GuildProgressHandler {
  readonly discordCommand: SlashCommandBuilder;
  readonly name = "pop-guildprogress";
  readonly description = "View guild progression through PoP content.";

  constructor(
    private readonly dbInterface: DatabaseInterface,
    private readonly popFlags: Flag[]
  ) {
    this.discordCommand = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }

  async guildProgressReport(
    guildId: string
  ): Promise<GuildProgressReport | null> {
    const guildProgress = await this.dbInterface.getGuildProgress(guildId);
    if (guildProgress.length === 0) {
      return null;
    }

    // Sort by number of flags completed (descending)
    guildProgress.sort((a, b) => b.flagsCompleted - a.flagsCompleted);

    const totalFlags = this.popFlags.length;
    const quarmSlayers = guildProgress.filter((p) => p.quarmDefeated).length;

    // Add top 10 players
    const topPlayers = guildProgress.slice(0, 10);
    const playerList = topPlayers
      .map((player, index) => {
        const percentage = Math.floor(
          (player.flagsCompleted / totalFlags) * 100
        );
        const quarmStatus = player.quarmDefeated ? " 👑" : "";
        return `${index + 1}. **${
          player.displayName
        }**${quarmStatus}: ${percentage}% (${
          player.flagsCompleted
        }/${totalFlags})`;
      })
      .join("\n");

    const progressReport: GuildProgressReport = {
      quarmSlayers,
      guildProgress: guildProgress.length,
      playerList,
      topPlayers,
    };

    return progressReport;
  }
}
