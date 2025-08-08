import LZString from 'lz-string';

export const encodeState = (obj: any) =>
  LZString.compressToEncodedURIComponent(JSON.stringify(obj));

export const decodeState = <T = any>(s: string): T | null => {
  try {
    return JSON.parse(LZString.decompressFromEncodedURIComponent(s) || 'null');
  } catch {
    return null;
  }
};
