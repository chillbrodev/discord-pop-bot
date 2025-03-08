import { SlashCommandBuilder } from "@discord/builders";
import { tiers } from "../../flags/flags.ts";

export class ListFlagsHandler {
  readonly discordCommand: SlashCommandBuilder;
  readonly name = "pop-listflags";
  readonly description = "List all available PoP flags.";

  constructor() {
    this.discordCommand = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }

  listFlags(): string {
    const flagList = tiers
      .map((tier) => {
        const tierFlags = tier.flags
          .map((flag) => `* **${flag.name}**: ${flag.description}`)
          .join("\n");
        return `## ${tier.name}:` + `\n${tierFlags}`;
      })
      .join("\n");
    return flagList;
  }
}
