import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';
import { DNSResult } from '@/types/dns';
import { Locale } from '@/lib/i18n';
import {
  analyzeMX,
  analyzeSPF,
  analyzeDMARC,
  analyzeDKIM,
  analyzeA,
  analyzeAAAA,
  analyzeNS,
  analyzeCAA,
  calculateScore,
} from '@/lib/analyzer';

// Promisify DNS functions
const resolveMx = promisify(dns.resolveMx);
const resolveTxt = promisify(dns.resolveTxt);
const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);
const resolveNs = promisify(dns.resolveNs);
const resolveCaa = promisify(dns.resolveCaa);

// Validate domain format
function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

// Safe DNS query wrapper
async function safeDNSQuery<T>(
  queryFn: () => Promise<T>,
  defaultValue: T
): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    return defaultValue;
  }
}

// Find SPF record from TXT records
function findSPF(txtRecords: string[][]): string | null {
  for (const record of txtRecords) {
    const joined = record.join('');
    if (joined.startsWith('v=spf1')) {
      return joined;
    }
  }
  return null;
}

// Find DMARC record
async function getDMARC(domain: string): Promise<string | null> {
  try {
    const records = await resolveTxt(`_dmarc.${domain}`);
    for (const record of records) {
      const joined = record.join('');
      if (joined.startsWith('v=DMARC1')) {
        return joined;
      }
    }
  } catch {
    // DMARC not found
  }
  return null;
}

// Check DKIM for common selectors
async function checkDKIM(domain: string): Promise<{ found: boolean; selector?: string }> {
  const selectors = [
    'default',
    'google',
    'selector1', // Microsoft
    'selector2', // Microsoft
    'k1', // Mailchimp
    'mandrill',
    'dkim',
    's1',
    's2',
    'mail',
    'mx',
  ];

  for (const selector of selectors) {
    try {
      const records = await resolveTxt(`${selector}._domainkey.${domain}`);
      if (records && records.length > 0) {
        const record = records[0].join('');
        if (record.includes('v=DKIM1') || record.includes('p=')) {
          return { found: true, selector };
        }
      }
    } catch {
      // This selector doesn't exist, try next
    }
  }

  return { found: false };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, locale: requestLocale } = body;

    // Validate locale
    const locale: Locale = requestLocale === 'ru' ? 'ru' : 'en';

    // Validate input
    if (!domain || typeof domain !== 'string') {
      return NextResponse.json(
        { success: false, error: locale === 'ru' ? 'Домен не указан' : 'Domain not specified' },
        { status: 400 }
      );
    }

    // Clean domain
    const cleanDomain = domain.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

    if (!isValidDomain(cleanDomain)) {
      return NextResponse.json(
        { success: false, error: locale === 'ru' ? 'Неверный формат домена' : 'Invalid domain format' },
        { status: 400 }
      );
    }

    // Run all DNS queries in parallel
    const [
      mxRecords,
      txtRecords,
      aRecords,
      aaaaRecords,
      nsRecords,
      caaRecords,
      dmarcRecord,
      dkimResult,
    ] = await Promise.all([
      safeDNSQuery(() => resolveMx(cleanDomain), []),
      safeDNSQuery(() => resolveTxt(cleanDomain), []),
      safeDNSQuery(() => resolve4(cleanDomain), []),
      safeDNSQuery(() => resolve6(cleanDomain), []),
      safeDNSQuery(() => resolveNs(cleanDomain), []),
      safeDNSQuery(() => resolveCaa(cleanDomain), []),
      getDMARC(cleanDomain),
      checkDKIM(cleanDomain),
    ]);

    // Process MX records
    const mxValues = mxRecords.length > 0
      ? mxRecords.sort((a, b) => a.priority - b.priority).map(r => `${r.priority} ${r.exchange}`)
      : null;

    // Find SPF in TXT records
    const spfRecord = findSPF(txtRecords);

    // Process CAA records
    const caaValues = caaRecords.length > 0
      ? caaRecords.map(r => `${(r as any).flags || 0} ${(r as any).tag || 'issue'} "${(r as any).value || ''}"`)
      : null;

    // Analyze all records with locale
    const checks = {
      mx: analyzeMX(mxValues, locale),
      spf: analyzeSPF(spfRecord, locale),
      dmarc: analyzeDMARC(dmarcRecord, locale),
      dkim: analyzeDKIM(dkimResult.found, dkimResult.selector, locale),
      a: analyzeA(aRecords.length > 0 ? aRecords : null, locale),
      aaaa: analyzeAAAA(aaaaRecords.length > 0 ? aaaaRecords : null, locale),
      ns: analyzeNS(nsRecords.length > 0 ? nsRecords : null, locale),
      caa: analyzeCAA(caaValues, locale),
    };

    // Calculate score
    const { score, maxScore } = calculateScore(checks);

    const result: DNSResult = {
      domain: cleanDomain,
      timestamp: new Date().toISOString(),
      score,
      maxScore,
      checks,
    };

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('DNS check error:', error);
    return NextResponse.json(
      { success: false, error: 'DNS check error' },
      { status: 500 }
    );
  }
}
