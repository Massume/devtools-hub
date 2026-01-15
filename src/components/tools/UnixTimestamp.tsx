'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getUnixTimestampTranslations } from '@/lib/i18n-unix-timestamp';
import toast from 'react-hot-toast';

type Mode = 'timestampToDate' | 'dateToTimestamp';
type Unit = 'seconds' | 'milliseconds';

export function UnixTimestamp() {
  const { locale } = useI18n();
  const t = getUnixTimestampTranslations(locale);

  const [mode, setMode] = useState<Mode>('timestampToDate');
  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [unit, setUnit] = useState<Unit>('seconds');
  const [currentTimestamp, setCurrentTimestamp] = useState({ seconds: 0, milliseconds: 0 });
  const [output, setOutput] = useState<{
    local: string;
    utc: string;
    iso: string;
    timestamp?: number;
  } | null>(null);

  // Update current timestamp every second
  useEffect(() => {
    const updateTimestamp = () => {
      const now = Date.now();
      setCurrentTimestamp({
        seconds: Math.floor(now / 1000),
        milliseconds: now,
      });
    };

    updateTimestamp();
    const interval = setInterval(updateTimestamp, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTimestampToDate = () => {
    if (!timestampInput.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      let ts = parseInt(timestampInput, 10);
      if (isNaN(ts)) {
        toast.error(t.invalidTimestamp);
        return;
      }

      // Convert to milliseconds if needed
      if (unit === 'seconds') {
        ts *= 1000;
      }

      const date = new Date(ts);
      if (isNaN(date.getTime())) {
        toast.error(t.invalidTimestamp);
        return;
      }

      setOutput({
        local: date.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        }),
        utc: date.toUTCString(),
        iso: date.toISOString(),
      });
      toast.success(t.convertedSuccess);
    } catch {
      toast.error(t.invalidTimestamp);
    }
  };

  const handleDateToTimestamp = () => {
    if (!dateInput) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        toast.error(t.invalidDate);
        return;
      }

      const ts = unit === 'seconds'
        ? Math.floor(date.getTime() / 1000)
        : date.getTime();

      setOutput({
        local: date.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US'),
        utc: date.toUTCString(),
        iso: date.toISOString(),
        timestamp: ts,
      });
      toast.success(t.convertedSuccess);
    } catch {
      toast.error(t.invalidDate);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setTimestampInput('');
    setDateInput('');
    setOutput(null);
  };

  const handleNow = () => {
    if (mode === 'timestampToDate') {
      setTimestampInput(unit === 'seconds'
        ? currentTimestamp.seconds.toString()
        : currentTimestamp.milliseconds.toString()
      );
    } else {
      setDateInput(new Date().toISOString().slice(0, 19));
    }
  };

  const handleProcess = () => {
    if (mode === 'timestampToDate') {
      handleTimestampToDate();
    } else {
      handleDateToTimestamp();
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Timestamp Display */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">{t.currentTimestamp}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
            <div className="text-sm text-hub-muted mb-1">{t.seconds}</div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl text-hub-accent">{currentTimestamp.seconds}</span>
              <button
                onClick={() => handleCopy(currentTimestamp.seconds.toString())}
                className="text-hub-accent hover:text-hub-accent-dim text-sm"
              >
                {t.copyButton}
              </button>
            </div>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
            <div className="text-sm text-hub-muted mb-1">{t.milliseconds}</div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl text-hub-accent">{currentTimestamp.milliseconds}</span>
              <button
                onClick={() => handleCopy(currentTimestamp.milliseconds.toString())}
                className="text-hub-accent hover:text-hub-accent-dim text-sm"
              >
                {t.copyButton}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        <button
          onClick={() => { setMode('timestampToDate'); setOutput(null); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'timestampToDate'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.timestampToDate}
        </button>
        <button
          onClick={() => { setMode('dateToTimestamp'); setOutput(null); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'dateToTimestamp'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.dateToTimestamp}
        </button>
      </div>

      {/* Unit Selection */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-hub-muted">{t.format}:</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="unit"
              checked={unit === 'seconds'}
              onChange={() => setUnit('seconds')}
              className="accent-hub-accent"
            />
            <span className="text-sm">{t.seconds}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="unit"
              checked={unit === 'milliseconds'}
              onChange={() => setUnit('milliseconds')}
              className="accent-hub-accent"
            />
            <span className="text-sm">{t.milliseconds}</span>
          </label>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">{t.inputLabel}</h3>

        {mode === 'timestampToDate' ? (
          <input
            type="text"
            value={timestampInput}
            onChange={(e) => setTimestampInput(e.target.value)}
            placeholder={t.timestampPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-lg focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />
        ) : (
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-lg focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />
        )}

        <div className="flex gap-2">
          <button
            onClick={handleProcess}
            className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
          >
            {t.convertButton}
          </button>
          <button
            onClick={handleNow}
            className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors"
          >
            {t.nowButton}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
          >
            {t.clearButton}
          </button>
        </div>
      </div>

      {/* Output Section */}
      {output && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t.outputLabel}</h3>

          <div className="space-y-3">
            {output.timestamp !== undefined && (
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-hub-muted">Unix Timestamp ({unit})</span>
                  <button
                    onClick={() => handleCopy(output.timestamp!.toString())}
                    className="text-hub-accent hover:text-hub-accent-dim text-sm"
                  >
                    {t.copyButton}
                  </button>
                </div>
                <div className="font-mono text-xl text-hub-accent">{output.timestamp}</div>
              </div>
            )}

            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-hub-muted">{t.formatLocal}</span>
                <button
                  onClick={() => handleCopy(output.local)}
                  className="text-hub-accent hover:text-hub-accent-dim text-sm"
                >
                  {t.copyButton}
                </button>
              </div>
              <div className="font-mono">{output.local}</div>
            </div>

            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-hub-muted">{t.formatUtc}</span>
                <button
                  onClick={() => handleCopy(output.utc)}
                  className="text-hub-accent hover:text-hub-accent-dim text-sm"
                >
                  {t.copyButton}
                </button>
              </div>
              <div className="font-mono">{output.utc}</div>
            </div>

            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-hub-muted">{t.formatIso}</span>
                <button
                  onClick={() => handleCopy(output.iso)}
                  className="text-hub-accent hover:text-hub-accent-dim text-sm"
                >
                  {t.copyButton}
                </button>
              </div>
              <div className="font-mono">{output.iso}</div>
            </div>
          </div>
        </div>
      )}

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
