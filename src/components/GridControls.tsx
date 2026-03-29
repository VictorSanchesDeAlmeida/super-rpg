'use client';
import { GridConfig } from '@/types/campaign';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface GridControlsProps {
  gridConfig: GridConfig;
  onConfigChange: (config: Partial<GridConfig>) => void;
}

export function GridControls({ gridConfig, onConfigChange }: GridControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Visibilidade do Grid</span>
        <Button
          variant={gridConfig.visible ? "default" : "outline"}
          size="sm"
          onClick={() => onConfigChange({ visible: !gridConfig.visible })}
        >
          {gridConfig.visible ? 'Ocultar' : 'Mostrar'}
        </Button>
      </div>

      {gridConfig.visible && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tamanho da Célula: {gridConfig.cellSize}px
            </label>
            <Slider
              value={[gridConfig.cellSize]}
              onValueChange={(value) => onConfigChange({ cellSize: value[0] })}
              max={100}
              min={20}
              step={10}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Opacidade: {Math.round(gridConfig.opacity * 100)}%
            </label>
            <Slider
              value={[gridConfig.opacity]}
              onValueChange={(value) => onConfigChange({ opacity: value[0] })}
              max={1}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cor do Grid:</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={gridConfig.color}
                onChange={(e) => onConfigChange({ color: e.target.value })}
                className="w-12 h-8 border rounded cursor-pointer"
              />
              <span className="text-xs text-muted-foreground">{gridConfig.color}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}