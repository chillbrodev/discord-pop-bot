import { describe, it } from '@std/testing/bdd';
import { GuildProgressHandler } from './guild-progress-handler.ts';
import { expect } from '@std/expect';
import { MockDB } from '../../db/mock/mock-db.ts';

const mockDb = new MockDB();
const guildProgressHandler = new GuildProgressHandler(mockDb);

describe('GuildProgressHandler', () => {
  it('should return the correct command name', () => {
    expect(guildProgressHandler.name).toBe('pop-guildprogress');
  });

  it('should return the correct description', () => {
    expect(guildProgressHandler.description).toBe('View guild progression through PoP content.');
  });

  // TODO Add tests for guild progress
  // it('should show the guild progress breakdown', async () => {
  //   const reset = await guildProgressHandler.resetFlags();

  //   expect(reset).toBe(true);
  // });
});
