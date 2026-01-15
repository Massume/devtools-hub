import Papa from 'papaparse';
import type { ConversionOptions, ConversionResult } from '../../types/format';

export function csvToJson(input: string, options: ConversionOptions): ConversionResult {
  try {
    const result = Papa.parse(input, {
      header: options.csvHeader,
      delimiter: options.csvDelimiter,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      return { success: false, error: `CSV parse error: ${result.errors[0].message}` };
    }

    const output = JSON.stringify(result.data, null, options.jsonIndent);
    return { success: true, output };
  } catch (error) {
    return { success: false, error: `CSV parse error: ${(error as Error).message}` };
  }
}
