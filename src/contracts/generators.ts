interface Result {
  type: string;
  filename: string;
  path: string;
  url: string;
}

export interface SimpleResult extends Result {
  type: "simple";
}

export interface RareResult extends Result {
  type: "rare";
}

export interface UltraResult extends Result {
  type: "ultra";
}

export type PepeResult = SimpleResult | RareResult | UltraResult;
