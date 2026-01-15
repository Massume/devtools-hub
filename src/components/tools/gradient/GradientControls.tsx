'use client';

import { Gradient, LinearGradient, RadialGradient, ConicGradient } from '@/types/gradient';

interface GradientControlsProps {
  gradient: Gradient;
  onChange: (gradient: Gradient) => void;
  translations: {
    linear: string;
    radial: string;
    conic: string;
    angle: string;
    shape: string;
    position: string;
    circle: string;
    ellipse: string;
  };
}

export function GradientControls({ gradient, onChange, translations }: GradientControlsProps) {
  const handleTypeChange = (type: 'linear' | 'radial' | 'conic') => {
    if (gradient.type === type) return;

    const stops = gradient.stops;

    if (type === 'linear') {
      onChange({
        type: 'linear',
        angle: 90,
        stops,
      });
    } else if (type === 'radial') {
      onChange({
        type: 'radial',
        shape: 'circle',
        position: { x: 50, y: 50 },
        stops,
      });
    } else {
      onChange({
        type: 'conic',
        angle: 0,
        position: { x: 50, y: 50 },
        stops,
      });
    }
  };

  const handleAngleChange = (angle: number) => {
    if (gradient.type === 'linear' || gradient.type === 'conic') {
      onChange({ ...gradient, angle });
    }
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    if (gradient.type === 'radial' || gradient.type === 'conic') {
      onChange({
        ...gradient,
        position: {
          ...gradient.position,
          [axis]: value,
        },
      });
    }
  };

  const handleShapeChange = (shape: 'circle' | 'ellipse') => {
    if (gradient.type === 'radial') {
      onChange({ ...gradient, shape });
    }
  };

  return (
    <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-6">
      {/* Type Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-white">Gradient Type</label>
        <div className="flex gap-2">
          {(['linear', 'radial', 'conic'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200
                ${
                  gradient.type === type
                    ? 'bg-hub-accent text-hub-dark shadow-lg shadow-hub-accent/20'
                    : 'bg-hub-dark text-hub-muted hover:text-white hover:bg-hub-darker border border-hub-border'
                }
              `}
            >
              {translations[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Angle Control - For Linear and Conic */}
      {(gradient.type === 'linear' || gradient.type === 'conic') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white">{translations.angle}</label>
            <span className="text-hub-accent font-mono">{gradient.angle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={gradient.angle}
            onChange={(e) => handleAngleChange(Number(e.target.value))}
            className="w-full h-2 bg-hub-dark rounded-lg appearance-none cursor-pointer slider-thumb"
          />
        </div>
      )}

      {/* Shape Control - For Radial Only */}
      {gradient.type === 'radial' && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white">{translations.shape}</label>
          <div className="flex gap-2">
            {(['circle', 'ellipse'] as const).map((shape) => (
              <button
                key={shape}
                onClick={() => handleShapeChange(shape)}
                className={`
                  flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200
                  ${
                    gradient.shape === shape
                      ? 'bg-hub-accent text-hub-dark'
                      : 'bg-hub-dark text-hub-muted hover:text-white hover:bg-hub-darker border border-hub-border'
                  }
                `}
              >
                {translations[shape]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Position Controls - For Radial and Conic */}
      {(gradient.type === 'radial' || gradient.type === 'conic') && (
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-white">{translations.position}</label>

          {/* X Position */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-hub-muted">X</span>
              <span className="text-hub-accent font-mono">{gradient.position.x}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={gradient.position.x}
              onChange={(e) => handlePositionChange('x', Number(e.target.value))}
              className="w-full h-2 bg-hub-dark rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          {/* Y Position */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-hub-muted">Y</span>
              <span className="text-hub-accent font-mono">{gradient.position.y}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={gradient.position.y}
              onChange={(e) => handlePositionChange('y', Number(e.target.value))}
              className="w-full h-2 bg-hub-dark rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>
        </div>
      )}
    </div>
  );
}
