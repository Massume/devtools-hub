'use client';

import { Gradient } from '@/types/gradient';
import { getGradientValue } from '@/lib/gradient/gradientToCSS';

interface GradientPreviewProps {
  gradient: Gradient;
  label: string;
}

export function GradientPreview({ gradient, label }: GradientPreviewProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-white">{label}</h2>
      <div
        style={{ background: getGradientValue(gradient) }}
        className="w-full h-80 rounded-xl border-2 border-hub-border shadow-lg transition-all duration-300 hover:border-hub-accent/50"
      />
    </div>
  );
}
