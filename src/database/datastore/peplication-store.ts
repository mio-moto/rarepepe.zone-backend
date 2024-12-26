import { type Kysely, sql } from "kysely"

const TraitTable = "peplication_trait"
const PeplicationTable = "peplication"
const PeplicationTraits = "peplication_trait_association"

export interface PeplicationEntryData {
  guid: string
  id: number
  index: number
  traits: {
    id: number
    index: number
    optionId: number
    file: string
    name: string
    value: string
  }[]
}

export interface PeplicationResult {
  guid: string
  id: number
  index: number
  traits: Trait[]
}

interface Trait {
  guid: string
  type: string
  id: number
  file: string
  name: string
}

interface Peplication {
  guid: string
  id: number
  index: number
}

interface PeplicationTraits {
  peplication: string
  trait: string
  order: number
}

interface Database {
  [TraitTable]: Trait
  [PeplicationTable]: Peplication
  [PeplicationTraits]: PeplicationTraits
}

export type PeplicationStore = Awaited<ReturnType<typeof buildPeplicationStore>>

export const buildPeplicationStore = async (flexibleDb: Kysely<unknown>) => {
  await flexibleDb.schema
    .createTable(TraitTable)
    .ifNotExists()
    .addColumn("guid", "text", (x) => x.notNull().primaryKey())
    .addColumn("type", "text", (x) => x.notNull())
    .addColumn("id", "integer", (x) => x.notNull())
    .addColumn("file", "text", (x) => x.notNull())
    .addColumn("name", "text", (x) => x.notNull())
    .execute()

  await flexibleDb.schema
    .createTable(PeplicationTable)
    .ifNotExists()
    .addColumn("guid", "text", (x) => x.notNull().primaryKey())
    .addColumn("id", "integer", (x) => x.notNull())
    .addColumn("index", "integer", (x) => x.notNull())
    .execute()

  await flexibleDb.schema
    .createTable(PeplicationTraits)
    .ifNotExists()
    .addColumn("peplication", "text", (x) => x.notNull().references(`${PeplicationTable}.guid`))
    .addColumn("trait", "text", (x) => x.notNull().references(`${TraitTable}.guid`))
    .addColumn("order", "integer", (x) => x.notNull())
    .execute()

  const db = <Kysely<Database>>flexibleDb

  return {
    registerPeplication: async (peplication: PeplicationEntryData) => {
      const dbTraits = await db
        .selectFrom(TraitTable)
        .selectAll()
        .where(
          "id",
          "in",
          peplication.traits.map((x) => x.optionId),
        )
        .execute()
      const mappedTraits = peplication.traits.map((x) => ({
        original: x,
        // careful - the entry data has "name" -> "type" and "value" -> "name" mapping from the peplication -> trait association
        dbo: dbTraits.find((y) => x.optionId === y.id && x.name === y.type && x.value === y.name),
      }))
      if (mappedTraits.some((x) => x.dbo === undefined)) {
        throw new Error(
          `Could not found mapped traits for: [${mappedTraits
            .filter((x) => x.dbo === undefined)
            .map((x) => `${x.original.optionId}: ${x.original.file}, ${x.original.name}, ${x.original.value}`)
            .join(", ")}]`,
        )
      }

      await db
        .replaceInto(PeplicationTable)
        .values({
          guid: peplication.guid,
          id: peplication.id,
          index: peplication.index,
        })
        .execute()
      for (const trait of mappedTraits) {
        if (!trait.dbo) {
          throw new Error("Should not have happened, dbo should have been filtered for undefined, but doesn't")
        }
        await db
          .replaceInto(PeplicationTraits)
          .values({
            peplication: peplication.guid,
            trait: trait.dbo.guid,
            order: trait.original.index,
          })
          .execute()
      }
    },
    registerTrait: async (trait: Trait) => {
      await db
        .replaceInto(TraitTable)
        .values({
          guid: trait.guid,
          type: trait.type,
          id: trait.id,
          file: trait.file,
          name: trait.name,
        })
        .execute()
    },
    getRandom: async (): Promise<PeplicationResult> => {
      const peplication = await db
        .selectFrom(PeplicationTable)
        .selectAll()
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .executeTakeFirstOrThrow()
      const resolvedTraits = await db
        .selectFrom(PeplicationTraits)
        .innerJoin(TraitTable, "peplication_trait_association.trait", "peplication_trait.guid")
        .selectAll()
        .where("peplication_trait_association.peplication", "=", peplication.guid)
        .execute()

      return {
        guid: peplication.guid,
        id: peplication.id,
        index: peplication.index,
        traits: resolvedTraits
          .sort((a, b) => a.order - b.order)
          .map((x) => ({
            guid: x.guid,
            type: x.type,
            id: x.id,
            file: x.file,
            name: x.name,
          })),
      }
    },
    getAllFiles: async (): Promise<Peplication[]> => {
      return db.selectFrom(PeplicationTable).selectAll().execute()
    },
    getByFile: async (id: number, index: number): Promise<PeplicationResult> => {
      const peplication = await db
        .selectFrom(PeplicationTable)
        .selectAll()
        .where((eb) => eb.and([eb("id", "==", id), eb("index", "==", index)]))
        .limit(1)
        .executeTakeFirstOrThrow()
      const resolvedTraits = await db
        .selectFrom(PeplicationTraits)
        .innerJoin(TraitTable, "peplication_trait_association.trait", "peplication_trait.guid")
        .selectAll()
        .where("peplication_trait_association.peplication", "=", peplication.guid)
        .execute()

      return {
        guid: peplication.guid,
        id: peplication.id,
        index: peplication.index,
        traits: resolvedTraits
          .sort((a, b) => a.order - b.order)
          .map((x) => ({
            guid: x.guid,
            type: x.type,
            id: x.id,
            file: x.file,
            name: x.name,
          })),
      }
    },
  }
}
