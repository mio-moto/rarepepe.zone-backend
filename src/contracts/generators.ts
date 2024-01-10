export type SimplePepe = "simple";
export type RarePepe = "rare";
export type UltraPepe = "ultra";

export type PepeRarity = SimplePepe | RarePepe | UltraPepe;

interface Result {
    type: PepeRarity;
    filename: string;
    path: string;
    url: string;
    altUrls?: Record<"mp4" | "gif", string>;
}

export interface SimpleResult extends Result {
    type: SimplePepe;
}

export interface RareResult extends Result {
    type: RarePepe;
}

export interface UltraResult extends Result {
    type: UltraPepe;
}

export type PepeResult = SimpleResult | RareResult | UltraResult;
