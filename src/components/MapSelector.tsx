'use client';
import { GameMap } from '@/types/campaign';
import { Button } from '@/components/ui/button';

interface MapSelectorProps {
  maps: GameMap[];
  activeMapId: string | null;
  onMapSelect: (mapId: string) => void;
  onMapRemove: (mapId: string) => void;
}

export function MapSelector({ maps, activeMapId, onMapSelect, onMapRemove }: MapSelectorProps) {
  if (maps.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 border border-dashed rounded-lg">
        Nenhum mapa adicionado ainda. Use o botão &quot;Adicionar Mapa&quot; para começar.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Mapas da Campanha</h3>
      <div className="grid gap-2">
        {maps.map((map) => (
          <div
            key={map.id}
            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
              activeMapId === map.id
                ? 'bg-blue-50 border-blue-200'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onMapSelect(map.id)}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-8 bg-gray-200 rounded border"
                style={{
                  backgroundImage: `url(${map.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div>
                <div className="text-sm font-medium">{map.name}</div>
                <div className="text-xs text-gray-500">
                  {map.players.length} personagem{map.players.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {activeMapId === map.id && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  Ativo
                </span>
              )}
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onMapRemove(map.id);
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}