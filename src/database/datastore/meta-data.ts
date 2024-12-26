import type { PepeRarity } from "#contracts/generators"
import type { Kysely } from "kysely"

const SimplePepeMetaTableVerb = "pepe_meta_simple"
const RarePepeMetaTableVerb = "pepe_meta_rare"
const UltraPepeMetaTableVerb = "pepe_meta_ultra"

const TableNames: Record<
  Exclude<PepeRarity, "peplication">,
  typeof SimplePepeMetaTableVerb | typeof RarePepeMetaTableVerb | typeof UltraPepeMetaTableVerb
> = {
  simple: SimplePepeMetaTableVerb,
  rare: RarePepeMetaTableVerb,
  ultra: UltraPepeMetaTableVerb,
} as const

interface BaseMetaTable {
  filename: string
  location: string
  created: number
  updated: number
  title: string | null
  width: number
  height: number
}

interface UltraExtraInfos {
  collectorsNumber: number
}

export type SimplePepeMetaTable = BaseMetaTable
export type RarePepeMetaTable = BaseMetaTable
export type UltraPepeMetaTable = BaseMetaTable & UltraExtraInfos

export interface BaseMetaParameter extends BaseMetaTable {}

export type SimplePepeMetaParameter = BaseMetaParameter
export type RarePepeMetaParameter = BaseMetaParameter
export type UltraPepeMetaParameter = BaseMetaParameter & UltraExtraInfos

export interface BaseMetaResult extends Omit<BaseMetaParameter, "created" | "updated"> {
  updated: Date
  created: Date
}

export type SimplePepeMetaResult = BaseMetaResult
export type RarePepeMetaResult = BaseMetaResult
export type UltraPepeMetaResult = BaseMetaResult & UltraExtraInfos
export type MetaDataResult = SimplePepeMetaResult | RarePepeMetaResult | UltraPepeMetaResult
export type MetaResultSelector<T extends PepeRarity> = T extends "simple"
  ? SimplePepeMetaResult
  : T extends "rare"
    ? RarePepeMetaResult
    : T extends "ultra"
      ? UltraPepeMetaResult
      : never

interface Database {
  [UltraPepeMetaTableVerb]: UltraPepeMetaTable
  [RarePepeMetaTableVerb]: RarePepeMetaTable
  [SimplePepeMetaTableVerb]: SimplePepeMetaTable
}

export const buildMetaTable = async (flexibleDb: Kysely<unknown>) => {
  const buildTableFor = async (type: Exclude<PepeRarity, "peplication">) => {
    let request = flexibleDb.schema
      .createTable(TableNames[type])
      .ifNotExists()
      .addColumn("filename", "text", (x) => x.notNull().primaryKey())
      .addColumn("location", "text", (x) => x.notNull())
      .addColumn("created", "bigint", (x) => x.notNull())
      .addColumn("updated", "bigint", (x) => x.notNull())
      .addColumn("title", "text")
      .addColumn("width", "integer", (x) => x.notNull().unsigned())
      .addColumn("height", "integer", (x) => x.notNull().unsigned())
    if (type === "ultra") {
      request = request.addColumn("collectorsNumber", "text")
    }
    await request.execute()
  }

  await buildTableFor("simple")
  await buildTableFor("rare")
  await buildTableFor("ultra")

  const db = <Kysely<Database>>flexibleDb

  return {
    createOrUpdate: async (
      rarity: Exclude<PepeRarity, "peplication">,
      info: SimplePepeMetaParameter | RarePepeMetaParameter | UltraPepeMetaParameter,
    ) => {
      await db
        .replaceInto(TableNames[rarity])
        .values({
          ...info,
        })
        .execute()
    },
    getAll: async <T extends PepeRarity>(type: T): Promise<MetaResultSelector<T>[]> => {
      const result = await db
        .selectFrom<typeof SimplePepeMetaTableVerb | typeof RarePepeMetaTableVerb | typeof UltraPepeMetaTableVerb>(
          TableNames[type],
        )
        .selectAll()
        .execute()
      return result.map((x) => ({
        ...x,
        created: new Date(x.created),
        updated: new Date(x.updated),
      })) as MetaResultSelector<T>[]
    },
    get: async <T extends PepeRarity>(type: T, filename: string): Promise<MetaResultSelector<T> | null> => {
      const result = await db
        .selectFrom<typeof SimplePepeMetaTableVerb | typeof RarePepeMetaTableVerb | typeof UltraPepeMetaTableVerb>(
          TableNames[type],
        )
        .selectAll()
        .where("filename", "=", filename)
        .executeTakeFirst()

      if (!result) {
        return null
      }

      return {
        ...result,
        created: new Date(result.created),
        updated: new Date(result.updated),
      } as MetaResultSelector<T>
    },
  }
}
