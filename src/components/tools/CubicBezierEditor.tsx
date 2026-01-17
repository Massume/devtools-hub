'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getCubicBezierEditorTranslations } from '@/lib/i18n-cubic-bezier-editor';
import toast from 'react-hot-toast';

interface Point {
  x: number;
  y: number;
}

const PRESETS: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  easeInSine: [0.47, 0, 0.745, 0.715],
  easeOutSine: [0.39, 0.575, 0.565, 1],
  easeInOutSine: [0.445, 0.05, 0.55, 0.95],
  easeInQuad: [0.55, 0.085, 0.68, 0.53],
  easeOutQuad: [0.25, 0.46, 0.45, 0.94],
  easeInOutQuad: [0.455, 0.03, 0.515, 0.955],
  easeInCubic: [0.55, 0.055, 0.675, 0.19],
  easeOutCubic: [0.215, 0.61, 0.355, 1],
  easeInOutCubic: [0.645, 0.045, 0.355, 1],
  easeInBack: [0.6, -0.28, 0.735, 0.045],
  easeOutBack: [0.175, 0.885, 0.32, 1.275],
  easeInOutBack: [0.68, -0.55, 0.265, 1.55],
};

export function CubicBezierEditor() {
  const { locale } = useI18n();
  const t = getCubicBezierEditorTranslations(locale);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [p1, setP1] = useState<Point>({ x: 0.25, y: 0.1 });
  const [p2, setP2] = useState<Point>({ x: 0.25, y: 1 });
  const [dragging, setDragging] = useState<'p1' | 'p2' | null>(null);
  const [duration, setDuration] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationType, setAnimationType] = useState<'move' | 'scale' | 'rotate' | 'fade'>('move');
  const [showComparison, setShowComparison] = useState(false);
  const animationRef = useRef<number>(undefined);

  const bezierValue = `cubic-bezier(${p1.x.toFixed(2)}, ${p1.y.toFixed(2)}, ${p2.x.toFixed(2)}, ${p2.y.toFixed(2)})`;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (graphWidth * i) / 10;
      const y = padding + (graphHeight * i) / 10;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Convert coords
    const toCanvas = (p: Point) => ({
      x: padding + p.x * graphWidth,
      y: height - padding - p.y * graphHeight,
    });

    const p0 = { x: 0, y: 0 };
    const p3 = { x: 1, y: 1 };

    // Control lines
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    const cp0 = toCanvas(p0);
    const cp1 = toCanvas(p1);
    const cp2 = toCanvas(p2);
    const cp3 = toCanvas(p3);
    ctx.moveTo(cp0.x, cp0.y);
    ctx.lineTo(cp1.x, cp1.y);
    ctx.moveTo(cp3.x, cp3.y);
    ctx.lineTo(cp2.x, cp2.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Bezier curve
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cp0.x, cp0.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, cp3.x, cp3.y);
    ctx.stroke();

    // Linear comparison
    if (showComparison) {
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cp0.x, cp0.y);
      ctx.lineTo(cp3.x, cp3.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Control points
    const drawPoint = (p: Point, color: string) => {
      const cp = toCanvas(p);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cp.x, cp.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    drawPoint(p1, '#f97316');
    drawPoint(p2, '#06b6d4');

    // Labels
    ctx.fillStyle = '#888';
    ctx.font = '12px monospace';
    ctx.fillText('0', padding - 15, height - padding + 15);
    ctx.fillText('1', width - padding, height - padding + 15);
    ctx.fillText('1', padding - 15, padding + 5);
    ctx.fillText('time →', width / 2, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('progress →', 0, 0);
    ctx.restore();
  }, [p1, p2, showComparison]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;

    const padding = 40 / canvas.width;
    const graphWidth = 1 - padding * 2;

    const toGraph = (canvasX: number, canvasY: number) => ({
      x: (canvasX - padding) / graphWidth,
      y: (canvasY - padding) / graphWidth,
    });

    const gp = toGraph(x, y);

    const dist = (a: Point, b: Point) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

    if (dist(gp, p1) < 0.1) {
      setDragging('p1');
    } else if (dist(gp, p2) < 0.1) {
      setDragging('p2');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const padding = 40;
    const graphWidth = canvas.width - padding * 2;

    const x = Math.max(0, Math.min(1, (e.clientX - rect.left - padding) / graphWidth));
    const y = Math.max(-0.5, Math.min(1.5, 1 - (e.clientY - rect.top - padding) / graphWidth));

    if (dragging === 'p1') {
      setP1({ x, y });
    } else {
      setP2({ x, y });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const applyPreset = (name: keyof typeof PRESETS) => {
    const [x1, y1, x2, y2] = PRESETS[name];
    setP1({ x: x1, y: y1 });
    setP2({ x: x2, y: y2 });
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const playAnimation = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), duration);
  };

  const getAnimationStyle = (): React.CSSProperties => {
    if (!isPlaying) return {};

    const base: React.CSSProperties = {
      transition: `all ${duration}ms ${bezierValue}`,
    };

    switch (animationType) {
      case 'move':
        return { ...base, transform: 'translateX(200px)' };
      case 'scale':
        return { ...base, transform: 'scale(1.5)' };
      case 'rotate':
        return { ...base, transform: 'rotate(360deg)' };
      case 'fade':
        return { ...base, opacity: 0.2 };
      default:
        return base;
    }
  };

  const presetLabels: Record<string, string> = {
    linear: t.presetLinear,
    ease: t.presetEase,
    easeIn: t.presetEaseIn,
    easeOut: t.presetEaseOut,
    easeInOut: t.presetEaseInOut,
    easeInSine: t.presetEaseInSine,
    easeOutSine: t.presetEaseOutSine,
    easeInOutSine: t.presetEaseInOutSine,
    easeInQuad: t.presetEaseInQuad,
    easeOutQuad: t.presetEaseOutQuad,
    easeInOutQuad: t.presetEaseInOutQuad,
    easeInCubic: t.presetEaseInCubic,
    easeOutCubic: t.presetEaseOutCubic,
    easeInOutCubic: t.presetEaseInOutCubic,
    easeInBack: t.presetEaseInBack,
    easeOutBack: t.presetEaseOutBack,
    easeInOutBack: t.presetEaseInOutBack,
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.presets}</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PRESETS).map(name => (
            <button
              key={name}
              onClick={() => applyPreset(name as keyof typeof PRESETS)}
              className="px-3 py-1 text-xs bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
            >
              {presetLabels[name] || name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Canvas Editor */}
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.editor}</h3>
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full aspect-square cursor-pointer rounded-lg"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <p className="text-xs text-hub-muted mt-2">{t.dragPoints}</p>

          {/* Control Points */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-orange-400 mb-2">{t.point1}</label>
              <div className="flex gap-2">
                <div>
                  <span className="text-xs text-hub-muted">{t.x}</span>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={p1.x.toFixed(2)}
                    onChange={(e) => setP1(prev => ({ ...prev, x: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-hub-darker border border-hub-border rounded px-2 py-1 text-sm text-white"
                  />
                </div>
                <div>
                  <span className="text-xs text-hub-muted">{t.y}</span>
                  <input
                    type="number"
                    min="-0.5"
                    max="1.5"
                    step="0.01"
                    value={p1.y.toFixed(2)}
                    onChange={(e) => setP1(prev => ({ ...prev, y: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-hub-darker border border-hub-border rounded px-2 py-1 text-sm text-white"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">{t.point2}</label>
              <div className="flex gap-2">
                <div>
                  <span className="text-xs text-hub-muted">{t.x}</span>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={p2.x.toFixed(2)}
                    onChange={(e) => setP2(prev => ({ ...prev, x: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-hub-darker border border-hub-border rounded px-2 py-1 text-sm text-white"
                  />
                </div>
                <div>
                  <span className="text-xs text-hub-muted">{t.y}</span>
                  <input
                    type="number"
                    min="-0.5"
                    max="1.5"
                    step="0.01"
                    value={p2.y.toFixed(2)}
                    onChange={(e) => setP2(prev => ({ ...prev, y: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-hub-darker border border-hub-border rounded px-2 py-1 text-sm text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={showComparison}
              onChange={(e) => setShowComparison(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            <span className="text-sm text-hub-muted">{t.showComparison}</span>
          </label>
        </div>

        {/* Preview */}
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.preview}</h3>

          {/* Animation Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.animationType}</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'move', label: t.animationMove },
                { value: 'scale', label: t.animationScale },
                { value: 'rotate', label: t.animationRotate },
                { value: 'fade', label: t.animationFade },
              ].map(type => (
                <button
                  key={type.value}
                  onClick={() => setAnimationType(type.value as typeof animationType)}
                  className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                    animationType === type.value
                      ? 'bg-hub-accent text-white border-hub-accent'
                      : 'bg-hub-darker border-hub-border hover:border-hub-accent/50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-hub-muted mb-2">
              {t.duration}: {duration}{t.durationMs}
            </label>
            <input
              type="range"
              min="200"
              max="3000"
              step="100"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full accent-hub-accent"
            />
          </div>

          {/* Animation Preview */}
          <div className="bg-hub-darker rounded-lg p-8 mb-4 overflow-hidden">
            <div className="flex items-center justify-start h-16">
              <div
                className="w-12 h-12 bg-hub-accent rounded-lg flex items-center justify-center text-white font-bold"
                style={getAnimationStyle()}
              >
                ●
              </div>
            </div>
          </div>

          {/* Play Button */}
          <button
            onClick={playAnimation}
            disabled={isPlaying}
            className="w-full px-4 py-2 text-sm bg-hub-accent text-white rounded-lg hover:bg-hub-accent/80 transition-colors disabled:opacity-50"
          >
            {isPlaying ? t.pauseAnimation : t.playAnimation}
          </button>
        </div>
      </div>

      {/* Generated CSS */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-hub-muted">{t.generatedCode}</h3>

        {/* Timing Function */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-hub-muted">{t.cssTimingFunction}</label>
            <button
              onClick={() => handleCopy(bezierValue)}
              className="text-xs text-hub-accent hover:underline"
            >
              {t.copyButton}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-3">
            <code className="text-sm text-green-400 font-mono">{bezierValue}</code>
          </div>
        </div>

        {/* Transition */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-hub-muted">{t.cssTransition}</label>
            <button
              onClick={() => handleCopy(`transition: all ${duration}ms ${bezierValue};`)}
              className="text-xs text-hub-accent hover:underline"
            >
              {t.copyButton}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-3">
            <code className="text-sm text-cyan-400 font-mono">
              transition: all {duration}ms {bezierValue};
            </code>
          </div>
        </div>

        {/* Animation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-hub-muted">{t.cssAnimation}</label>
            <button
              onClick={() => handleCopy(`animation: myAnimation ${duration}ms ${bezierValue};`)}
              className="text-xs text-hub-accent hover:underline"
            >
              {t.copyButton}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-3">
            <code className="text-sm text-yellow-400 font-mono">
              animation: myAnimation {duration}ms {bezierValue};
            </code>
          </div>
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
