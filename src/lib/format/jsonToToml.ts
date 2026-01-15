import * as TOML from '@iarna/toml';
import type { ConversionResult } from '../../types/format';

export function jsonToToml(input: string): ConversionResult {
  try {
    const data = JSON.parse(input);

    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      return { success: false, error: 'TOML root must be an object (not array or primitive)' };
    }

    const output = TOML.stringify(data);
    return { success: true, output };
  } catch (error) {
    return { success: false, error: `Error: ${(error as Error).message}` };
  }
}
