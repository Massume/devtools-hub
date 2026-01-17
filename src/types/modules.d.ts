// Type declarations for modules without types

declare module 'js-md5' {
  function md5(input: string | ArrayBuffer | Uint8Array): string;
  export default md5;
}

declare module 'ripemd160' {
  export function ripemd160(input: Buffer | string): Buffer;
}

declare module 'crc-32' {
  export function str(input: string): number;
  export function buf(input: ArrayBuffer | Uint8Array): number;
}

declare module 'adler-32' {
  export function str(input: string): number;
  export function buf(input: ArrayBuffer | Uint8Array): number;
}

declare module 'blakejs' {
  export function blake2b(input: Uint8Array | string, key?: Uint8Array, outlen?: number): Uint8Array;
  export function blake2bHex(input: Uint8Array | string, key?: Uint8Array, outlen?: number): string;
  export function blake2s(input: Uint8Array | string, key?: Uint8Array, outlen?: number): Uint8Array;
  export function blake2sHex(input: Uint8Array | string, key?: Uint8Array, outlen?: number): string;
}

declare module 'zxcvbn' {
  interface ZxcvbnResult {
    score: 0 | 1 | 2 | 3 | 4;
    guesses: number;
    guesses_log10: number;
    crack_times_seconds: {
      online_throttling_100_per_hour: number;
      online_no_throttling_10_per_second: number;
      offline_slow_hashing_1e4_per_second: number;
      offline_fast_hashing_1e10_per_second: number;
    };
    crack_times_display: {
      online_throttling_100_per_hour: string;
      online_no_throttling_10_per_second: string;
      offline_slow_hashing_1e4_per_second: string;
      offline_fast_hashing_1e10_per_second: string;
    };
    feedback: {
      warning: string;
      suggestions: string[];
    };
    sequence: Array<{
      pattern: string;
      token: string;
      i: number;
      j: number;
    }>;
  }

  function zxcvbn(password: string, userInputs?: string[]): ZxcvbnResult;
  export default zxcvbn;
}
