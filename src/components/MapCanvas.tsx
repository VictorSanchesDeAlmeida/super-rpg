'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { GameMap, Position } from '@/types/campaign';
import { GridOverlay } from './GridOverlay';
import { PlayerToken } from './PlayerToken';

interface MapCanvasProps {
  map: GameMap;
  onPlayerMove: (playerId: string, position: Position) => void;
}

export function MapCanvas({ map, onPlayerMove }: MapCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const zoomFactor = 0.1;
    const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
    const newZoom = Math.min(Math.max(0.2, zoom + delta), 3);
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate new pan to zoom towards center
      const zoomRatio = newZoom / zoom;
      setPan(prev => ({
        x: centerX - (centerX - prev.x) * zoomRatio,
        y: centerY - (centerY - prev.y) * zoomRatio
      }));
    }
    
    setZoom(newZoom);
  }, [zoom]);

  // Handle pan start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only pan with left mouse button and not when clicking on a player token
    if (e.button === 0 && !(e.target as HTMLElement).closest('[data-player-token]')) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, []);

  // Handle pan move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint]);

  // Handle pan end
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Setup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isPanning, handleMouseMove, handleMouseUp]);

  // Keep track of current map to reset zoom/pan when it changes  
  const [currentMapId, setCurrentMapId] = useState(map.id);
  
  // Reset zoom and pan when map changes (using useState pattern to avoid useEffect)
  if (currentMapId !== map.id) {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setCurrentMapId(map.id);
  }

  const transformStyle = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: '0 0'
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full relative bg-gray-900 overflow-hidden map-canvas ${isPanning ? 'panning' : ''}`}
      onMouseDown={handleMouseDown}
    >
      {/* Container do mapa com zoom e pan */}
      <div
        className="relative map-transform"
        style={{
          ...transformStyle,
          width: `${Math.max(map.width, typeof window !== 'undefined' ? window.innerWidth : 1920)}px`,
          height: `${Math.max(map.height, typeof window !== 'undefined' ? window.innerHeight : 1080)}px`,
        }}
      >
        <div
          className="absolute"
          style={{
            backgroundImage: `url(${map.imageUrl})`,
            backgroundSize: `${map.width}px ${map.height}px`,
            backgroundPosition: 'top left',
            backgroundRepeat: 'no-repeat',
            width: `${map.width}px`,
            height: `${map.height}px`,
          }}
        >
        </div>
        
        {/* Grid e tokens no mesmo nível que a imagem */}
        <GridOverlay
          gridConfig={map.gridConfig}
        />
        
        {map.players.map((player) => (
          <PlayerToken
            key={player.id}
            player={player}
            gridSize={map.gridConfig.cellSize}
            onMove={(position) => onPlayerMove(player.id, position)}
            zoom={zoom}
          />
        ))}
      </div>
      
      {/* Controles de zoom no canto inferior direito */}
      <div className="absolute bottom-4 right-4 zoom-controls rounded-lg p-2 flex flex-col gap-1">
        <button
          onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center text-lg font-bold"
          title="Zoom In (+)"
        >
          +
        </button>
        <div className="text-white text-xs text-center py-1">{Math.round(zoom * 100)}%</div>
        <button
          onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.2))}
          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center text-lg font-bold"
          title="Zoom Out (-)"
        >
          -
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="w-8 h-6 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center text-xs"
          title="Reset View (Home)"
        >
          🏠
        </button>
      </div>
      
      {/* Indicador de instruções no canto inferior esquerdo */}
      <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-80 rounded-lg p-2 text-white text-xs max-w-xs">
        <div className="font-semibold mb-1">🎮 Controles:</div>
        <div>🖱️ Scroll: Zoom in/out</div>
        <div>✋ Arrastar: Mover câmera</div>
        <div>🎯 Arrastar token: Mover personagem</div>
      </div>
    </div>
  );
}