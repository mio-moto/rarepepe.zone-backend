import { ApplicationCommandTypes, InteractionResponseTypes } from "@discordeno/types"
import { sql } from "kysely"
import type { PeplicationStore } from "#database/datastore/peplication-store"
import type { DiscordEnvironment, InteractionPlugin } from "../rabscuttle"
import { embedPeplication } from "./embedders"

// old, initial json importer, one-off
const _importer = async (environment: DiscordEnvironment, db: PeplicationStore) => {
  interface TraitGroup {
    id: number
    folder: string
    name: string
    options: {
      id: number
      file: string
      name: string
    }[]
  }

  interface Peplication {
    id: number
    imageUrl: null | string
    isApproved: boolean
    labels: []
    traits: {
      id: number
      index: number
      optionId: number
      folder: string
      file: string
      imageUrl: null | string
      name: string
      value: string
    }[]
  }

  const traitGroups = (await Bun.file("./data/peplicator/traits.json").json()) as TraitGroup[]
  const pepes = (await Bun.file("./data/peplicator/pepes.json").json()) as Peplication[]

  sql`BEGIN TRANSACTION`.execute(environment.dataStore.database)

  for (let i = 0; i < traitGroups.length; i++) {
    environment.logger.info(`importing group ${i + 1}/${traitGroups.length}`)
    const group = traitGroups[i]
    for (let j = 0; j < group.options.length; j++) {
      const trait = group.options[j]
      if (!trait) {
        environment.logger.info(`skipping group ${group.id}, index ${j}, undefined?`)
        continue
      }
      await db.registerTrait({
        guid: crypto.randomUUID(),
        type: group.name,
        id: trait.id,
        file: `${group.folder}/${trait.file}`,
        name: trait.name,
      })
    }
  }

  sql`COMMIT TRANSACTION`.execute(environment.dataStore.database)

  sql`BEGIN TRANSACTION`.execute(environment.dataStore.database)

  for (let i = 0; i < pepes.length; i++) {
    if (i % 1000 === 0) {
      environment.logger.info(`Peplication ${i}/${pepes.length}`)
    }
    const peplication = pepes[i]
    await db.registerPeplication({
      ...peplication,
      index: i,
      guid: crypto.randomUUID(),
    })
  }

  sql`COMMIT TRANSACTION`.execute(environment.dataStore.database)

  sql`VACUUM`.execute(environment.dataStore.database)

  environment.logger.info("Importing is all done!")
}

export const buildPeplicator = async (environment: DiscordEnvironment) => {
  // await importer(environment, db);
  const Peplicator: InteractionPlugin = {
    name: "Peplicator",
    descriptor: {
      type: ApplicationCommandTypes.ChatInput,
      name: "peplicator",
      description: "Simple, chaotic, raw or sleek, sad or happy, explore Pepe in all his forms and mint what you love!",
    },
    onNewInteraction: async (interaction) => {
      const result = environment.randomizer.randomPeplication()

      const deferringPromise = interaction.defer()
      const metaData = await environment.dataStore.peplication.getByFile(result.meta.id, result.meta.index)
      const peplication = embedPeplication(result, metaData)
      await deferringPromise
      await environment.discord.client.interactions.followup.create(interaction.data.token, peplication)
      // interaction.reply(embedPeplication(result));
    },
  }

  return Peplicator
}
