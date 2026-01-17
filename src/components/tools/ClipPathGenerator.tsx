'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getClipPathGeneratorTranslations } from '@/lib/i18n-clip-path-generator';
import toast from 'react-hot-toast';

type ShapeType = 'polygon' | 'circle' | 'ellipse' | 'inset';

interface Point {
  x: number;
  y: number;
}

const PRESETS: Record<string, Point[]> = {
  triangle: [{ x: 50, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
  pentagon: [{ x: 50, y: 0 }, { x: 100, y: 38 }, { x: 82, y: 100 }, { x: 18, y: 100 }, { x: 0, y: 38 }],
  hexagon: [{ x: 25, y: 0 }, { x: 75, y: 0 }, { x: 100, y: 50 }, { x: 75, y: 100 }, { x: 25, y: 100 }, { x: 0, y: 50 }],
  octagon: [{ x: 30, y: 0 }, { x: 70, y: 0 }, { x: 100, y: 30 }, { x: 100, y: 70 }, { x: 70, y: 100 }, { x: 30, y: 100 }, { x: 0, y: 70 }, { x: 0, y: 30 }],
  star: [{ x: 50, y: 0 }, { x: 61, y: 35 }, { x: 98, y: 35 }, { x: 68, y: 57 }, { x: 79, y: 91 }, { x: 50, y: 70 }, { x: 21, y: 91 }, { x: 32, y: 57 }, { x: 2, y: 35 }, { x: 39, y: 35 }],
  arrowRight: [{ x: 0, y: 20 }, { x: 60, y: 20 }, { x: 60, y: 0 }, { x: 100, y: 50 }, { x: 60, y: 100 }, { x: 60, y: 80 }, { x: 0, y: 80 }],
  arrowLeft: [{ x: 100, y: 20 }, { x: 40, y: 20 }, { x: 40, y: 0 }, { x: 0, y: 50 }, { x: 40, y: 100 }, { x: 40, y: 80 }, { x: 100, y: 80 }],
  chevron: [{ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 0, y: 100 }, { x: 25, y: 100 }, { x: 75, y: 50 }, { x: 25, y: 0 }],
  rhombus: [{ x: 50, y: 0 }, { x: 100, y: 50 }, { x: 50, y: 100 }, { x: 0, y: 50 }],
  message: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 75 }, { x: 75, y: 75 }, { x: 75, y: 100 }, { x: 50, y: 75 }, { x: 0, y: 75 }],
};

export function ClipPathGenerator() {
  const { locale } = useI18n();
  const t = getClipPathGeneratorTranslations(locale);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [shapeType, setShapeType] = useState<ShapeType>('polygon');
  const [points, setPoints] = useState<Point[]>(PRESETS.triangle);
  const [draggingPoint, setDraggingPoint] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showPoints, setShowPoints] = useState(true);

  // Circle/Ellipse settings
  const [circleRadius, setCircleRadius] = useState(50);
  const [circleCenterX, setCircleCenterX] = useState(50);
  const [circleCenterY, setCircleCenterY] = useState(50);
  const [ellipseRadiusX, setEllipseRadiusX] = useState(50);
  const [ellipseRadiusY, setEllipseRadiusY] = useState(30);

  // Inset settings
  const [insetTop, setInsetTop] = useState(10);
  const [insetRight, setInsetRight] = useState(10);
  const [insetBottom, setInsetBottom] = useState(10);
  const [insetLeft, setInsetLeft] = useState(10);
  const [insetRadius, setInsetRadius] = useState(0);

  const clipPath = useCallback(() => {
    switch (shapeType) {
      case 'circle':
        return `circle(${circleRadius}% at ${circleCenterX}% ${circleCenterY}%)`;
      case 'ellipse':
        return `ellipse(${ellipseRadiusX}% ${ellipseRadiusY}% at ${circleCenterX}% ${circleCenterY}%)`;
      case 'inset':
        const radius = insetRadius > 0 ? ` round ${insetRadius}%` : '';
        return `inset(${insetTop}% ${insetRight}% ${insetBottom}% ${insetLeft}%${radius})`;
      case 'polygon':
      default:
        return `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    }
  }, [shapeType, points, circleRadius, circleCenterX, circleCenterY, ellipseRadiusX, ellipseRadiusY, insetTop, insetRight, insetBottom, insetLeft, insetRadius]);

  const handleMouseDown = (index: number) => {
    setDraggingPoint(index);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingPoint === null || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setPoints(prev => prev.map((p, i) =>
      i === draggingPoint ? { x: Math.round(x), y: Math.round(y) } : p
    ));
  }, [draggingPoint]);

  const handleMouseUp = () => {
    setDraggingPoint(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (shapeType !== 'polygon' || draggingPoint !== null) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setPoints([...points, { x, y }]);
  };

  const removePoint = (index: number) => {
    if (points.length > 3) {
      setPoints(points.filter((_, i) => i !== index));
    }
  };

  const applyPreset = (presetKey: string) => {
    setShapeType('polygon');
    setPoints(PRESETS[presetKey]);
  };

  const reset = () => {
    setPoints(PRESETS.triangle);
    setCircleRadius(50);
    setCircleCenterX(50);
    setCircleCenterY(50);
    setEllipseRadiusX(50);
    setEllipseRadiusY(30);
    setInsetTop(10);
    setInsetRight(10);
    setInsetBottom(10);
    setInsetLeft(10);
    setInsetRadius(0);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`clip-path: ${clipPath()};`);
    toast.success(t.copied);
  };

  const presetLabels: Record<string, string> = {
    triangle: t.presetTriangle,
    pentagon: t.presetPentagon,
    hexagon: t.presetHexagon,
    octagon: t.presetOctagon,
    star: t.presetStar,
    arrowRight: t.presetArrowRight,
    arrowLeft: t.presetArrowLeft,
    chevron: t.presetChevron,
    rhombus: t.presetRhombus,
    message: t.presetMessage,
  };

  return (
    <div className="space-y-6">
      {/* Shape Type */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.shapeType}</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'polygon' as const, label: t.shapePolygon },
            { value: 'circle' as const, label: t.shapeCircle },
            { value: 'ellipse' as const, label: t.shapeEllipse },
            { value: 'inset' as const, label: t.shapeInset },
          ].map(shape => (
            <button
              key={shape.value}
              onClick={() => setShapeType(shape.value)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                shapeType === shape.value
                  ? 'bg-hub-accent text-white border-hub-accent'
                  : 'bg-hub-darker border-hub-border hover:border-hub-accent/50'
              }`}
            >
              {shape.label}
            </button>
          ))}
        </div>
      </div>

      {/* Presets (for polygon) */}
      {shapeType === 'polygon' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.presets}</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(PRESETS).map(key => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
              >
                {presetLabels[key]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings for circle/ellipse/inset */}
      {shapeType === 'circle' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.circleSettings}</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.radius}: {circleRadius}%</label>
              <input type="range" min="0" max="100" value={circleRadius} onChange={(e) => setCircleRadius(parseInt(e.target.value))} className="w-full accent-hub-accent" />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.centerX}: {circleCenterX}%</label>
              <input type="range" min="0" max="100" value={circleCenterX} onChange={(e) => setCircleCenterX(parseInt(e.target.value))} className="w-full accent-hub-accent" />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.centerY}: {circleCenterY}%</label>
              <input type="range" min="0" max="100" value={circleCenterY} onChange={(e) => setCircleCenterY(parseInt(e.target.value))} className="w-full accent-hub-accent" />
            </div>
          </div>
        </div>
      )}

      {shapeType === 'ellipse' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.ellipseSettings}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.radiusX}: {ellipseRadiusX}%</label>
              <input type="range" min="0" max="100" value={ellipseRadiusX} onChange={(e) => setEllipseRadiusX(parseInt(e.target.value))} className="w-full accent-hub-accent" />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.radiusY}: {ellipseRadiusY}%</label>
              <input type="range" min="0" max="100" value={ellipseRadiusY} onChange={(e) => setEllipseRadiusY(parseInt(e.target.value))} className="w-full accent-hub-accent" />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.centerX}: {circleCenterX}%</label>
              <input type="range" min="0" max="100" value={circleCenterX} onChange={(e) => setCircleCenterX(parseInt(e.target.value))} className="w-full accent-hub-accent" />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.centerY}: {circleCenterY}%</label>
              <input type="range" min="0" max="100" value={circleCenterY} onChange={(e) => setCircleCenterY(parseInt(e.target.value))} className="w-full accent-hub-accent" />
            </div>
          </div>
        </div>
      )}

      {shapeType === 'inset' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.insetSettings}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.top}: {insetTop}%</label>
              <input type="range" min="0" max="50" value={insetTop} onChange={(e) => setInsetTop(parseInt(e.target.value))} className="w-full accent-hub-accent" />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.right}: {insetRight}%</label>
              <input type="range" min="0" max="50" value={insetRight} onChange={(e) => setInsetRight(parseInt(e.target.value))} className="w-full accent-hub-accent" />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.bottom}: {insetBottom}%</label>
              <input type="range" min="0" max="50" value={insetBottom} onChange={(e) => setInsetBottom(parseInt(e.target.value))} className="w-full accent-hub-accent" />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.left}: {insetLeft}%</label>
              <input type="range" min="0" max="50" value={insetLeft} onChange={(e) => setInsetLeft(parseInt(e.target.value))} className="w-full accent-hub-accent" />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.borderRadius}: {insetRadius}%</label>
              <input type="range" min="0" max="50" value={insetRadius} onChange={(e) => setInsetRadius(parseInt(e.target.value))} className="w-full accent-hub-accent" />
            </div>
          </div>
        </div>
      )}

      {/* Editor Canvas */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-hub-muted">{t.editor}</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="rounded accent-hub-accent" />
              <span className="text-xs text-hub-muted">{t.showGrid}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showPoints} onChange={(e) => setShowPoints(e.target.checked)} className="rounded accent-hub-accent" />
              <span className="text-xs text-hub-muted">{t.showPoints}</span>
            </label>
            <button onClick={reset} className="text-xs text-hub-accent hover:underline">{t.reset}</button>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="relative aspect-square max-w-md mx-auto bg-hub-darker rounded-lg overflow-hidden cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full h-px bg-hub-border/30" style={{ top: `${(i + 1) * 10}%` }} />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`v-${i}`} className="absolute h-full w-px bg-hub-border/30" style={{ left: `${(i + 1) * 10}%` }} />
              ))}
            </div>
          )}

          {/* Clipped Shape */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-hub-accent to-purple-600"
            style={{ clipPath: clipPath() }}
          />

          {/* Control Points (polygon only) */}
          {shapeType === 'polygon' && showPoints && points.map((point, index) => (
            <div
              key={index}
              className="absolute w-4 h-4 -ml-2 -mt-2 bg-white border-2 border-hub-accent rounded-full cursor-move z-10 hover:scale-125 transition-transform"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(index); }}
              onDoubleClick={(e) => { e.stopPropagation(); removePoint(index); }}
            />
          ))}
        </div>

        {shapeType === 'polygon' && (
          <p className="text-xs text-hub-muted mt-2 text-center">
            {t.clickToAdd} • {t.dragToMove} • {t.doubleClickRemove}
          </p>
        )}
      </div>

      {/* Generated CSS */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.generatedCode}</label>
          <button onClick={handleCopy} className="text-sm text-hub-accent hover:underline">
            {t.copyButton}
          </button>
        </div>
        <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
          <code className="text-sm text-green-400 font-mono break-all">
            clip-path: {clipPath()};
          </code>
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
