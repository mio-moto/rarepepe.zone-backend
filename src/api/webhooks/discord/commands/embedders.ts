import { type ActionRow, ButtonStyles, type CreateMessageOptions, MessageComponentTypes } from "@discordeno/types"
import { camelize } from "#/utils/camelize"
import { titleCase } from "#/utils/titleCase"
import type { PepeResult, PeplicationResult, RareResult, SimpleResult, UltraResult } from "#contracts/generators"
import type { BaseMetaResult } from "#database/datastore/meta-data"
import type { PeplicationStore } from "#database/datastore/peplication-store"
import type { UnknownInteraction } from "../types"

export enum VotingButtonId {
  Sentient = "pp_sentient",
  Horrible = "pp_horrible",
  Score = "pp_score",
}

export const formatNumber = (score: number) => {
  const counter = Math.floor(score)
  if (counter === 0) {
    return "±0"
  }
  if (counter > 0) {
    return `+${counter}`
  }
  return `${counter}`
}

export const buttonRow = (score: number): ActionRow => ({
  type: MessageComponentTypes.ActionRow,
  components: [
    {
      customId: VotingButtonId.Sentient,
      label: "🐸",
      type: MessageComponentTypes.Button,
      style: ButtonStyles.Success,
    },
    {
      customId: VotingButtonId.Score,
      label: formatNumber(score),
      type: MessageComponentTypes.Button,
      style: ButtonStyles.Secondary,
    },
    {
      customId: VotingButtonId.Horrible,
      label: "💀",
      type: MessageComponentTypes.Button,
      style: ButtonStyles.Danger,
    },
  ],
})

// 10MiB - 1KiB
const embedMaxSize = 10 * 1024 * 1024 - 1 * 1024

const embedFile = (result: PepeResult) => {
  const file = Bun.file(result.path)
  if (!file.exists()) {
    throw new Error(`Embedding image impossible, the image was not found (path: ${result.path})`)
  }

  const size = file.size
  if (size >= embedMaxSize) {
    return {
      image: { url: result.url },
      files: [],
    }
  }

  return {
    image: { url: `attachment://${result.filename}` },
    files: [
      {
        name: result.filename,
        blob: file,
      },
    ],
  }
}

export const embedUltra = (
  ultraIcon: string,
  pepe: UltraResult,
  meta: BaseMetaResult | null,
  interaction: UnknownInteraction,
): CreateMessageOptions => {
  const image = embedFile(pepe)
  return {
    embeds: [
      {
        title: `${pepe.filename}`,
        color: 0xdddddd,
        // exception here, ultras are so big sometimes, that upload may(?) file
        image: image?.image,
        author: { name: "ＵＬＴＲＡ ＲＡＲＥ", iconUrl: ultraIcon },
        footer: { text: `Unlocked by ${interaction.member?.user.globalName}` },
      },
    ],
    files: image?.files,
  }
}

const peplicationText = (metaData: Awaited<ReturnType<PeplicationStore["getByFile"]>>) => {
  if (metaData.traits.length < 3) {
    throw new Error("invalid peplication, not enough traits")
  }
  const traits = metaData.traits
  const [_bg, base, ...rest] = traits
  const lastTrait = rest.pop()
  if (!lastTrait) {
    return base.name
  }
  if (rest.length <= 0) {
    return `${base.name} with ${lastTrait.name}`
  }

  return `${base.name} with ${rest.map((x) => `${titleCase(x.name)}`).join(", ")} and ${lastTrait.name}`
}

export const embedPeplication = (
  peplication: PeplicationResult,
  metadata: Awaited<ReturnType<PeplicationStore["getByFile"]>>,
) => {
  const text = peplicationText(metadata)
  const image = embedFile(peplication)
  const embed: CreateMessageOptions = {
    embeds: [
      {
        title: `Peplicator #${metadata.index.toString().padStart(6, "0")}`,
        description: text,
        color: 0xebb023,
        image: image?.image,
        timestamp: new Date().toJSON(),
        footer: { text: "Matt Furie" },
      },
    ],
    files: image?.files,
  }
  return embed
}

export const embedRare = (rareIcon: string, pepe: RareResult, _meta: BaseMetaResult | null): CreateMessageOptions => {
  const image = embedFile(pepe)
  return {
    embeds: [
      {
        author: {
          name: "A RARE PEPE",
          iconUrl: rareIcon,
        },
        image: image?.image,
        color: 0xf1c40f,
      },
    ],
    components: [buttonRow(0)],
    files: image?.files,
  }
}

export const embedSimple = (
  message: string | null | undefined,
  pepe: SimpleResult,
  _meta: BaseMetaResult | null,
): CreateMessageOptions => {
  const image = embedFile(pepe)
  return {
    embeds: [
      {
        image: image?.image,
        footer: message ? { text: message } : undefined,
      },
    ],
    components: [buttonRow(0)],
    files: image?.files,
  }
}
