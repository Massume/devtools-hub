import type { Gradient } from '../../types/gradient';
import { getGradientValue } from './gradientToCSS';

export function gradientToSCSS(gradient: Gradient): string {
  const value = getGradientValue(gradient);
  const colorVars = gradient.stops
    .map((s, i) => `$gradient-color-${i + 1}: ${s.color};`)
    .join('\n');

  return `${colorVars}

$gradient: ${value};

.gradient {
  background: $gradient;
}`;
}
