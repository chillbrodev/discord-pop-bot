export { popFlags, popFlagsLookup, tiers };
export type { Flag, Tier };

interface Tier {
  name: string;
  description: string;
  flags: Flag[];
}

interface Flag {
  id: string;
  name: string;
  description: string;
  dependsOn: string[];
}

// Early Access Flags
const earlyAccessFlags: Flag[] = [
  {
    id: "knowledge",
    name: "Plane of Knowledge",
    description: "Initial access to PoP content",
    dependsOn: [],
  },
];

// Disease Path
const diseasePathFlags: Flag[] = [
  {
    id: "disease_start",
    name: "Plane of Disease Access",
    description: "Spoke to Adler Fuirstel in Plane of Tranquility",
    dependsOn: ["knowledge"],
  },
  {
    id: "grummus",
    name: "Defeated Grummus",
    description: "Killed Grummus in Plane of Disease",
    dependsOn: ["disease_start"],
  },
  {
    id: "crypt_access",
    name: "Crypt of Decay Access",
    description: "Jumped into pit from Plane of Disease",
    dependsOn: ["grummus"],
  },
];

// Justice Path
const justicePathFlags: Flag[] = [
  {
    id: "justice_start",
    name: "Plane of Justice Access",
    description: "Spoke with Mavuin in Plane of Justice",
    dependsOn: ["knowledge"],
  },
  {
    id: "justice_trial",
    name: "Completed a Justice Trial",
    description: "Completed any of the 6 trials in Plane of Justice",
    dependsOn: ["justice_start"],
  },
  {
    id: "tribunal",
    name: "Spoke to Tribunal",
    description: "Spoke to The Tribunal after trial completion",
    dependsOn: ["justice_trial"],
  },
  {
    id: "justice_complete",
    name: "Justice Path Complete",
    description: "Returned to Mavuin after speaking with Tribunal",
    dependsOn: ["tribunal"],
  },
];

// Innovation Path
const innovationPathFlags: Flag[] = [
  {
    id: "innovation_start",
    name: "Plane of Innovation Access",
    description: "Access to the factory floor",
    dependsOn: ["knowledge"],
  },
  {
    id: "manaetic",
    name: "Defeated Manaetic Behemoth",
    description: "Killed Manaetic Behemoth in Plane of Innovation",
    dependsOn: ["innovation_start"],
  },
];

// Nightmare Path
const nightmarePathFlags: Flag[] = [
  {
    id: "nightmare_start",
    name: "Plane of Nightmare Access",
    description: "Spoke to Adroha Jezith in Tranquility",
    dependsOn: ["knowledge"],
  },
  {
    id: "hedge_maze",
    name: "Completed Hedge Maze",
    description: "Completed Hedge Maze event in Plane of Nightmare",
    dependsOn: ["nightmare_start"],
  },
  {
    id: "terris_thule",
    name: "Defeated Terris Thule",
    description: "Killed Terris Thule in Plane of Nightmare B",
    dependsOn: ["hedge_maze"],
  },
  {
    id: "nightmare_complete",
    name: "Nightmare Path Complete",
    description: "Reported back to Elder Poxbourne in Tranquility",
    dependsOn: ["terris_thule"],
  },
];

// Decay Path
const decayPathFlags: Flag[] = [
  {
    id: "decay_start",
    name: "Crypt of Decay Access",
    description: "Spoke with Elder Fuirstel in Plane of Tranquility",
    dependsOn: ["grummus"],
  },
  {
    id: "carprin",
    name: "Completed Carprin Event",
    description: "Completed Carprin event in Crypt of Decay",
    dependsOn: ["decay_start"],
  },
  {
    id: "bertoxxulous",
    name: "Defeated Bertoxxulous",
    description: "Killed Bertoxxulous in Crypt of Decay",
    dependsOn: ["carprin"],
  },
  {
    id: "decay_complete",
    name: "Decay Path Complete",
    description: "Reported back to Elder Fuirstel in Tranquility",
    dependsOn: ["bertoxxulous"],
  },
];

// Torment Path
const tormentPathFlags: Flag[] = [
  {
    id: "torment_start",
    name: "Plane of Torment Access",
    description: "Spoke with Fahlia Shadyglade in Tranquility",
    dependsOn: ["nightmare_complete", "decay_complete"],
  },
  {
    id: "keeper",
    name: "Defeated Keeper of Sorrows",
    description: "Completed Keeper of Sorrows event in Torment",
    dependsOn: ["torment_start"],
  },
  {
    id: "saryrn",
    name: "Defeated Saryrn",
    description: "Killed Saryrn in Plane of Torment",
    dependsOn: ["keeper"],
  },
];

// Storms/Valor Paths
const stormsValorPathFlags: Flag[] = [
  {
    id: "storms_access",
    name: "Plane of Storms Access",
    description: "Completed Askr's collection quest",
    dependsOn: ["justice_complete", "manaetic", "saryrn"],
  },
  {
    id: "bothunder_access",
    name: "Bastion of Thunder Access",
    description: "Zoned into Bastion of Thunder from Storms",
    dependsOn: ["storms_access"],
  },
  {
    id: "valor_access",
    name: "Plane of Valor Access",
    description: "Access to Aerin'Dar in Plane of Valor",
    dependsOn: ["justice_complete", "manaetic", "saryrn"],
  },
  {
    id: "aerindar",
    name: "Defeated Aerin'Dar",
    description: "Killed Aerin'Dar in Plane of Valor",
    dependsOn: ["valor_access"],
  },
  {
    id: "hohonora_access",
    name: "Halls of Honor Access",
    description: "Zoned into Halls of Honor from Valor",
    dependsOn: ["aerindar"],
  },
];

// Upper Tier Content
const upperTierContentFlags: Flag[] = [
  {
    id: "agnarr",
    name: "Defeated Agnarr",
    description: "Completed Agnarr the Storm Lord event in BoThunder",
    dependsOn: ["bothunder_access"],
  },
  {
    id: "hohonor_trials",
    name: "Completed HoH Trials",
    description: "Completed all three trials in Halls of Honor A",
    dependsOn: ["hohonora_access"],
  },
  {
    id: "mithaniel",
    name: "Defeated Mithaniel Marr",
    description: "Killed Mithaniel Marr in Halls of Honor B",
    dependsOn: ["hohonor_trials"],
  },
];

// Tactics Path
const tacticsPathFlags: Flag[] = [
  {
    id: "tactics_access",
    name: "Plane of Tactics Access",
    description: "Access to the Zek brothers",
    dependsOn: ["agnarr", "mithaniel"],
  },
  {
    id: "vallon",
    name: "Defeated Vallon Zek",
    description: "Killed Vallon Zek in Plane of Tactics",
    dependsOn: ["tactics_access"],
  },
  {
    id: "tallon",
    name: "Defeated Tallon Zek",
    description: "Killed Tallon Zek in Plane of Tactics",
    dependsOn: ["tactics_access"],
  },
  {
    id: "rallos",
    name: "Defeated Rallos Zek",
    description: "Killed Rallos Zek in Plane of Tactics",
    dependsOn: ["vallon", "tallon"],
  },
];

// Elemental Planes Access
const elementalPlanesAccessFlags: Flag[] = [
  {
    id: "solro_access",
    name: "Solusek Ro Tower Access",
    description: "Access to Solusek Ro Tower",
    dependsOn: ["rallos"],
  },
  {
    id: "solro_minibosses",
    name: "Defeated SolRo Minibosses",
    description: "Defeated all five minibosses in SolRo Tower",
    dependsOn: ["solro_access"],
  },
  {
    id: "solro",
    name: "Defeated Solusek Ro",
    description: "Killed Solusek Ro in his tower",
    dependsOn: ["solro_minibosses"],
  },
];

// Elemental Planes
const elementalPlanesFlags: Flag[] = [
  {
    id: "pofire_access",
    name: "Plane of Fire Access",
    description: "Zoned into Plane of Fire from SolRo's chamber",
    dependsOn: ["solro"],
  },
  {
    id: "fennin",
    name: "Defeated Fennin Ro",
    description: "Killed Fennin Ro in Plane of Fire",
    dependsOn: ["pofire_access"],
  },
  {
    id: "poair_access",
    name: "Plane of Air Access",
    description: "Access to Xegony in Plane of Air",
    dependsOn: ["solro"],
  },
  {
    id: "xegony",
    name: "Defeated Xegony",
    description: "Killed Xegony in Plane of Air",
    dependsOn: ["poair_access"],
  },
  {
    id: "powater_access",
    name: "Plane of Water Access",
    description: "Access to Coirnav in Plane of Water",
    dependsOn: ["solro"],
  },
  {
    id: "coirnav",
    name: "Defeated Coirnav",
    description: "Killed Coirnav in Plane of Water",
    dependsOn: ["powater_access"],
  },
  {
    id: "poearth_access",
    name: "Plane of Earth Access",
    description: "Access to The Rathe in Plane of Earth",
    dependsOn: ["solro"],
  },
  {
    id: "rathe",
    name: "Defeated The Rathe",
    description: "Killed The Rathe Council in Plane of Earth B",
    dependsOn: ["poearth_access"],
  },
];

// Time Access
const timeAccessFlags: Flag[] = [
  {
    id: "elementals_complete",
    name: "Elementals Complete",
    description: "Defeated all four elemental gods",
    dependsOn: ["fennin", "xegony", "coirnav", "rathe"],
  },
  {
    id: "timeA",
    name: "Plane of Time A",
    description: "Access to Time phase 1",
    dependsOn: ["elementals_complete"],
  },
  {
    id: "quarm",
    name: "Plane of Time B (Quarm)",
    description: "Defeated the Gods in Time A to access Quarm",
    dependsOn: ["timeA"],
  },
];

// Combine all flags into a single array for easy lookup
const popFlags: Flag[] = [
  ...earlyAccessFlags,
  ...diseasePathFlags,
  ...justicePathFlags,
  ...innovationPathFlags,
  ...nightmarePathFlags,
  ...decayPathFlags,
  ...tormentPathFlags,
  ...stormsValorPathFlags,
  ...upperTierContentFlags,
  ...tacticsPathFlags,
  ...elementalPlanesAccessFlags,
  ...elementalPlanesFlags,
  ...timeAccessFlags,
];

// Define tiers for organization
const tiers: Tier[] = [
  {
    name: "Tier 1",
    description: "Starting paths through the Planes of Power",
    flags: [
      ...earlyAccessFlags,
      ...diseasePathFlags,
      ...justicePathFlags,
      ...innovationPathFlags,
      ...nightmarePathFlags,
    ],
  },
  {
    name: "Tier 2",
    description: "Intermediate paths requiring Tier 1 completion",
    flags: [...decayPathFlags, ...tormentPathFlags, ...stormsValorPathFlags],
  },
  {
    name: "Tier 3",
    description: "Advanced progression requiring multiple paths",
    flags: [
      ...upperTierContentFlags,
      ...tacticsPathFlags,
      ...elementalPlanesAccessFlags,
    ],
  },
  {
    name: "Tier 4",
    description: "Elemental Planes",
    flags: [...elementalPlanesFlags],
  },
  {
    name: "Tier 5",
    description: "Final content tier",
    flags: [...timeAccessFlags],
  },
];

// Create an object for fast flag lookups by ID
const popFlagsLookup: { [key: string]: Flag } = {};
popFlags.forEach((flag) => {
  popFlagsLookup[flag.id] = {
    id: flag.id,
    name: flag.name,
    description: flag.description,
    dependsOn: flag.dependsOn,
  };
});
