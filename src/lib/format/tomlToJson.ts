import * as TOML from '@iarna/toml';
import type { ConversionOptions, ConversionResult } from '../../types/format';

export function tomlToJson(input: string, options: ConversionOptions): ConversionResult {
  try {
    const data = TOML.parse(input);
    const output = JSON.stringify(data, null, options.jsonIndent);
    return { success: true, output };
  } catch (error) {
    return { success: false, error: `TOML parse error: ${(error as Error).message}` };
  }
}
