'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getBitwiseTranslations } from '@/lib/i18n-bitwise';
import toast from 'react-hot-toast';

type Operation = 'and' | 'or' | 'xor' | 'not' | 'leftShift' | 'rightShift' | 'unsignedRightShift';
type BitWidth = 8 | 16 | 32;

const OPERATIONS: { value: Operation; symbol: string; unary?: boolean }[] = [
  { value: 'and', symbol: '&' },
  { value: 'or', symbol: '|' },
  { value: 'xor', symbol: '^' },
  { value: 'not', symbol: '~', unary: true },
  { value: 'leftShift', symbol: '<<' },
  { value: 'rightShift', symbol: '>>' },
  { value: 'unsignedRightShift', symbol: '>>>' },
];

function parseNumber(str: string): number | null {
  const cleaned = str.trim();
  if (!cleaned) return null;

  // Handle hex
  if (cleaned.toLowerCase().startsWith('0x')) {
    const val = parseInt(cleaned, 16);
    return isNaN(val) ? null : val;
  }
  // Handle binary
  if (cleaned.toLowerCase().startsWith('0b')) {
    const val = parseInt(cleaned.slice(2), 2);
    return isNaN(val) ? null : val;
  }
  // Handle decimal
  const val = parseInt(cleaned, 10);
  return isNaN(val) ? null : val;
}

function toBinary(num: number, width: BitWidth): string {
  const mask = width === 32 ? 0xFFFFFFFF : width === 16 ? 0xFFFF : 0xFF;
  const unsigned = num >>> 0 & mask;
  return unsigned.toString(2).padStart(width, '0');
}

function toHex(num: number, width: BitWidth): string {
  const mask = width === 32 ? 0xFFFFFFFF : width === 16 ? 0xFFFF : 0xFF;
  const unsigned = num >>> 0 & mask;
  const hexDigits = width / 4;
  return '0x' + unsigned.toString(16).toUpperCase().padStart(hexDigits, '0');
}

function calculate(a: number, b: number, op: Operation, width: BitWidth): number {
  const mask = width === 32 ? 0xFFFFFFFF : width === 16 ? 0xFFFF : 0xFF;

  switch (op) {
    case 'and':
      return (a & b) & mask;
    case 'or':
      return (a | b) & mask;
    case 'xor':
      return (a ^ b) & mask;
    case 'not':
      return (~a) & mask;
    case 'leftShift':
      return (a << b) & mask;
    case 'rightShift':
      return (a >> b) & mask;
    case 'unsignedRightShift':
      return (a >>> b) & mask;
    default:
      return 0;
  }
}

function BinaryDisplay({ value, width, label }: { value: number; width: BitWidth; label: string }) {
  const binary = toBinary(value, width);
  const groups = [];
  for (let i = 0; i < binary.length; i += 4) {
    groups.push(binary.slice(i, i + 4));
  }

  return (
    <div className="space-y-1">
      <div className="text-sm text-hub-muted">{label}</div>
      <div className="flex flex-wrap gap-1 font-mono text-sm">
        {groups.map((group, i) => (
          <div key={i} className="flex">
            {group.split('').map((bit, j) => (
              <span
                key={j}
                className={`w-5 h-6 flex items-center justify-center rounded ${
                  bit === '1' ? 'bg-hub-accent text-hub-darker' : 'bg-hub-darker'
                }`}
              >
                {bit}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BitwiseCalc() {
  const { locale } = useI18n();
  const t = getBitwiseTranslations(locale);

  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operation, setOperation] = useState<Operation>('and');
  const [bitWidth, setBitWidth] = useState<BitWidth>(8);
  const [result, setResult] = useState<number | null>(null);

  const isUnary = OPERATIONS.find(op => op.value === operation)?.unary || false;

  useEffect(() => {
    const a = parseNumber(num1);
    if (a === null) {
      setResult(null);
      return;
    }

    if (isUnary) {
      setResult(calculate(a, 0, operation, bitWidth));
    } else {
      const b = parseNumber(num2);
      if (b === null) {
        setResult(null);
        return;
      }
      setResult(calculate(a, b, operation, bitWidth));
    }
  }, [num1, num2, operation, bitWidth, isUnary]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setNum1('');
    setNum2('');
    setResult(null);
  };

  const handleSwap = () => {
    const temp = num1;
    setNum1(num2);
    setNum2(temp);
  };

  const val1 = parseNumber(num1);
  const val2 = parseNumber(num2);

  return (
    <div className="space-y-6">
      {/* Bit Width Toggle */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        {([8, 16, 32] as BitWidth[]).map((width) => (
          <button
            key={width}
            onClick={() => setBitWidth(width)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              bitWidth === width
                ? 'bg-hub-accent text-hub-darker'
                : 'text-hub-muted hover:text-white'
            }`}
          >
            {t[`bits${width}` as keyof typeof t]}
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* First Number */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.firstNumber}</label>
            <input
              type="text"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              placeholder={t.firstPlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 font-mono focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            />
            {val1 !== null && (
              <BinaryDisplay value={val1} width={bitWidth} label={t.binaryView} />
            )}
          </div>

          {/* Operation */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.operation}</label>
            <div className="grid grid-cols-4 gap-1">
              {OPERATIONS.map(({ value, symbol }) => (
                <button
                  key={value}
                  onClick={() => setOperation(value)}
                  className={`h-10 rounded-lg font-mono text-sm transition-colors ${
                    operation === value
                      ? 'bg-hub-accent text-hub-darker'
                      : 'bg-hub-darker border border-hub-border hover:border-hub-accent'
                  }`}
                  title={t[value]}
                >
                  {symbol}
                </button>
              ))}
            </div>
            {!isUnary && (
              <button
                onClick={handleSwap}
                className="mt-2 w-full px-3 py-2 bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors text-sm"
              >
                {t.swapButton}
              </button>
            )}
          </div>

          {/* Second Number */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.secondNumber}</label>
            <input
              type="text"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              placeholder={t.secondPlaceholder}
              disabled={isUnary}
              className={`w-full bg-hub-darker border border-hub-border rounded-lg p-3 font-mono focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors ${
                isUnary ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            {val2 !== null && !isUnary && (
              <BinaryDisplay value={val2} width={bitWidth} label={t.binaryView} />
            )}
          </div>
        </div>

        <button
          onClick={handleClear}
          className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Result Section */}
      {result !== null && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t.result}</h3>

          <BinaryDisplay value={result} width={bitWidth} label={t.binaryValue} />

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-hub-muted">{t.decimalValue}</span>
                <button
                  onClick={() => handleCopy(result.toString())}
                  className="text-hub-accent hover:text-hub-accent-dim text-xs"
                >
                  {t.copyButton}
                </button>
              </div>
              <div className="font-mono text-xl">{result}</div>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-hub-muted">{t.hexValue}</span>
                <button
                  onClick={() => handleCopy(toHex(result, bitWidth))}
                  className="text-hub-accent hover:text-hub-accent-dim text-xs"
                >
                  {t.copyButton}
                </button>
              </div>
              <div className="font-mono text-xl">{toHex(result, bitWidth)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Truth Table */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.truthTableTitle}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {['AND', 'OR', 'XOR'].map((op) => (
            <div key={op} className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <h4 className="text-center font-bold text-hub-accent mb-2">{op}</h4>
              <table className="w-full text-center font-mono text-sm">
                <thead>
                  <tr className="text-hub-muted">
                    <th className="py-1">A</th>
                    <th className="py-1">B</th>
                    <th className="py-1">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [0, 0],
                    [0, 1],
                    [1, 0],
                    [1, 1],
                  ].map(([a, b]) => {
                    const res =
                      op === 'AND' ? a & b : op === 'OR' ? a | b : a ^ b;
                    return (
                      <tr key={`${a}-${b}`}>
                        <td className="py-1">{a}</td>
                        <td className="py-1">{b}</td>
                        <td className="py-1 text-hub-accent">{res}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.featuresTitle}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[t.feature1, t.feature2, t.feature3, t.feature4, t.feature5, t.feature6].map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-hub-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-3">{t.aboutTitle}</h3>
        <p className="text-gray-300 leading-relaxed">{t.aboutText}</p>
      </div>
    </div>
  );
}
