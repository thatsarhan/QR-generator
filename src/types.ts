export type QRDataType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'phone';

export type PatternStyle = 'squares' | 'dots' | 'rounded' | 'classy' | 'diamond';
export type EyeStyle = 'square' | 'rounded' | 'circle' | 'leafy';

export interface QRConfig {
  id: string;
  name: string;
  type: QRDataType;
  data: string;
  patternColor: string;
  eyeColor: string;
  isEyeColorLinked?: boolean;
  backgroundColor: string;
  isTransparentBg: boolean;
  patternStyle: PatternStyle;
  eyeStyle: EyeStyle;
  logoUrl: string | null;
  logoSize: number; // percentage 15-40
  logoBg: boolean;
  logoRound: boolean;
  shortLinkSlug?: string;
  createdAt: number;
}

export interface ShortLink {
  id: string;
  slug: string;
  title: string;
  destinationUrl: string;
  clicks: number;
  createdAt: number;
  lastScanned?: number;
  devices?: { [key: string]: number };
}
