import { Kysely } from "kysely";
import { BunSqliteDialect } from "#database/bun-driver/dialect";
import { Config } from "#/config";
import Database from "bun:sqlite";
import { loggerFactory } from "#/logging";

const logger = loggerFactory("SYS:Database");
export const initializeDatabase = async (config: Config) => {
    if (!config.database?.path) {
        throw new Error("No database path given");
    }
    const db = new Kysely<unknown>({
        dialect: new BunSqliteDialect({
            database: new Database(config.database.path),
        }),
    });

    const tables = await db.introspection.getTables();
    logger.info(`Initialized database: [${tables.length}] tables: [${tables.map(x => x.name).join(", ")}]`);
    return db;
};
