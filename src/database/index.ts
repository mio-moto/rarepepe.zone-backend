import { Kysely } from "kysely"
import { BunWorkerDialect } from "kysely-bun-worker"
import type { Config } from "#/config"
import { loggerFactory } from "#/logging"

const logger = loggerFactory("SYS:Database")
export const initializeDatabase = async (config: Config) => {
  if (!config.database?.path) {
    throw new Error("No database path given")
  }
  const db = new Kysely<unknown>({
    dialect: new BunWorkerDialect({
      url: config.database.path,
    }),
  })

  const tables = await db.introspection.getTables()
  logger.info(`Initialized database: [${tables.length}] tables: [${tables.map((x) => x.name).join(", ")}]`)
  return db
}
