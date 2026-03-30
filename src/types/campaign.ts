import { CharacterSheet } from '@/types/dnd';

export interface Position {
  x: number;
  y: number;
}

export interface GridConfig {
  cellSize: number; // tamanho do grid em pixels
  visible: boolean;
  color: string;
  opacity: number;
}

export interface Player {
  id: string;
  name: string;
  avatar?: string; // URL da imagem do personagem
  position: Position;
  color: string; // cor do token do player
  characterSheet?: CharacterSheet;
}

export interface GameMap {
  id: string;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  gridConfig: GridConfig;
  players: Player[];
}

export interface Campaign {
  id: string;
  name: string;
  maps: GameMap[];
  activeMapId: string | null;
}

export type DragItem = {
  id: string;
  type: 'player';
  originalPosition: Position;
};