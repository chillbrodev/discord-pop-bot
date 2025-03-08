import { describe, it } from '@std/testing/bdd';
import { NextStepsHandler } from './next-steps-handler.ts';
import { expect } from '@std/expect';
import { MockDB } from '../../db/mock/mock-db.ts';

const mockDb = new MockDB();
const nextStepsHandler = new NextStepsHandler(mockDb);

describe('NextStepsHandler', () => {
  it('should return the correct command name', () => {
    expect(nextStepsHandler.name).toBe('pop-nextsteps');
  });

  it('should return the correct description', () => {
    expect(nextStepsHandler.description).toBe('See what flags you need to work on next.');
  });

  // TODO Add tests for next steps
  // it('should show the player's next steps', async () => {
  //   const nextSteps = await nextStepsHandler.nextStepsReport('user', 'guild');
  // });
});
