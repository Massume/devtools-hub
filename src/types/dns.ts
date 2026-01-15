// DNS Health Check types

export type CheckStatus = 'pass' | 'warning' | 'fail' | 'info';

export interface DNSCheck {
  name: string;
  status: CheckStatus;
  value: string | string[] | null;
  explanation: string;
  recommendation?: string;
}

export interface DNSResult {
  domain: string;
  timestamp: string;
  score: number;
  maxScore: number;
  checks: {
    mx: DNSCheck;
    spf: DNSCheck;
    dmarc: DNSCheck;
    dkim: DNSCheck;
    a: DNSCheck;
    aaaa: DNSCheck;
    ns: DNSCheck;
    caa: DNSCheck;
  };
}

export interface AnalyzeRequest {
  domain: string;
  locale?: 'en' | 'ru';
}

export interface AnalyzeResponse {
  success: boolean;
  data?: DNSResult;
  error?: string;
}
