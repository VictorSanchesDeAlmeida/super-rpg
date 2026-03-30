'use client';
import { useState, useCallback } from 'react';
import { GameMap, Player, Position, GridConfig, Campaign } from '@/types/campaign';
import { CreatePlayerInput } from '@/types/dnd';

export function useCampaignManager() {
  const [campaign, setCampaign] = useState<Campaign>({
    id: 'default',
    name: 'Minha Campanha',
    maps: [],
    activeMapId: null
  });

  // Adicionar um novo mapa
  const addMap = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const newMap: GameMap = {
          id: Date.now().toString(),
          name: file.name.split('.').slice(0, -1).join('.') || 'Novo Mapa',
          imageUrl: e.target?.result as string,
          width: img.width,
          height: img.height,
          gridConfig: {
            cellSize: 50,
            visible: true,
            color: '#000000',
            opacity: 0.3
          },
          players: []
        };

        setCampaign(prev => ({
          ...prev,
          maps: [...prev.maps, newMap],
          activeMapId: prev.activeMapId || newMap.id
        }));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  // Atualizar configuração do grid
  const updateGridConfig = useCallback((mapId: string, gridConfig: Partial<GridConfig>) => {
    setCampaign(prev => ({
      ...prev,
      maps: prev.maps.map(map =>
        map.id === mapId
          ? { ...map, gridConfig: { ...map.gridConfig, ...gridConfig } }
          : map
      )
    }));
  }, []);

  // Adicionar player ao mapa ativo
  const addPlayer = useCallback((playerInput: CreatePlayerInput) => {
    if (!campaign.activeMapId) return;

    const playerName = playerInput.name;

    // Posição inicial aleatória mas válida no grid
    const randomX = Math.floor(Math.random() * 10); // 0-9
    const randomY = Math.floor(Math.random() * 10); // 0-9

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: playerName,
      position: { x: randomX, y: randomY },
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      characterSheet: playerInput.characterSheet
    };

    setCampaign(prev => ({
      ...prev,
      maps: prev.maps.map(map =>
        map.id === prev.activeMapId
          ? { ...map, players: [...map.players, newPlayer] }
          : map
      )
    }));
  }, [campaign.activeMapId]);

  // Mover player
  const movePlayer = useCallback((mapId: string, playerId: string, position: Position) => {
    setCampaign(prev => ({
      ...prev,
      maps: prev.maps.map(map =>
        map.id === mapId
          ? {
              ...map,
              players: map.players.map(player =>
                player.id === playerId ? { ...player, position } : player
              )
            }
          : map
      )
    }));
  }, []);

  // Remover player
  const removePlayer = useCallback((mapId: string, playerId: string) => {
    setCampaign(prev => ({
      ...prev,
      maps: prev.maps.map(map =>
        map.id === mapId
          ? { ...map, players: map.players.filter(p => p.id !== playerId) }
          : map
      )
    }));
  }, []);

  // Trocar mapa ativo
  const setActiveMap = useCallback((mapId: string) => {
    setCampaign(prev => ({ ...prev, activeMapId: mapId }));
  }, []);

  // Remover mapa
  const removeMap = useCallback((mapId: string) => {
    setCampaign(prev => {
      const newMaps = prev.maps.filter(m => m.id !== mapId);
      return {
        ...prev,
        maps: newMaps,
        activeMapId: prev.activeMapId === mapId 
          ? (newMaps.length > 0 ? newMaps[0].id : null)
          : prev.activeMapId
      };
    });
  }, []);

  const activeMap = campaign.maps.find(m => m.id === campaign.activeMapId);

  return {
    campaign,
    activeMap,
    addMap,
    updateGridConfig,
    addPlayer,
    movePlayer,
    removePlayer,
    setActiveMap,
    removeMap
  };
}