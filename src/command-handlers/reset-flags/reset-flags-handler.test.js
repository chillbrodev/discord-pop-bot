import { describe, it } from '@std/testing/bdd';
import { ResetFlagsHandler } from './reset-flags-handler.ts';
import { expect } from '@std/expect';
import { MockDB } from '../../db/mock/mock-db.ts';

const mockDb = new MockDB();
const resetFlagHandler = new ResetFlagsHandler(mockDb);

describe('ResetFlagsHandler', () => {
  it('should return the correct command name', () => {
    expect(resetFlagHandler.name).toBe('pop-resetflags');
  });

  it('should return the correct description', () => {
    expect(resetFlagHandler.description).toBe('Reset all your PoP flags.');
  });

  it('should reset flags', async () => {
    const reset = await resetFlagHandler.resetFlags();

    expect(reset).toBe(true);
  });
});
