'use client';
import { Player } from '@/types/campaign';
import { Button } from '@/components/ui/button';

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
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: player.color }}
              >
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium">{player.name}</div>
                <div className="text-xs text-gray-500">
                  Posição: ({player.position.x}, {player.position.y})
                </div>
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
        ))}
      </div>
    </div>
  );
}