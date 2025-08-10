import LZString from 'lz-string';

export const encodeString = (s: string) =>
  LZString.compressToEncodedURIComponent(s);

export const decodeString = (s: string): string | null => {
  try {
    return LZString.decompressFromEncodedURIComponent(s) || null;
  } catch {
    return null;
  }
};

export const encodeState = (obj: any) => encodeString(JSON.stringify(obj));

export const decodeState = <T = any>(s: string): T | null => {
  const decoded = decodeString(s);
  if (!decoded) return null;
  try {
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
};
