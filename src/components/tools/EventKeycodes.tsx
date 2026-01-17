'use client';

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getEventKeycodesTranslations } from '@/lib/i18n-event-keycodes';
import toast from 'react-hot-toast';

interface KeyEventData {
  key: string;
  code: string;
  keyCode: number;
  which: number;
  location: number;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  repeat: boolean;
  timestamp: number;
}

const COMMON_KEYS = [
  { key: 'Enter', code: 'Enter', keyCode: 13 },
  { key: 'Escape', code: 'Escape', keyCode: 27 },
  { key: 'Tab', code: 'Tab', keyCode: 9 },
  { key: 'Backspace', code: 'Backspace', keyCode: 8 },
  { key: 'Delete', code: 'Delete', keyCode: 46 },
  { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
  { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
  { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
  { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
  { key: ' ', code: 'Space', keyCode: 32 },
];

export function EventKeycodes() {
  const { locale } = useI18n();
  const t = getEventKeycodesTranslations(locale);

  const [currentEvent, setCurrentEvent] = useState<KeyEventData | null>(null);
  const [history, setHistory] = useState<KeyEventData[]>([]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();

    const eventData: KeyEventData = {
      key: e.key,
      code: e.code,
      keyCode: e.keyCode,
      which: e.which,
      location: e.location,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
      repeat: e.repeat,
      timestamp: Date.now(),
    };

    setCurrentEvent(eventData);
    setHistory(prev => [eventData, ...prev.slice(0, 9)]);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getLocationName = (location: number): string => {
    switch (location) {
      case 0: return t.locationStandard;
      case 1: return t.locationLeft;
      case 2: return t.locationRight;
      case 3: return t.locationNumpad;
      default: return String(location);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const generateCodeSnippet = (event: KeyEventData): string => {
    return `document.addEventListener('keydown', (e) => {
  if (e.key === '${event.key}'${event.ctrlKey ? ' && e.ctrlKey' : ''}${event.shiftKey ? ' && e.shiftKey' : ''}${event.altKey ? ' && e.altKey' : ''}${event.metaKey ? ' && e.metaKey' : ''}) {
    e.preventDefault();
    // Your code here
  }
});`;
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const formatKey = (key: string): string => {
    if (key === ' ') return 'Space';
    if (key.length === 1) return key.toUpperCase();
    return key;
  };

  return (
    <div className="space-y-6">
      {/* Key Display */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-8 text-center">
        {currentEvent ? (
          <>
            <div className="text-6xl font-bold text-hub-accent mb-4 font-mono">
              {formatKey(currentEvent.key)}
            </div>
            <div className="text-lg text-hub-muted">
              {t.code}: <span className="text-white font-mono">{currentEvent.code}</span>
            </div>
          </>
        ) : (
          <div className="text-xl text-hub-muted py-8">
            {t.pressKey}
          </div>
        )}
      </div>

      {/* Event Data */}
      {currentEvent && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-4">{t.eventData}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-hub-darker rounded-lg p-3">
              <div className="text-xs text-hub-muted mb-1">{t.key}</div>
              <div className="text-lg font-mono text-white">{currentEvent.key}</div>
            </div>
            <div className="bg-hub-darker rounded-lg p-3">
              <div className="text-xs text-hub-muted mb-1">{t.code}</div>
              <div className="text-lg font-mono text-hub-accent">{currentEvent.code}</div>
            </div>
            <div className="bg-hub-darker rounded-lg p-3">
              <div className="text-xs text-hub-muted mb-1">{t.keyCode}</div>
              <div className="text-lg font-mono text-yellow-400">{currentEvent.keyCode}</div>
            </div>
            <div className="bg-hub-darker rounded-lg p-3">
              <div className="text-xs text-hub-muted mb-1">{t.which}</div>
              <div className="text-lg font-mono text-yellow-400">{currentEvent.which}</div>
            </div>
            <div className="bg-hub-darker rounded-lg p-3">
              <div className="text-xs text-hub-muted mb-1">{t.location}</div>
              <div className="text-lg font-mono text-white">
                {currentEvent.location} ({getLocationName(currentEvent.location)})
              </div>
            </div>
            <div className="bg-hub-darker rounded-lg p-3">
              <div className="text-xs text-hub-muted mb-1">{t.repeat}</div>
              <div className={`text-lg font-mono ${currentEvent.repeat ? 'text-green-400' : 'text-hub-muted'}`}>
                {currentEvent.repeat ? t.true : t.false}
              </div>
            </div>
          </div>

          {/* Modifiers */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-hub-muted mb-3">{t.modifiers}</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'ctrlKey', label: 'Ctrl', active: currentEvent.ctrlKey },
                { key: 'shiftKey', label: 'Shift', active: currentEvent.shiftKey },
                { key: 'altKey', label: 'Alt', active: currentEvent.altKey },
                { key: 'metaKey', label: 'Meta', active: currentEvent.metaKey },
              ].map(mod => (
                <span
                  key={mod.key}
                  className={`px-3 py-1 rounded-lg text-sm font-mono ${
                    mod.active
                      ? 'bg-hub-accent text-hub-darker'
                      : 'bg-hub-darker text-hub-muted'
                  }`}
                >
                  {mod.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Code Snippet */}
      {currentEvent && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-hub-muted">{t.codeSnippet}</h3>
            <button
              onClick={() => handleCopy(generateCodeSnippet(currentEvent))}
              className="text-sm text-hub-accent hover:underline"
            >
              {t.copyCode}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
              {generateCodeSnippet(currentEvent)}
            </pre>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-hub-muted">{t.history}</h3>
            <button
              onClick={clearHistory}
              className="text-xs text-hub-accent hover:underline"
            >
              {t.clearHistory}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((event, index) => (
              <div
                key={event.timestamp}
                onClick={() => setCurrentEvent(event)}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  index === 0 ? 'bg-hub-accent text-hub-darker' : 'bg-hub-darker hover:bg-hub-dark'
                }`}
              >
                <div className="text-sm font-mono font-bold">{formatKey(event.key)}</div>
                <div className="text-xs opacity-70">{event.code}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Keys Reference */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.commonKeys}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hub-border">
                <th className="text-left py-2 px-3 text-hub-muted font-medium">{t.keyName}</th>
                <th className="text-left py-2 px-3 text-hub-muted font-medium">{t.key}</th>
                <th className="text-left py-2 px-3 text-hub-muted font-medium">{t.code}</th>
                <th className="text-left py-2 px-3 text-hub-muted font-medium">keyCode</th>
              </tr>
            </thead>
            <tbody>
              {COMMON_KEYS.map((k, index) => (
                <tr key={index} className="border-b border-hub-border/50">
                  <td className="py-2 px-3 font-medium text-white">{formatKey(k.key)}</td>
                  <td className="py-2 px-3 font-mono text-hub-accent">{k.key === ' ' ? "' '" : `'${k.key}'`}</td>
                  <td className="py-2 px-3 font-mono text-cyan-400">'{k.code}'</td>
                  <td className="py-2 px-3 font-mono text-yellow-400">{k.keyCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Features */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t.featuresTitle}</h3>
        <ul className="grid md:grid-cols-2 gap-2">
          {[t.feature1, t.feature2, t.feature3, t.feature4].map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-hub-muted">
              <span className="text-hub-accent">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* About */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{t.aboutTitle}</h3>
        <p className="text-hub-muted">{t.aboutText}</p>
      </div>
    </div>
  );
}
