'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getBigNumberTranslations } from '@/lib/i18n-big-number';
import toast from 'react-hot-toast';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'modulo' | 'power';

const OPERATIONS: { value: Operation; symbol: string }[] = [
  { value: 'add', symbol: '+' },
  { value: 'subtract', symbol: '−' },
  { value: 'multiply', symbol: '×' },
  { value: 'divide', symbol: '÷' },
  { value: 'modulo', symbol: '%' },
  { value: 'power', symbol: '^' },
];

function parseBigInt(str: string): bigint | null {
  try {
    const cleaned = str.replace(/[\s,_]/g, '');
    if (!/^-?\d+$/.test(cleaned)) return null;
    return BigInt(cleaned);
  } catch {
    return null;
  }
}

const ZERO = BigInt(0);
const MAX_POWER = BigInt(10000);

function calculate(a: bigint, b: bigint, op: Operation): bigint | null {
  switch (op) {
    case 'add':
      return a + b;
    case 'subtract':
      return a - b;
    case 'multiply':
      return a * b;
    case 'divide':
      if (b === ZERO) return null;
      return a / b;
    case 'modulo':
      if (b === ZERO) return null;
      return a % b;
    case 'power':
      if (b < ZERO) return null;
      if (b > MAX_POWER) return null; // Prevent extremely large calculations
      return a ** b;
    default:
      return null;
  }
}

function formatBigInt(n: bigint): string {
  const str = n.toString();
  // Add thousand separators for readability
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function BigNumberCalc() {
  const { locale } = useI18n();
  const t = getBigNumberTranslations(locale);

  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState('');
  const [resultDigits, setResultDigits] = useState(0);

  const handleCalculate = () => {
    if (!num1.trim() || !num2.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    const a = parseBigInt(num1);
    const b = parseBigInt(num2);

    if (a === null || b === null) {
      toast.error(t.invalidInput);
      return;
    }

    if ((operation === 'divide' || operation === 'modulo') && b === ZERO) {
      toast.error(t.divisionByZero);
      return;
    }

    if (operation === 'power' && b < ZERO) {
      toast.error(t.negativePower);
      return;
    }

    const calcResult = calculate(a, b, operation);
    if (calcResult === null) {
      toast.error(t.invalidInput);
      return;
    }

    const resultStr = calcResult.toString();
    setResult(formatBigInt(calcResult));
    setResultDigits(resultStr.replace('-', '').length);
    toast.success(t.calculatedSuccess);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      // Copy without spaces
      await navigator.clipboard.writeText(result.replace(/\s/g, ''));
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setNum1('');
    setNum2('');
    setResult('');
    setResultDigits(0);
  };

  const handleSwap = () => {
    const temp = num1;
    setNum1(num2);
    setNum2(temp);
  };

  const loadExample = (example: 'factorial' | 'power' | 'prime') => {
    switch (example) {
      case 'factorial':
        // 100!
        setNum1('93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000');
        setNum2('1');
        setOperation('multiply');
        break;
      case 'power':
        setNum1('2');
        setNum2('1000');
        setOperation('power');
        break;
      case 'prime':
        setNum1('170141183460469231731687303715884105727');
        setNum2('618970019642690137449562111');
        setOperation('multiply');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <div className="grid lg:grid-cols-3 gap-4 items-end">
          {/* First Number */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.firstNumber}</label>
            <textarea
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              placeholder={t.firstPlaceholder}
              className="w-full h-24 bg-hub-darker border border-hub-border rounded-lg p-3 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            />
          </div>

          {/* Operation */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.operation}</label>
            <div className="grid grid-cols-6 gap-1">
              {OPERATIONS.map(({ value, symbol }) => (
                <button
                  key={value}
                  onClick={() => setOperation(value)}
                  className={`h-12 rounded-lg font-bold text-lg transition-colors ${
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
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleSwap}
                className="flex-1 px-3 py-2 bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors text-sm"
              >
                {t.swapButton}
              </button>
            </div>
          </div>

          {/* Second Number */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.secondNumber}</label>
            <textarea
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              placeholder={t.secondPlaceholder}
              className="w-full h-24 bg-hub-darker border border-hub-border rounded-lg p-3 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCalculate}
            className="flex-1 px-4 py-3 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
          >
            {t.calculateButton}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-3 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
          >
            {t.clearButton}
          </button>
        </div>
      </div>

      {/* Result Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {t.result}
            {resultDigits > 0 && (
              <span className="ml-2 text-sm text-hub-muted">
                ({resultDigits.toLocaleString()} {t.digitCount})
              </span>
            )}
          </h3>
          {result && (
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
            >
              {t.copyButton}
            </button>
          )}
        </div>

        <div className="w-full min-h-32 max-h-64 overflow-auto bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm break-all">
          {result || <span className="text-hub-muted">...</span>}
        </div>
      </div>

      {/* Examples */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.examplesTitle}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadExample('factorial')}
            className="px-4 py-2 bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors text-sm"
          >
            {t.example1}
          </button>
          <button
            onClick={() => loadExample('power')}
            className="px-4 py-2 bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors text-sm"
          >
            {t.example2}
          </button>
          <button
            onClick={() => loadExample('prime')}
            className="px-4 py-2 bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors text-sm"
          >
            {t.example3}
          </button>
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
