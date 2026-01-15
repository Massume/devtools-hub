import type { Gradient } from '../../types/gradient';
import { getGradientValue } from './gradientToCSS';

export function gradientToTailwind(gradient: Gradient): string {
  if (gradient.type !== 'linear') {
    return `{/* Tailwind supports only linear gradients natively */}
{/* Use arbitrary value: */}
className="[background:${getGradientValue(gradient)}]"`;
  }

  const direction = angleToTailwindDirection(gradient.angle);
  const stops = gradient.stops;

  if (stops.length === 2) {
    return `className="bg-gradient-${direction} from-[${stops[0].color}] to-[${stops[1].color}]"`;
  }

  if (stops.length === 3) {
    return `className="bg-gradient-${direction} from-[${stops[0].color}] via-[${stops[1].color}] to-[${stops[2].color}]"`;
  }

  return `{/* More than 3 stops - use arbitrary value: */}
className="[background:${getGradientValue(gradient)}]"`;
}

function angleToTailwindDirection(angle: number): string {
  const directions: Record<number, string> = {
    0: 'to-t',
    45: 'to-tr',
    90: 'to-r',
    135: 'to-br',
    180: 'to-b',
    225: 'to-bl',
    270: 'to-l',
    315: 'to-tl',
  };

  const closest = Object.keys(directions)
    .map(Number)
    .reduce((prev, curr) =>
      Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev
    );

  return directions[closest];
}
