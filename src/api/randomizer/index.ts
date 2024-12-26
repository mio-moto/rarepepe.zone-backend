import { randomInt } from "node:crypto"
import { Elysia } from "elysia"
import type { Environment } from "#/index"
import { resultToDto } from "#/utils/resultToDto"
import { pepeResult, rareResult, simpleResult, ultraResult } from "#contracts/api-results"

// const stringResult = t.Object({ result: t.String() });
const probabilityHit = (value: number, nth: number) => value < 1 / nth

export default async <const Prefix extends string | undefined>(
  { prefix = "/random" }: { prefix: Prefix },
  environment: Environment,
) => {
  const { randomizer } = environment

  return new Elysia({ prefix })
    .get(
      "/",
      () => {
        const value = randomInt(0, 281474976710655) / 281474976710655
        if (probabilityHit(value, 75)) {
          return resultToDto(randomizer.randomUltra())
        }

        if (probabilityHit(value, 32.5)) {
          return resultToDto(randomizer.randomRare())
        }

        return resultToDto(randomizer.randomSimple())
      },
      {
        response: {
          200: pepeResult,
        },
        detail: { tags: ["randomizer"] },
      },
    )
    .get("/simple", () => resultToDto(randomizer.randomSimple()), {
      response: { 200: simpleResult },
      detail: { tags: ["randomizer"] },
    })
    .get("/rare", () => resultToDto(randomizer.randomRare()), {
      response: { 200: rareResult },
      detail: { tags: ["randomizer"] },
    })
    .get("/ultra", () => resultToDto(randomizer.randomUltra()), {
      response: { 200: ultraResult },
      detail: { tags: ["randomizer"] },
    })
}
