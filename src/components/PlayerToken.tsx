"use client";
import { useState, useEffect } from "react";
import { Player, Position } from "@/types/campaign";

interface PlayerTokenProps {
  player: Player;
  gridSize: number;
  onMove: (position: Position) => void;
  zoom?: number;
}

export function PlayerToken({
  player,
  gridSize,
  onMove,
  zoom = 1,
}: PlayerTokenProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isNewToken, setIsNewToken] = useState(true);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsNewToken(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      setHasMoved(true);

      // Posicionar o token exatamente onde está o cursor
      const rect = document
        .querySelector(".map-transform")
        ?.getBoundingClientRect();
      if (rect) {
        const mapX = (e.clientX - rect.left) / zoom;
        const mapY = (e.clientY - rect.top) / zoom;

        // Centralizar o token no cursor
        setDragOffset({
          x: mapX - gridSize / 2,
          y: mapY - gridSize / 2,
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;

      setIsDragging(false);

      // Só calcular nova posição se houve movimento
      if (hasMoved) {
        // Calcular posição final baseada no cursor
        const rect = document
          .querySelector(".map-transform")
          ?.getBoundingClientRect();
        if (rect) {
          const mapX = (e.clientX - rect.left) / zoom;
          const mapY = (e.clientY - rect.top) / zoom;

          // Converter para posição de grid simples
          const gridX = Math.round(mapX / gridSize);
          const gridY = Math.round(mapY / gridSize);

          // Calcular limites baseado no tamanho real do mapa
          const mapWidth =
            typeof window !== "undefined"
              ? Math.max(window.innerWidth, 2000)
              : 2000;
          const mapHeight =
            typeof window !== "undefined"
              ? Math.max(window.innerHeight, 2000)
              : 2000;

          const maxGridX = Math.floor(mapWidth / gridSize) - 1;
          const maxGridY = Math.floor(mapHeight / gridSize) - 1;

          const newX = Math.max(0, Math.min(maxGridX, gridX));
          const newY = Math.max(0, Math.min(maxGridY, gridY));

          onMove({ x: newX, y: newY });
        }
      }
      
      // Reset states
      setHasMoved(false);
      setDragOffset({
        x: 0,
        y: 0,
      });
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    hasMoved,
    gridSize,
    player.position.x,
    player.position.y,
    onMove,
    zoom,
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent map panning when dragging token
    setIsDragging(true);
    e.preventDefault();
  };

  // Token centralizado perfeitamente na grid
  const style = {
    left: isDragging && hasMoved ? dragOffset.x : player.position.x * gridSize,
    top: isDragging && hasMoved ? dragOffset.y : player.position.y * gridSize,
    width: gridSize,
    height: gridSize,
    backgroundColor: player.color,
    zIndex: isDragging ? 1000 : 10,
    border: "2px solid white",
    boxSizing: "border-box" as const,
    margin: 0,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      data-player-token="true"
      style={style}
      className={`absolute cursor-grab active:cursor-grabbing text-white font-bold shadow-lg select-none
        ${isDragging ? "opacity-80 scale-105" : "hover:scale-105"}
        ${isNewToken ? "token-enter" : ""}
        transition-transform duration-150
      `}
      title={`${player.name} - Posição: (${player.position.x}, ${player.position.y})`}
      onMouseDown={handleMouseDown}
    >
      <span style={{ fontSize: `${Math.max(gridSize * 0.3, 12)}px` }}>
        {player.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
