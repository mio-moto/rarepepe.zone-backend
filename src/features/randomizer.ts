import type { PeplicationResult, RareResult, SimpleResult, UltraResult } from "#contracts/generators"
import type { Lister } from "#features/structuredLister"

export const shuffle = <T>(array: Array<T>) => {
  let currentIndex = array.length
  let randomIndex = -1

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

const shuffleGetter = <T>(entries: T[]) => {
  const reshuffle = () => shuffle([...entries])
  let stack: T[] = reshuffle()
  return () => {
    if (stack.length < 0) {
      stack = reshuffle()
    }
    const result = stack.pop()
    if (!result) {
      throw new Error("Exhausted stack, nothing returned, is the source collection empty?")
    }
    return result
  }
}

export const buildRandomizer = async (lister: Lister) => {
  return {
    randomUltra: shuffleGetter(await lister.ultras.getfiles()) as () => UltraResult,
    randomPeplication: shuffleGetter(await lister.peplications.getfiles()) as () => PeplicationResult,
    randomRare: shuffleGetter(await lister.rares.getfiles()) as () => RareResult,
    randomSimple: shuffleGetter(await lister.simples.getfiles()) as () => SimpleResult,
  }
}
