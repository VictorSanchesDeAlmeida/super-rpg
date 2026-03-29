'use client';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

interface MapUploaderProps {
  onMapAdd: (file: File) => void;
}

export function MapUploader({ onMapAdd }: MapUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onMapAdd(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload map image"
      />
      <Button 
        onClick={openFileDialog}
        variant="outline"
        size="sm"
      >
        Adicionar Mapa
      </Button>
    </div>
  );
}