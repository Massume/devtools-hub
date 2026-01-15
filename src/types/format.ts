export type DataFormat = 'json' | 'yaml' | 'xml' | 'toml' | 'csv';

export interface ConversionOptions {
  jsonIndent: number;
  jsonSortKeys: boolean;
  yamlIndent: number;
  yamlLineWidth: number;
  xmlIndent: string;
  xmlRootName: string;
  xmlDeclaration: boolean;
  csvDelimiter: string;
  csvHeader: boolean;
}

export interface ConversionResult {
  success: boolean;
  output?: string;
  error?: string;
}

export const DEFAULT_OPTIONS: ConversionOptions = {
  jsonIndent: 2,
  jsonSortKeys: false,
  yamlIndent: 2,
  yamlLineWidth: 80,
  xmlIndent: '  ',
  xmlRootName: 'root',
  xmlDeclaration: true,
  csvDelimiter: ',',
  csvHeader: true,
};

export const FORMAT_LABELS: Record<DataFormat, string> = {
  json: 'JSON',
  yaml: 'YAML',
  xml: 'XML',
  toml: 'TOML',
  csv: 'CSV',
};

export const FORMAT_EXTENSIONS: Record<DataFormat, string> = {
  json: '.json',
  yaml: '.yaml',
  xml: '.xml',
  toml: '.toml',
  csv: '.csv',
};
