import { type Kysely, sql } from "kysely"
import { buildPhraseStore } from "./phrase-store"
import { buildPotdStore } from "./potd-store"
import type { Config } from "#/config"
import { initializeDatabase } from "#database/index"
import { buildMetaTable as buildMetaStore } from "./meta-data"
import { buildPeplicationStore } from "./peplication-store"

const maintenanceTask = (db: Kysely<unknown>) => {
  sql`VACUUM`.execute(db)
}

/**
 * Creates a higher-order data management interface that retains data in the database
 */
export const buildDataStore = async (config: Config) => {
  const db = await initializeDatabase(config)
  // every day, run the maintenance task
  setInterval(() => maintenanceTask(db), 24 * 60 * 60 * 1000)

  const phraseStore = await buildPhraseStore(db)
  const potdStore = await buildPotdStore(db)
  const metaStore = await buildMetaStore(db)
  const peplicationStore = await buildPeplicationStore(db)

  return {
    phrasing: phraseStore,
    potdStore: potdStore,
    metadata: metaStore,
    peplication: peplicationStore,
    database: db,
  }
}

export type Database = Awaited<ReturnType<typeof buildDataStore>>
