'use client';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import races from '@/data/dnd/races.json';
import classes from '@/data/dnd/classes.json';
import skills from '@/data/dnd/skills.json';
import spells from '@/data/dnd/spells.json';
import weapons from '@/data/dnd/weapons.json';
import {
  AbilityKey,
  CreatePlayerInput,
  DndClass,
  DndRace,
  DndSkill,
  DndSpell,
  DndWeapon
} from '@/types/dnd';

interface PlayerAdderProps {
  onAddPlayer: (input: CreatePlayerInput) => void;
  disabled?: boolean;
}

const dndRaces = races as DndRace[];
const dndClasses = classes as DndClass[];
const dndSkills = skills as DndSkill[];
const dndSpells = spells as DndSpell[];
const dndWeapons = weapons as DndWeapon[];

const ABILITY_LABELS: Record<AbilityKey, string> = {
  strength: 'Forca',
  dexterity: 'Destreza',
  constitution: 'Constituicao',
  intelligence: 'Inteligencia',
  wisdom: 'Sabedoria',
  charisma: 'Carisma'
};

const DEFAULT_ABILITY_SCORES: Record<AbilityKey, number> = {
  strength: 15,
  dexterity: 14,
  constitution: 13,
  intelligence: 12,
  wisdom: 10,
  charisma: 8
};

function applyAbilityBonuses(
  baseScores: Record<AbilityKey, number>,
  raceBonus: Partial<Record<AbilityKey | 'all', number>>,
  classBonus: Partial<Record<AbilityKey, number>>
) {
  const nextScores = { ...baseScores };
  const globalBonus = raceBonus.all ?? 0;

  (Object.keys(nextScores) as AbilityKey[]).forEach((ability) => {
    const raceSpecific = raceBonus[ability] ?? 0;
    const classSpecific = classBonus[ability] ?? 0;
    nextScores[ability] = Math.max(1, Math.min(20, nextScores[ability] + globalBonus + raceSpecific + classSpecific));
  });

  return nextScores;
}

function getAbilityModifier(score: number) {
  return Math.floor((score - 10) / 2);
}

export function PlayerAdder({ onAddPlayer, disabled = false }: PlayerAdderProps) {
  const [playerName, setPlayerName] = useState('');
  const [sheetType] = useState<'dnd5e'>('dnd5e');
  const [raceId, setRaceId] = useState(dndRaces[0]?.id ?? '');
  const [classId, setClassId] = useState(dndClasses[0]?.id ?? '');
  const [weaponId, setWeaponId] = useState('');
  const [selectedOptionalSkillIds, setSelectedOptionalSkillIds] = useState<string[]>([]);
  const [selectedSpellIds, setSelectedSpellIds] = useState<string[]>([]);
  const [abilityScores, setAbilityScores] = useState(DEFAULT_ABILITY_SCORES);
  const [isAdding, setIsAdding] = useState(false);

  const selectedClass = useMemo(
    () => dndClasses.find((characterClass) => characterClass.id === classId),
    [classId]
  );

  const selectedRace = useMemo(
    () => dndRaces.find((race) => race.id === raceId),
    [raceId]
  );

  const forcedSkillIds = useMemo(() => {
    const raceSkillIds = selectedRace?.grantedSkillIds ?? [];
    const classSkillIds = selectedClass?.grantedSkillIds ?? [];

    return [...new Set([...raceSkillIds, ...classSkillIds])];
  }, [selectedClass, selectedRace]);

  const availableWeapons = useMemo(
    () => dndWeapons.filter((weapon) => selectedClass?.allowedWeaponIds.includes(weapon.id)),
    [selectedClass]
  );

  const availableSpells = useMemo(
    () => dndSpells.filter((spell) => spell.classes.includes(classId)),
    [classId]
  );

  const isSpellcaster = !!selectedClass?.spellcaster;

  const effectiveWeaponId = useMemo(() => {
    if (availableWeapons.some((weapon) => weapon.id === weaponId)) {
      return weaponId;
    }

    return availableWeapons[0]?.id ?? '';
  }, [availableWeapons, weaponId]);

  const selectedSkillIds = useMemo(
    () => [...new Set([...forcedSkillIds, ...selectedOptionalSkillIds])],
    [forcedSkillIds, selectedOptionalSkillIds]
  );

  const optionalSkillLimit = 2;

  const finalAbilityScores = useMemo(
    () =>
      applyAbilityBonuses(
        abilityScores,
        selectedRace?.abilityBonus ?? {},
        selectedClass?.level1AbilityBonus ?? {}
      ),
    [abilityScores, selectedClass, selectedRace]
  );

  const resetForm = () => {
    setPlayerName('');
    setRaceId(dndRaces[0]?.id ?? '');
    setClassId(dndClasses[0]?.id ?? '');
    setWeaponId(dndClasses[0]?.allowedWeaponIds[0] ?? '');
    setSelectedOptionalSkillIds([]);
    setSelectedSpellIds([]);
    setAbilityScores(DEFAULT_ABILITY_SCORES);
    setIsAdding(false);
  };

  const toggleSkill = (skillId: string) => {
    if (forcedSkillIds.includes(skillId)) {
      return;
    }

    setSelectedOptionalSkillIds((prev) => {
      if (prev.includes(skillId)) {
        return prev.filter((id) => id !== skillId);
      }

      if (prev.length >= optionalSkillLimit) {
        return prev;
      }

      return [...prev, skillId];
    });
  };

  const toggleSpell = (spellId: string) => {
    setSelectedSpellIds((prev) => {
      if (prev.includes(spellId)) {
        return prev.filter((id) => id !== spellId);
      }

      if (prev.length >= 2) {
        return prev;
      }

      return [...prev, spellId];
    });
  };

  const updateAbility = (ability: AbilityKey, value: string) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;

    setAbilityScores((prev) => ({
      ...prev,
      [ability]: Math.max(1, Math.min(20, Math.floor(parsed)))
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName.trim() || !raceId || !classId || !effectiveWeaponId || selectedSkillIds.length === 0) {
      return;
    }

    onAddPlayer({
      name: playerName.trim(),
      characterSheet: {
        type: sheetType,
        level: 1,
        raceId,
        classId,
        weaponId: effectiveWeaponId,
        abilityScores: finalAbilityScores,
        skillIds: selectedSkillIds,
        spellIds: isSpellcaster ? selectedSpellIds : []
      }
    });

    resetForm();
  };

  const canSubmit =
    !!playerName.trim() &&
    !!raceId &&
    !!classId &&
    !!effectiveWeaponId &&
    selectedSkillIds.length > 0 &&
    (!isSpellcaster || selectedSpellIds.length > 0);

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Nome do personagem"
          autoFocus
        />
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Tipo da ficha</label>
          <select
            defaultValue={sheetType}
            className="w-full rounded-md border border-gray-300 px-2 py-2 text-sm"
          >
            <option value="dnd5e">D&D 5e</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-gray-600">Raca</label>
            <select
              defaultValue={raceId}
              onChange={(e) => setRaceId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-2 py-2 text-sm"
            >
              {dndRaces.map((race) => (
                <option key={race.id} value={race.id}>
                  {race.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-600">Classe</label>
            <select
              defaultValue={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setWeaponId('');
                setSelectedSpellIds([]);
              }}
              className="w-full rounded-md border border-gray-300 px-2 py-2 text-sm"
            >
              {dndClasses.map((characterClass) => (
                <option key={characterClass.id} value={characterClass.id}>
                  {characterClass.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-600">Arma inicial</label>
          <select
            value={effectiveWeaponId}
            onChange={(e) => setWeaponId(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-2 py-2 text-sm"
          >
            <option value="">Selecione uma arma</option>
            {availableWeapons.map((weapon) => (
              <option key={weapon.id} value={weapon.id}>
                {weapon.name} ({weapon.damage})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 rounded-md border border-gray-200 p-2">
          <h4 className="text-xs font-semibold text-gray-700">Atributos (nivel 1)</h4>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ABILITY_LABELS) as AbilityKey[]).map((ability) => (
              <div key={ability} className="space-y-1">
                <label className="text-xs text-gray-600">{ABILITY_LABELS[ability]}</label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={abilityScores[ability]}
                  onChange={(e) => updateAbility(ability, e.target.value)}
                />
                <div className="text-[11px] text-gray-500">
                  Final: {finalAbilityScores[ability]} | Mod: {getAbilityModifier(finalAbilityScores[ability]) >= 0 ? '+' : ''}{getAbilityModifier(finalAbilityScores[ability])}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 rounded-md border border-gray-200 p-2">
          <h4 className="text-xs font-semibold text-gray-700">Pericias (escolha ate 2)</h4>
          <div className="grid grid-cols-2 gap-1">
            {dndSkills.map((skill) => {
              const checked = selectedSkillIds.includes(skill.id);
              const blocked = !checked && selectedOptionalSkillIds.length >= optionalSkillLimit;
              const forced = forcedSkillIds.includes(skill.id);

              return (
                <label key={skill.id} className="flex items-center gap-1 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={blocked || forced}
                    onChange={() => toggleSkill(skill.id)}
                  />
                  <span>{skill.name}{forced ? ' (automatica)' : ''}</span>
                </label>
              );
            })}
          </div>
        </div>

        {isSpellcaster && (
          <div className="space-y-2 rounded-md border border-gray-200 p-2">
            <h4 className="text-xs font-semibold text-gray-700">Magias (escolha ate 2)</h4>
            <div className="space-y-1">
              {availableSpells.map((spell) => {
                const checked = selectedSpellIds.includes(spell.id);
                const blocked = !checked && selectedSpellIds.length >= 2;

                return (
                  <label key={spell.id} className="flex items-center gap-1 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={blocked}
                      onChange={() => toggleSpell(spell.id)}
                    />
                    <span>
                      {spell.name} (nv {spell.level})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={!canSubmit}>
            Adicionar
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={resetForm}
          >
            Cancelar
          </Button>
        </div>
      </form>
    );
  }

  return (
    <Button 
      onClick={() => setIsAdding(true)}
      variant="outline"
      size="sm"
      disabled={disabled}
      className="w-full"
    >
      Adicionar Personagem
    </Button>
  );
}