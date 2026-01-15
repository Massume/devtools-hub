import { XMLParser } from 'fast-xml-parser';
import type { ConversionOptions, ConversionResult } from '../../types/format';

export function xmlToJson(input: string, options: ConversionOptions): ConversionResult {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      parseTagValue: true,
      trimValues: true,
    });

    const data = parser.parse(input);
    const output = JSON.stringify(data, null, options.jsonIndent);
    return { success: true, output };
  } catch (error) {
    return { success: false, error: `XML parse error: ${(error as Error).message}` };
  }
}
