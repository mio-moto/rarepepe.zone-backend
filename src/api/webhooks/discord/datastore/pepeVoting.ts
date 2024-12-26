import type { Generated, Kysely } from "kysely"

const VotingTable = "pepe_voting"
const VotingOpeningTable = "pepe_open_votings"

interface PepeVotingTable {
  message: Generated<string>
  user: string
  weight: number
}

interface ActivePepeVotingTable {
  channel: Generated<string>
  message: Generated<string>
  time: string
}

interface Database {
  [VotingTable]: PepeVotingTable
  [VotingOpeningTable]: ActivePepeVotingTable
}

export type PepeVoting = Awaited<ReturnType<typeof buildVoter>>

export const buildVoter = async (flexibleDb: Kysely<unknown>) => {
  await flexibleDb.schema
    .createTable(VotingTable)
    .ifNotExists()
    .addColumn("message", "text", (x) => x.notNull())
    .addColumn("user", "text", (x) => x.notNull())
    .addColumn("weight", "integer", (x) => x.notNull())
    .addPrimaryKeyConstraint("primary_key", ["message", "user"])
    .execute()

  await flexibleDb.schema
    .createTable(VotingOpeningTable)
    .ifNotExists()
    .addColumn("channel", "text", (x) => x.notNull())
    .addColumn("message", "text", (x) => x.notNull().primaryKey())
    .addColumn("time", "text", (x) => x.notNull())
    .execute()

  const db = <Kysely<Database>>flexibleDb
  const { sum } = db.fn
  return {
    submitVote: async (messageId: string, user: string, value: number) => {
      await db
        .replaceInto(VotingTable)
        .values({
          message: messageId,
          user: user,
          weight: value,
        })
        .execute()
      const result = await db
        .selectFrom(VotingTable)
        .select(sum<number>("weight").as("sum"))
        .where("message", "=", messageId)
        .executeTakeFirstOrThrow()
      return result.sum
    },
    getVotingResult: async (messageId: string) => {
      return (
        await db
          .selectFrom(VotingTable)
          .select(sum<number>("weight").as("sum"))
          .where("message", "=", messageId)
          .executeTakeFirstOrThrow()
      ).sum
    },
    beginVoting: async (channelId: string, messageId: string) => {
      await db
        .insertInto(VotingOpeningTable)
        .values({
          channel: channelId,
          message: messageId,
          time: new Date().toISOString(),
        })
        .execute()
    },
    getOpenVotingsOlderThan: async (minutes: number) => {
      const time = new Date().getTime() - minutes * 60 * 1_000
      const result = await db
        .selectFrom(VotingOpeningTable)
        .where("time", "<=", new Date(time).toISOString())
        .select(["channel", "message"])
        .execute()
      return result
    },
    closeVoting: async (messageId: string) => {
      await db.deleteFrom(VotingOpeningTable).where("message", "=", messageId).execute()
    },
    getAllVotings: async () => {
      const resultA = await db.selectFrom(VotingOpeningTable).select(["message"]).execute()
      const resultB = await db.selectFrom(VotingTable).select(["message"]).distinct().execute()
      return [...resultA, ...resultB]
    },
  }
}
