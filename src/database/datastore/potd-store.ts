import { Kysely } from "kysely";


const potdTable = "pepe_of_the_day"

interface PotdTable {
    year: number,
    month: number,
    day: number,
    url: string    
}

interface Database {
    [potdTable]: PotdTable
}

export const buildPotdStore = async (flexibleDb: Kysely<any>) => {
    await flexibleDb.schema
      .createTable(potdTable).ifNotExists()
      .addColumn("year", "numeric", x => x.notNull())
      .addColumn("month", "numeric", x => x.notNull())
      .addColumn("day", "numeric", x => x.notNull())
      .addColumn("url", "text", x => x.notNull())
      .addPrimaryKeyConstraint('primary_key', ['year', 'month', 'day'])
      .execute();
  
    const db = <Kysely<Database>>flexibleDb;
    return {
        submitPotd: async (date: Date, url: string) => {
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth() + 1;
            const day = date.getUTCDate();

            await db
                .replaceInto(potdTable)
                .values({year, month, day, url})
                .execute();
        },
        getPotd: async (date: Date) => {
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth() + 1;
            const day = date.getUTCDate();

            return await db
                .selectFrom(potdTable)
                .selectAll()
                .where("year", "==", year)
                .where("month", "==", month)
                .where("day", "==", day)
                .executeTakeFirst();
        }
    };
  }