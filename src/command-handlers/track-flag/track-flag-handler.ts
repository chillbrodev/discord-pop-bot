import { SlashCommandBuilder } from "@discord/builders";
import { filterAvailablePlayerFlags, Flag } from "../../flags/flags.ts";
import { TrackFlagOption } from "./flag-options.ts";
import { PlayerFlag } from "../../db/model/player-models.ts";
import { DatabaseInterface } from "../../db/db-interface.ts";

export class TrackFlagHandler {
  readonly discordCommand: SlashCommandBuilder;
  readonly name = "pop-trackflag";
  readonly description = "Mark a flag as completed.";

  constructor(
    private readonly dbInterface: DatabaseInterface,
    private readonly popFlags: Flag[]
  ) {
    this.discordCommand = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }

  async provideFlagOptions(
    userId: string,
    guildId: string
  ): Promise<TrackFlagOption[]> {
    const playerFlags: PlayerFlag[] = await this.dbInterface.getPlayerFlags(
      userId,
      guildId
    );

    // Find flags that can be completed next (all dependencies satisfied)
    const availableFlags: TrackFlagOption[] = this.popFlags
      .filter(filterAvailablePlayerFlags(playerFlags))
      .map((flag) => {
        const flagOption: TrackFlagOption = {
          label: flag.name,
          flagKey: flag.id,
        };
        return flagOption;
      });

    return availableFlags;
  }

  async trackFlag(userId: string, guildId: string, flagKey: string) {
    await this.dbInterface.setFlag(userId, guildId, flagKey, true);
  }
}
