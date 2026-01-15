import YAML from 'js-yaml';
import type { ConversionOptions, ConversionResult } from '../../types/format';

export function yamlToJson(input: string, options: ConversionOptions): ConversionResult {
  try {
    const data = YAML.load(input);
    const output = JSON.stringify(data, null, options.jsonIndent);
    return { success: true, output };
  } catch (error) {
    return { success: false, error: `YAML parse error: ${(error as Error).message}` };
  }
}
