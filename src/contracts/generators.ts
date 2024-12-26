export type SimplePepe = "simple"
export type RarePepe = "rare"
export type Peplication = "peplication"
export type UltraPepe = "ultra"

export type PepeRarity = SimplePepe | RarePepe | UltraPepe | Peplication

interface Result {
  type: PepeRarity
  filename: string
  path: string
  url: string
  altUrls?: Record<"mp4" | "gif", string>
}

export interface SimpleResult extends Result {
  type: SimplePepe
}

export interface RareResult extends Result {
  type: RarePepe
}

export interface PeplicationTrait {
  guid: string
  type: string
  id: number
  file: string
  name: string
}

export interface PeplicationMeta {
  guid: string
  id: number
  index: number
  traits: PeplicationTrait[]
}

export interface PeplicationResult extends Result {
  type: Peplication
  meta: {
    id: number
    index: number
  }
  // metadata: PeplicationMeta;
}

export interface UltraResult extends Result {
  type: UltraPepe
}

export type PepeResult = SimpleResult | RareResult | PeplicationResult | UltraResult
export type PepeResultByRarity<T extends PepeRarity> = T extends SimplePepe
  ? SimpleResult
  : T extends RarePepe
    ? RareResult
    : T extends Peplication
      ? PeplicationResult
      : T extends UltraPepe
        ? UltraResult
        : never
