'use client';

import { ColorStop } from '@/types/gradient';
import { ColorStopItem } from './ColorStopItem';
import { nanoid } from 'nanoid';

interface ColorStopListProps {
  stops: ColorStop[];
  selectedStopId: string | null;
  onUpdate: (stops: ColorStop[]) => void;
  onSelectStop: (id: string) => void;
  translations: {
    colorStops: string;
    addColorStop: string;
    removeColorStop: string;
    minStopsWarning: string;
  };
}

export function ColorStopList({
  stops,
  selectedStopId,
  onUpdate,
  onSelectStop,
  translations,
}: ColorStopListProps) {
  const handleAddStop = () => {
    // Sort current stops to find a good position for the new stop
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);

    // Find the largest gap between stops
    let maxGap = 0;
    let maxGapPosition = 50;

    for (let i = 0; i < sortedStops.length - 1; i++) {
      const gap = sortedStops[i + 1].position - sortedStops[i].position;
      if (gap > maxGap) {
        maxGap = gap;
        maxGapPosition = sortedStops[i].position + gap / 2;
      }
    }

    // Check gaps at the edges (0% and 100%)
    if (sortedStops[0].position > maxGap) {
      maxGapPosition = sortedStops[0].position / 2;
    } else if (100 - sortedStops[sortedStops.length - 1].position > maxGap) {
      maxGapPosition = sortedStops[sortedStops.length - 1].position + (100 - sortedStops[sortedStops.length - 1].position) / 2;
    }

    const newStop: ColorStop = {
      id: nanoid(),
      color: '#888888',
      position: Math.round(maxGapPosition),
    };

    const newStops = [...stops, newStop];
    onUpdate(sortStops(newStops));
    onSelectStop(newStop.id);
  };

  const handleUpdateStop = (updatedStop: ColorStop) => {
    const newStops = stops.map((s) => (s.id === updatedStop.id ? updatedStop : s));
    onUpdate(sortStops(newStops));
  };

  const handleDeleteStop = (id: string) => {
    if (stops.length <= 2) return;
    const newStops = stops.filter((s) => s.id !== id);
    onUpdate(newStops);
    if (selectedStopId === id) {
      onSelectStop(newStops[0].id);
    }
  };

  const sortStops = (stopsToSort: ColorStop[]): ColorStop[] => {
    return [...stopsToSort].sort((a, b) => a.position - b.position);
  };

  const sortedStops = sortStops(stops);

  return (
    <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{translations.colorStops}</h3>
        <span className="text-sm text-hub-muted">
          {stops.length} {stops.length === 1 ? 'stop' : 'stops'}
        </span>
      </div>

      <div className="space-y-3">
        {sortedStops.map((stop) => (
          <ColorStopItem
            key={stop.id}
            stop={stop}
            isSelected={selectedStopId === stop.id}
            canDelete={stops.length > 2}
            onUpdate={handleUpdateStop}
            onDelete={() => handleDeleteStop(stop.id)}
            onSelect={() => onSelectStop(stop.id)}
            translations={{
              removeColorStop: translations.removeColorStop,
            }}
          />
        ))}
      </div>

      <button
        onClick={handleAddStop}
        className="
          w-full py-3 px-4 rounded-lg font-medium text-sm
          bg-hub-dark text-hub-accent border-2 border-hub-accent/30
          hover:bg-hub-accent/10 hover:border-hub-accent
          transition-all duration-200
          flex items-center justify-center gap-2
        "
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        {translations.addColorStop}
      </button>

      {stops.length <= 2 && (
        <p className="text-xs text-hub-muted text-center">{translations.minStopsWarning}</p>
      )}
    </div>
  );
}
