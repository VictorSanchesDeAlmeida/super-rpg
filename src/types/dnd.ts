export type AbilityKey =
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma';

export interface DndRace {
  id: string;
  name: string;
  description: string;
  abilityBonus: Partial<Record<AbilityKey | 'all', number>>;
  grantedSkillIds: string[];
  speed: number;
  traits: string[];
}

export interface DndClass {
  id: string;
  name: string;
  description: string;
  hitDie: string;
  primaryAbility: AbilityKey[];
  level1AbilityBonus: Partial<Record<AbilityKey, number>>;
  grantedSkillIds: string[];
  allowedWeaponIds: string[];
  proficiencies: string[];
  spellcaster: boolean;
}

export interface DndSkill {
  id: string;
  name: string;
  description: string;
  ability: AbilityKey;
}

export interface DndSpell {
  id: string;
  name: string;
  level: number;
  school: string;
  classes: string[];
  description: string;
}

export interface DndWeapon {
  id: string;
  name: string;
  description: string;
  category: string;
  damage: string;
  damageType: string;
  properties: string[];
  classes: string[];
}

export interface DndCharacterSheet {
  type: 'dnd5e';
  level: 1;
  raceId: string;
  classId: string;
  weaponId: string;
  abilityScores: Record<AbilityKey, number>;
  skillIds: string[];
  spellIds: string[];
}

export type CharacterSheet = DndCharacterSheet;

export interface CreatePlayerInput {
  name: string;
  characterSheet?: CharacterSheet;
}
