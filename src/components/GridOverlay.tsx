'use client';
import { GridConfig } from '@/types/campaign';

interface GridOverlayProps {
  gridConfig: GridConfig;
}

export function GridOverlay({ gridConfig }: GridOverlayProps) {
  if (!gridConfig.visible) return null;

  const { cellSize, color, opacity } = gridConfig;
  
  // Usar a tela toda para o grid, garantindo alinhamento em (0,0)
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth * 2 : 3840;
  const screenHeight = typeof window !== 'undefined' ? (window.innerHeight) * 2 : 2160;

  const gridLines = [];
  const adjustedCellSize = cellSize;

  // Garantir que sempre temos linhas em x=0 e y=0
  const startX = -Math.ceil(screenWidth / adjustedCellSize) * adjustedCellSize;
  const endX = Math.ceil(screenWidth * 2 / adjustedCellSize) * adjustedCellSize;
  const startY = -Math.ceil(screenHeight / adjustedCellSize) * adjustedCellSize;
  const endY = Math.ceil(screenHeight * 2 / adjustedCellSize) * adjustedCellSize;

  // Linhas verticais
  for (let x = startX; x <= endX; x += adjustedCellSize) {
    gridLines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={startY}
        x2={x}
        y2={endY}
        stroke={color}
        strokeOpacity={opacity}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    );
  }

  // Linhas horizontais  
  for (let y = startY; y <= endY; y += adjustedCellSize) {
    gridLines.push(
      <line
        key={`h-${y}`}
        x1={startX}
        y1={y}
        x2={endX}
        y2={y}
        stroke={color}
        strokeOpacity={opacity}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    );
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ 
        zIndex: 1,
        width: '100%',
        height: '100%',
        overflow: 'visible'
      }}
    >
      {gridLines}
    </svg>
  );
}