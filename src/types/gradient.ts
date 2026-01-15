export type GradientType = 'linear' | 'radial' | 'conic';

export interface ColorStop {
  id: string;
  color: string;
  position: number;
  opacity?: number;
}

export interface LinearGradient {
  type: 'linear';
  angle: number;
  stops: ColorStop[];
}

export interface RadialGradient {
  type: 'radial';
  shape: 'circle' | 'ellipse';
  position: { x: number; y: number };
  stops: ColorStop[];
}

export interface ConicGradient {
  type: 'conic';
  angle: number;
  position: { x: number; y: number };
  stops: ColorStop[];
}

export type Gradient = LinearGradient | RadialGradient | ConicGradient;

export interface GradientPreset {
  id: string;
  name: string;
  gradient: Gradient;
  category: string;
  tags: string[];
}

export type OutputFormat = 'css' | 'scss' | 'tailwind' | 'cssvar';

export interface EditorState {
  gradient: Gradient;
  selectedStopId: string | null;
  outputFormat: OutputFormat;
}
