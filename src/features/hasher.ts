import type { Lister } from "#features/structuredLister"
import { hash32String } from "#utils/murmurhash3_32"

const hashString = (text: string) => {
  const hash = hash32String(text.toLowerCase(), 0xf3375_600d)
  if (!hash) {
    throw new Error("Hash did not return anything?")
  }
  return hash
}

const hashCollection = <T>(text: string, collection: T[]): T => {
  const hash = hashString(text)
  return collection[hash % collection.length]
}

export const buildHasher = (lister: Lister) => {
  return {
    hashUltra: async (text: string) => hashCollection(text, await lister.ultras.getfiles()),
    hashRare: async (text: string) => hashCollection(text, await lister.rares.getfiles()),
    hashSimple: async (text: string) => hashCollection(text, await lister.simples.getfiles()),
  }
}
