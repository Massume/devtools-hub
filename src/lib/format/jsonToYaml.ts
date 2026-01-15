import YAML from 'js-yaml';
import type { ConversionOptions, ConversionResult } from '../../types/format';

export function jsonToYaml(input: string, options: ConversionOptions): ConversionResult {
  try {
    const data = JSON.parse(input);
    const output = YAML.dump(data, {
      indent: options.yamlIndent,
      lineWidth: options.yamlLineWidth,
      noRefs: true,
      sortKeys: options.jsonSortKeys,
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: `JSON parse error: ${(error as Error).message}` };
  }
}
