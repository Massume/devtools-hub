import Papa from 'papaparse';
import type { ConversionOptions, ConversionResult } from '../../types/format';

export function jsonToCsv(input: string, options: ConversionOptions): ConversionResult {
  try {
    const data = JSON.parse(input);

    if (!Array.isArray(data)) {
      return { success: false, error: 'JSON must be an array for CSV conversion' };
    }

    if (data.length === 0) {
      return { success: true, output: '' };
    }

    const output = Papa.unparse(data, {
      delimiter: options.csvDelimiter,
      header: options.csvHeader,
    });

    return { success: true, output };
  } catch (error) {
    return { success: false, error: `Error: ${(error as Error).message}` };
  }
}
