import { Kysely } from "kysely"
import { BunSqliteDialect } from "#database/bun-driver/dialect"
import { Config } from "#/config"
import Database from "bun:sqlite"


export const initializeDatabase = async (config: Config) => {
    if(!config.database?.path) {
        throw new Error("No database path given");
    }
    const db = new Kysely<any>({
        dialect: new BunSqliteDialect({
            database: new Database(config.database.path)
        })
    })

    const tables = await db.introspection.getTables();
    console.log(`Initialized tabase, got [${tables.length}] tables: [${tables.map(x => x.name).join(", ")}]`);
    return db;
}