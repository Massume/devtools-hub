import type { Gradient, LinearGradient, RadialGradient, ConicGradient } from '../../types/gradient';

export function gradientToCSS(gradient: Gradient): string {
  switch (gradient.type) {
    case 'linear':
      return linearToCSS(gradient);
    case 'radial':
      return radialToCSS(gradient);
    case 'conic':
      return conicToCSS(gradient);
  }
}

function linearToCSS(g: LinearGradient): string {
  const stops = g.stops
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ');
  return `background: linear-gradient(${g.angle}deg, ${stops});`;
}

function radialToCSS(g: RadialGradient): string {
  const stops = g.stops
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ');
  const pos = `${g.position.x}% ${g.position.y}%`;
  return `background: radial-gradient(${g.shape} at ${pos}, ${stops});`;
}

function conicToCSS(g: ConicGradient): string {
  const stops = g.stops
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ');
  const pos = `${g.position.x}% ${g.position.y}%`;
  return `background: conic-gradient(from ${g.angle}deg at ${pos}, ${stops});`;
}

export function getGradientValue(gradient: Gradient): string {
  return gradientToCSS(gradient).replace('background: ', '').replace(';', '');
}
