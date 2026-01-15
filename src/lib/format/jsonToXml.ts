import { XMLBuilder } from 'fast-xml-parser';
import type { ConversionOptions, ConversionResult } from '../../types/format';

export function jsonToXml(input: string, options: ConversionOptions): ConversionResult {
  try {
    const data = JSON.parse(input);
    const builder = new XMLBuilder({
      indentBy: options.xmlIndent,
      format: true,
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    const wrapped = { [options.xmlRootName]: data };
    let output = builder.build(wrapped);

    if (options.xmlDeclaration) {
      output = '<?xml version="1.0" encoding="UTF-8"?>\n' + output;
    }

    return { success: true, output };
  } catch (error) {
    return { success: false, error: `Error: ${(error as Error).message}` };
  }
}
