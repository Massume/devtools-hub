// Simple UUID generation utilities

export function generateUUIDv4(): string {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateUUIDv1(): string {
  // Simplified v1 implementation (time-based)
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, '0');

  // Generate random node (normally would be MAC address)
  const node = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  // Format: time_low-time_mid-time_hi_and_version-clock_seq-node
  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1${timeHex.slice(12, 15)}-${node.slice(0, 4)}-${node.slice(4)}`;
}

export async function generateUUIDv5(namespace: string, name: string): Promise<string> {
  // Validate namespace UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(namespace)) {
    throw new Error('Invalid namespace UUID');
  }

  // Convert namespace UUID to bytes
  const namespaceBytes = hexToBytes(namespace.replace(/-/g, ''));
  const nameBytes = new TextEncoder().encode(name);

  // Concatenate namespace and name
  const data = new Uint8Array([...namespaceBytes, ...nameBytes]);

  // SHA-1 hash
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Take first 16 bytes
  const uuid = hashArray.slice(0, 16);

  // Set version (5) and variant bits
  uuid[6] = (uuid[6] & 0x0f) | 0x50; // Version 5
  uuid[8] = (uuid[8] & 0x3f) | 0x80; // Variant 10

  // Format as UUID string
  const hex = uuid.map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function hexToBytes(hex: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
}

export function formatUUID(uuid: string, options: { uppercase?: boolean; hyphens?: boolean }): string {
  let formatted = uuid;

  if (!options.hyphens) {
    formatted = formatted.replace(/-/g, '');
  }

  if (options.uppercase) {
    formatted = formatted.toUpperCase();
  } else {
    formatted = formatted.toLowerCase();
  }

  return formatted;
}

// Common namespace UUIDs
export const NAMESPACE_DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
export const NAMESPACE_URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
export const NAMESPACE_OID = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';
export const NAMESPACE_X500 = '6ba7b814-9dad-11d1-80b4-00c04fd430c8';
