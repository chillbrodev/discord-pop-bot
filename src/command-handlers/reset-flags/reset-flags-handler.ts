import { SlashCommandBuilder } from "@discord/builders";
import { DatabaseInterface } from "../../db/index.ts";

export class ResetFlagsHandler {
  readonly discordCommand: SlashCommandBuilder;
  readonly name = "pop-resetflags";
  readonly description = "Reset all your PoP flags.";

  constructor(private readonly dbInterface: DatabaseInterface) {
    this.discordCommand = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }

  async resetFlags(userId: string, guildId: string): Promise<boolean> {
    await this.dbInterface.resetFlags(userId, guildId);
    return true;
  }
}
