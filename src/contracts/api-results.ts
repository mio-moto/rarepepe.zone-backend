import { t } from "elysia"

export const simpleResult = t.Object({
  type: t.String(),
  url: t.String(),
})

export const rareResult = simpleResult
export const ultraResult = simpleResult
export const pepeResult = t.Union([simpleResult, rareResult, ultraResult])

export interface PepeApiResult {
  type: string
  url: string
}
