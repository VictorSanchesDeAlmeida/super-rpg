'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PlayerAdderProps {
  onAddPlayer: (name: string) => void;
  disabled?: boolean;
}

export function PlayerAdder({ onAddPlayer, disabled = false }: PlayerAdderProps) {
  const [playerName, setPlayerName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onAddPlayer(playerName.trim());
      setPlayerName('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Nome do personagem"
          autoFocus
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={!playerName.trim()}>
            Adicionar
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setIsAdding(false)}
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