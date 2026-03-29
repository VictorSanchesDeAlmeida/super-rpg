'use client';

import { useCampaignManager } from '@/hooks/useCampaignManager';
import { MapUploader } from '@/components/MapUploader';
import { PlayerAdder } from '@/components/PlayerAdder';
import { MapCanvas } from '@/components/MapCanvas';
import { GridControls } from '@/components/GridControls';
import { MapSelector } from '@/components/MapSelector';
import { PlayerList } from '@/components/PlayerList';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function Home() {
  const {
    campaign,
    activeMap,
    addMap,
    updateGridConfig,
    addPlayer,
    movePlayer,
    removePlayer,
    setActiveMap,
    removeMap
  } = useCampaignManager();

  return (
    <div className="h-screen bg-gray-900 overflow-hidden">
      {/* Header fixo */}
      <header className="bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">
          {campaign.name} - Mestre de RPG
        </h1>
        
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="text-white border-gray-600 hover:bg-gray-700">
                Gerenciar Campanha
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Gerenciar Campanha</SheetTitle>
                <SheetDescription>
                  Configure suas campanhas, mapas e personagens.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Adicionar Conteúdo</h3>
                  <div className="space-y-3">
                    <MapUploader onMapAdd={addMap} />
                    <PlayerAdder 
                      onAddPlayer={addPlayer} 
                      disabled={!activeMap}
                    />
                  </div>
                </div>

                {campaign.maps.length > 0 && (
                  <div>
                    <MapSelector
                      maps={campaign.maps}
                      activeMapId={campaign.activeMapId}
                      onMapSelect={setActiveMap}
                      onMapRemove={removeMap}
                    />
                  </div>
                )}

                {activeMap && (
                  <div>
                    <PlayerList
                      players={activeMap.players}
                      onPlayerRemove={(playerId) => removePlayer(activeMap.id, playerId)}
                    />
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          {activeMap && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="text-white border-gray-600 hover:bg-gray-700">
                  Controles do Grid
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Controles do Grid</SheetTitle>
                  <SheetDescription>
                    Configure a aparência e comportamento do grid.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <GridControls
                    gridConfig={activeMap.gridConfig}
                    onConfigChange={(config) => 
                      updateGridConfig(activeMap.id, config)
                    }
                  />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </header>

      {/* Área principal do mapa - ocupa toda a tela */}
      <main className="h-[calc(100vh-60px)] overflow-hidden">
        {activeMap ? (
          <MapCanvas
            map={activeMap}
            onPlayerMove={(playerId, position) => 
              movePlayer(activeMap.id, playerId, position)
            }
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-800 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                🎲 Bem-vindo ao Mestre de RPG!
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                Para começar, adicione um mapa à sua campanha usando o painel de gerenciamento.
              </p>
              <div className="text-sm text-gray-400 space-y-2">
                <p>✨ Funcionalidades disponíveis:</p>
                <ul className="list-disc list-inside space-y-1 max-w-md mx-auto">
                  <li>Upload de mapas (JPG, PNG, etc.)</li>
                  <li>Sistema de grid customizável</li>
                  <li>Adição e remoção de personagens</li>
                  <li>Movimento com drag & drop</li>
                  <li>Alternância entre múltiplos mapas</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}