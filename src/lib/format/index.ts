import type { DataFormat, ConversionOptions, ConversionResult } from '../../types/format';
import { jsonToYaml } from './jsonToYaml';
import { yamlToJson } from './yamlToJson';
import { jsonToXml } from './jsonToXml';
import { xmlToJson } from './xmlToJson';
import { jsonToCsv } from './jsonToCsv';
import { csvToJson } from './csvToJson';
import { jsonToToml } from './jsonToToml';
import { tomlToJson } from './tomlToJson';

type ConverterFn = (input: string, options: ConversionOptions) => ConversionResult;

const converters: Record<string, ConverterFn> = {
  'json-yaml': jsonToYaml,
  'json-xml': jsonToXml,
  'json-csv': jsonToCsv,
  'json-toml': (input, _options) => jsonToToml(input),
  'yaml-json': yamlToJson,
  'xml-json': xmlToJson,
  'csv-json': csvToJson,
  'toml-json': tomlToJson,
};

function formatJson(input: string, options: ConversionOptions): ConversionResult {
  try {
    const data = JSON.parse(input);
    const output = JSON.stringify(data, null, options.jsonIndent);
    return { success: true, output };
  } catch (error) {
    return { success: false, error: `JSON parse error: ${(error as Error).message}` };
  }
}

export function convert(
  input: string,
  from: DataFormat,
  to: DataFormat,
  options: ConversionOptions
): ConversionResult {
  if (!input.trim()) {
    return { success: false, error: 'Input is empty' };
  }

  if (from === to) {
    if (from === 'json') {
      return formatJson(input, options);
    }
    return { success: true, output: input };
  }

  const directKey = `${from}-${to}`;
  const directConverter = converters[directKey];

  if (directConverter) {
    return directConverter(input, options);
  }

  const toJsonKey = `${from}-json`;
  const fromJsonKey = `json-${to}`;
  const toJsonConverter = converters[toJsonKey];
  const fromJsonConverter = converters[fromJsonKey];

  if (toJsonConverter && fromJsonConverter) {
    const jsonResult = toJsonConverter(input, options);
    if (!jsonResult.success) {
      return jsonResult;
    }
    return fromJsonConverter(jsonResult.output!, options);
  }

  return { success: false, error: `Conversion ${from} -> ${to} not supported` };
}

export { jsonToYaml, yamlToJson, jsonToXml, xmlToJson, jsonToCsv, csvToJson, jsonToToml, tomlToJson };
