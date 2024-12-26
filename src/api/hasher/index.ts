import { Elysia, t } from "elysia"
import type { Environment } from "#/index"
import { resultToDto } from "#/utils/resultToDto"
import { hash32String } from "#utils/murmurhash3_32"

const phraseResult = t.Object({
  type: t.String(),
  url: t.String(),
  phrase: t.String(),
})

const phraseError = t.Object({
  error: t.String(),
  missingQueryProperties: t.Array(t.String()),
  status: t.Number(),
})

export default async <const Prefix extends string | undefined>(
  { prefix = "/hash" }: { prefix: Prefix },
  environment: Environment,
) => {
  const { lister } = environment

  return new Elysia({ prefix }).get(
    "/",
    async ({ query, set }) => {
      if (!("phrase" in query) || !query.phrase) {
        set.status = 400
        return {
          error: "No phrase has been given",
          missingQueryProperties: ["phrase"],
          status: 400,
        }
      }

      const { phrase } = query
      const sanitizedPhrase = phrase.trim()
      if (sanitizedPhrase.length === 0) {
        set.status = 400
        return {
          error: "Phrase of no length given.",
          missingQueryProperties: ["phrase"],
          status: 400,
        }
      }

      const simples = await lister.simples.getfiles()
      const hash = hash32String(sanitizedPhrase.toLowerCase(), 0xf3375_600d)
      if (!hash) {
        throw new Error("Hash yieleded null?")
      }
      const result = simples[hash % simples.length]

      return {
        ...resultToDto(result),
        phrase: sanitizedPhrase,
      }
    },
    {
      response: {
        200: phraseResult,
        400: phraseError,
      },
      query: t.Object({
        phrase: t.String(),
      }),
      detail: { tags: ["hasher"] },
    },
  )
}
