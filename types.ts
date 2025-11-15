
export interface Color {
  hex: string;
  name: string;
  usage: string;
}

export interface FontPairing {
  header: string;
  body: string;
}

export interface BrandIdentity {
  colorPalette: Color[];
  fontPairings: FontPairing;
  primaryLogoUrl: string;
  secondaryMarksUrls: string[];
}
