'use client';
import { Player } from '@/types/campaign';
import { Button } from '@/components/ui/button';
import races from '@/data/dnd/races.json';
import classes from '@/data/dnd/classes.json';
import weapons from '@/data/dnd/weapons.json';
import { DndClass, DndRace, DndWeapon } from '@/types/dnd';

const dndRaces = races as DndRace[];
const dndClasses = classes as DndClass[];
const dndWeapons = weapons as DndWeapon[];

interface PlayerListProps {
  players: Player[];
  onPlayerRemove: (playerId: string) => void;
}

export function PlayerList({ players, onPlayerRemove }: PlayerListProps) {
  if (players.length === 0) {
    return (
      <div className="p-3 text-center text-gray-500 text-sm border border-dashed rounded">
        Nenhum personagem no mapa
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">
        Personagens no Mapa ({players.length})
      </h3>
      <div className="space-y-1">
        {players.map((player) => {
          const dndSheet = player.characterSheet?.type === 'dnd5e' ? player.characterSheet : null;
          const raceName = dndSheet
            ? dndRaces.find((race) => race.id === dndSheet.raceId)?.name ?? 'Raca'
            : null;
          const className = dndSheet
            ? dndClasses.find((characterClass) => characterClass.id === dndSheet.classId)?.name ?? 'Classe'
            : null;
          const weaponName = dndSheet
            ? dndWeapons.find((weapon) => weapon.id === dndSheet.weaponId)?.name ?? 'Arma'
            : null;

          return (
            <div
              key={player.id}
              className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: player.color }}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium">{player.name}</div>
                  <div className="text-xs text-gray-500">
                    Posição: ({player.position.x}, {player.position.y})
                  </div>
                  {dndSheet && (
                    <div className="text-xs text-gray-500">
                      D&D nv 1 - {raceName} {className} ({weaponName})
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onPlayerRemove(player.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                ×
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}