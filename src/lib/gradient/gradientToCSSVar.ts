import type { Gradient } from '../../types/gradient';
import { getGradientValue } from './gradientToCSS';

export function gradientToCSSVar(gradient: Gradient): string {
  const colorVars = gradient.stops
    .map((s, i) => `  --gradient-color-${i + 1}: ${s.color};`)
    .join('\n');

  return `:root {
${colorVars}
  --gradient: ${getGradientValue(gradient)};
}

.gradient {
  background: var(--gradient);
}`;
}
