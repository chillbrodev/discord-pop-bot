import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { HelpHandler } from './help-handler.ts';

const helpHandler = new HelpHandler();

describe('HelpHandler', () => {
  it('should return the correct command name', () => {
    expect(helpHandler.name).toBe('pop-help');
  });

  it('should return the correct description', () => {
    expect(helpHandler.description).toBe('View commands for this bot.');
  });

  it('should return helpMessage', () => {
    const helpMessage = helpHandler.printHelp();

    expect(helpMessage).toBe(
      `
* /pop-help - Shows the following commands
* /pop-trackflag - Mark the selected flag as completed for you.
* /pop-resetflags - Reset all your PoP flags (only works on yourself).
* /pop-nextsteps - See what flags are available to complete next.
* /pop-guildprogress - See the progess percentage of each guild player.
* /pop-listflags - List all the flags separated by Tier.
`,
    );
  });
});
