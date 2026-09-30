export type QRDataType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'phone';

export type PatternStyle = 'squares' | 'dots' | 'rounded' | 'classy' | 'diamond' | 'extra-rounded';
export type EyeStyle = 'square' | 'rounded' | 'circle';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRConfig {
  id: string;
  name: string;
  type: QRDataType;
  data: string;
  encodeDirectly: boolean; // false = use short link redirect
  patternColor: string;
  eyeOuterColor: string;
  eyeInnerColor: string;
  isEyesLinked: boolean;
  backgroundColor: string;
  isTransparentBg: boolean;
  patternStyle: PatternStyle;
  eyeStyle: EyeStyle;
  errorCorrectionLevel: ErrorCorrectionLevel;
  logoUrl: string | null;
  logoSize: number; // percentage 15-25
  logoBg: boolean; // white plate behind logo
  logoRound: boolean;
  createdAt: number;
}

export interface ShortLink {
  id: string;
  slug: string;
  title: string;
  destinationUrl: string;
  scanCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface QRTemplate {
  id: string;
  name: string;
  config: Partial<QRConfig>;
}
