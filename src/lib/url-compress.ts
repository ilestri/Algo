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

export const encodeState = (obj: any) =>
  encodeURIComponent(JSON.stringify(obj));

export const decodeState = <T = any>(s: string): T | null => {
  try {
    return JSON.parse(decodeURIComponent(s)) as T;
  } catch {
    return null;
  }
};
