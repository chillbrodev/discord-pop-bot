import { SlashCommandBuilder } from "@discord/builders";
import { filterAvailablePlayerFlags, Flag } from "../../flags/flags.ts";
import { NextStepsReport } from "./next-steps-report.ts";
import { DatabaseInterface } from "../../db/db-interface.ts";
import { PlayerFlag } from "../../db/model/player-models.ts";

export class NextStepsHandler {
  readonly discordCommand: SlashCommandBuilder;
  readonly name = "pop-nextsteps";
  readonly description = "See what flags you need to work on next.";

  constructor(
    private readonly dbInterface: DatabaseInterface,
    private readonly popFlags: Flag[]
  ) {
    this.discordCommand = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }

  async nextStepsReport(
    userId: string,
    guildId: string
  ): Promise<NextStepsReport> {
    const playerFlags: PlayerFlag[] = await this.dbInterface.getPlayerFlags(
      userId,
      guildId
    );

    // Find flags that can be completed next (all dependencies satisfied)
    const availableFlags = this.popFlags
      .filter(filterAvailablePlayerFlags(playerFlags))
      .map((flag) => `- **${flag.name}**: ${flag.description}`);

    if (availableFlags.length === 0) {
      if (
        playerFlags.some(
          (pFlag) => pFlag.flag_key === "quarm" && pFlag.completed
        )
      ) {
        return {
          popComplete: true,
          availableFlags: [],
        };
        // return "🎉 You have completed all Planes of Power content including Quarm!";
      } else {
        // return "No flags are currently available. Check your progress to see what requirements you need to meet first.";

        return {
          popComplete: false,
          availableFlags: [],
        };
      }
    }

    return {
      popComplete: false,
      availableFlags: availableFlags,
    };
  }
}
