import { SlashCommandBuilder } from "@discord/builders";

export class HelpHandler {
  readonly discordCommand: SlashCommandBuilder;
  readonly name = "pop-help";
  readonly description = "View commands for this bot.";

  constructor() {
    this.discordCommand = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }

  printHelp(): string {
    return `
* /pop-help - Shows the following commands
* /pop-trackflag player - Mark the selected flag as completed for you.
* /pop-resetflags - Reset all your PoP flags (only works on yourself).
* /pop-nextsteps player - See what flags are available to complete next.
* /pop-guildprogress - See the progess percentage of each guild player.
`;
  }
}
