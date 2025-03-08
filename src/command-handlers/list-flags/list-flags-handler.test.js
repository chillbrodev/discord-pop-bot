import { describe, it } from '@std/testing/bdd';
import { ListFlagsHandler } from './list-flags-handler.ts';
import { expect } from '@std/expect';

const listFlagHandler = new ListFlagsHandler();

describe('ListFlagsHandler', () => {
  it('should return the correct command name', () => {
    expect(listFlagHandler.name).toBe('pop-listflags');
  });

  it('should return the correct description', () => {
    expect(listFlagHandler.description).toBe('List all available PoP flags.');
  });

  it('should return flags by tier', () => {
    const tierFlags = listFlagHandler.listFlags();

    expect(tierFlags).toBe(
      `## Tier 1:\n* **Plane of Knowledge**: Initial access to PoP content\n* **Plane of Disease Access**: Spoke to Adler Fuirstel in Plane of Tranquility\n* **Defeated Grummus**: Killed Grummus in Plane of Disease\n* **Crypt of Decay Access**: Jumped into pit from Plane of Disease\n* **Plane of Justice Access**: Spoke with Mavuin in Plane of Justice\n* **Completed a Justice Trial**: Completed any of the 6 trials in Plane of Justice\n* **Spoke to Tribunal**: Spoke to The Tribunal after trial completion\n* **Justice Path Complete**: Returned to Mavuin after speaking with Tribunal\n* **Plane of Innovation Access**: Access to the factory floor\n* **Defeated Manaetic Behemoth**: Killed Manaetic Behemoth in Plane of Innovation\n* **Plane of Nightmare Access**: Spoke to Adroha Jezith in Tranquility\n* **Completed Hedge Maze**: Completed Hedge Maze event in Plane of Nightmare\n* **Defeated Terris Thule**: Killed Terris Thule in Plane of Nightmare B\n* **Nightmare Path Complete**: Reported back to Elder Poxbourne in Tranquility\n## Tier 2:\n* **Crypt of Decay Access**: Spoke with Elder Fuirstel in Plane of Tranquility\n* **Completed Carprin Event**: Completed Carprin event in Crypt of Decay\n* **Defeated Bertoxxulous**: Killed Bertoxxulous in Crypt of Decay\n* **Decay Path Complete**: Reported back to Elder Fuirstel in Tranquility\n* **Plane of Torment Access**: Spoke with Fahlia Shadyglade in Tranquility\n* **Defeated Keeper of Sorrows**: Completed Keeper of Sorrows event in Torment\n* **Defeated Saryrn**: Killed Saryrn in Plane of Torment\n* **Plane of Storms Access**: Completed Askr's collection quest\n* **Bastion of Thunder Access**: Zoned into Bastion of Thunder from Storms\n* **Plane of Valor Access**: Access to Aerin'Dar in Plane of Valor\n* **Defeated Aerin'Dar**: Killed Aerin'Dar in Plane of Valor\n* **Halls of Honor Access**: Zoned into Halls of Honor from Valor\n## Tier 3:\n* **Defeated Agnarr**: Completed Agnarr the Storm Lord event in BoThunder\n* **Completed HoH Trials**: Completed all three trials in Halls of Honor A\n* **Defeated Mithaniel Marr**: Killed Mithaniel Marr in Halls of Honor B\n* **Plane of Tactics Access**: Access to the Zek brothers\n* **Defeated Vallon Zek**: Killed Vallon Zek in Plane of Tactics\n* **Defeated Tallon Zek**: Killed Tallon Zek in Plane of Tactics\n* **Defeated Rallos Zek**: Killed Rallos Zek in Plane of Tactics\n* **Solusek Ro Tower Access**: Access to Solusek Ro Tower\n* **Defeated SolRo Minibosses**: Defeated all five minibosses in SolRo Tower\n* **Defeated Solusek Ro**: Killed Solusek Ro in his tower\n## Tier 4:\n* **Plane of Fire Access**: Zoned into Plane of Fire from SolRo's chamber\n* **Defeated Fennin Ro**: Killed Fennin Ro in Plane of Fire\n* **Plane of Air Access**: Access to Xegony in Plane of Air\n* **Defeated Xegony**: Killed Xegony in Plane of Air\n* **Plane of Water Access**: Access to Coirnav in Plane of Water\n* **Defeated Coirnav**: Killed Coirnav in Plane of Water\n* **Plane of Earth Access**: Access to The Rathe in Plane of Earth\n* **Defeated The Rathe**: Killed The Rathe Council in Plane of Earth B\n## Tier 5:\n* **Elementals Complete**: Defeated all four elemental gods\n* **Plane of Time A**: Access to Time phase 1\n* **Plane of Time B (Quarm)**: Defeated the Gods in Time A to access Quarm`,
    );
  });
});
