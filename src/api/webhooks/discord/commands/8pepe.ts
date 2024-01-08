import {
  APIActionRowComponent,
  APIApplicationCommandInteractionDataStringOption,
  APIChatInputApplicationCommandInteraction,
  APIInteractionResponseCallbackData,
  APIMessageActionRowComponent,
  ApplicationCommandOptionType,
  ButtonStyle,
  ComponentType,
} from "discord-api-types/v10";
import { ComponentPlugin, DiscordEnvironment, InteractionPlugin } from "../rabscuttle";
import { Environment } from "#/index";
import { RareResult, SimpleResult, UltraResult } from "#contracts/generators";
import { buildVoter } from "./pepeVoting";
import logger from "#/logging";

const randomInt = () => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0];
};

const normalizedRandomFloat = () => {
  const number = randomInt();
  return number / 2_147_483_647;
};

const probabilityHit = (value: number, nth: number) => value < 1 / nth;

const ultraChance = 75;
const rareChance = 32.5;

enum ButtonId {
  Sentient = "pepevote-sentient",
  Horrible = "pepevote-horrible",
  Score = "pepevote-score",
}

const buttonRow = (score: number): APIActionRowComponent<APIMessageActionRowComponent> => ({
  type: ComponentType.ActionRow,
  components: [
    {
      custom_id: ButtonId.Horrible,
      label: "💀",
      type: ComponentType.Button,
      style: ButtonStyle.Danger,
    },
    {
      custom_id: ButtonId.Score,
      label: formatNumber(score),
      type: ComponentType.Button,
      style: ButtonStyle.Secondary,
    },
    {
      custom_id: ButtonId.Sentient,
      label: "🐸",
      type: ComponentType.Button,
      style: ButtonStyle.Success,
    },
  ],
});

const formatNumber = (score: number) => {
  const counter = Math.floor(score);
  if (counter == 0) {
    return "±0";
  }
  if (counter > 0) {
    return `+${counter}`;
  }
  return `${counter}`;
};

const InteractableButtonIds = [ButtonId.Sentient, ButtonId.Score, ButtonId.Horrible] as const;
const VoteWeight: Record<ButtonId, number> = {
  [ButtonId.Sentient]: 1,
  [ButtonId.Score]: 0,
  [ButtonId.Horrible]: -1,
};

const buildGacha = (environment: Environment) => {
  return {
    gachaPepe: (phrase?: string | null) => {
      const value = Math.abs(normalizedRandomFloat());
      if (probabilityHit(value, ultraChance)) {
        return environment.randomizer.randomUltra();
      }
      if (probabilityHit(value, rareChance)) {
        return environment.randomizer.randomRare();
      }
      return phrase ? environment.hasher.hashSimple(phrase) : environment.randomizer.randomSimple();
    },
  };
};

const embedUltra = (
  ultraIcon: string,
  pepe: UltraResult,
  interaction: APIChatInputApplicationCommandInteraction,
): APIInteractionResponseCallbackData => {
  return {
    embeds: [
      {
        title: `${pepe.filename}`,
        color: 0xdddddd,
        image: { url: pepe.url },
        author: { name: "ＵＬＴＲＡ ＲＡＲＥ", icon_url: ultraIcon },
        footer: { text: `Unlocked by ${interaction.member?.user.global_name}` },
      },
    ],
  };
};

const embedRare = (
  rareIcon: string,
  pepe: RareResult,
): APIInteractionResponseCallbackData => {
  return {
    embeds: [
      {
        author: {
          name: "A RARE PEPE",
          icon_url: rareIcon,
        },
        image: { url: pepe.url },
        color: 0xf1c40f,
      },
    ],
    components: [buttonRow(0)],
  };
};

const embedSimple = (message: string | null | undefined, pepe: SimpleResult): APIInteractionResponseCallbackData => {
  return {
    embeds: [
      {
        image: { url: pepe.url, height: 300, width: 300 },
        footer: message ? { text: message } : undefined,
      },
    ],
    components: [buttonRow(0)],
  };
};

interface EightPepeConfig {
  rareIcon: string;
  ultraIcon: string;
}

export const buildEightPepe = async (environment: DiscordEnvironment) => {
  const gacha = buildGacha(environment);
  const { rareIcon, ultraIcon } = environment.discord.config.extras["eightPepe"] as EightPepeConfig;
  const voter = await buildVoter(environment.dataStore.database);

  const EightPepe: InteractionPlugin & ComponentPlugin = {
    name: "PepeGPT",
    publishedComponentIds: [...InteractableButtonIds],
    descriptor: {
      name: "pepegpt",
      description: "Rabscuttles technology of deep space singularity machine learning will bring up the best Pepe!",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "phrase",
          description: "Optional seed phrase",
          required: false,
        },
      ],
    },
    onNewInteraction: async interaction => {
      environment.logger.silly("Reached the universal eightpepe");
      const phrase = interaction.interaction.data.options?.find(
        x => x.name === "phrase",
      ) as APIApplicationCommandInteractionDataStringOption | null;
      const result = gacha.gachaPepe(phrase?.value);
      let message: APIInteractionResponseCallbackData = {};
      switch (result.type) {
        case "ultra":
          message = embedUltra(ultraIcon, result, interaction.interaction);
          break;
        case "rare":
          message = embedRare(rareIcon, result);
          break;
        case "simple":
          message = embedSimple(phrase?.value, result);
          break;
        default:
          return;
      }
      await interaction.reply(message);
      if (result.type === "rare" || result.type === "simple") {
        const sentMessage = await environment.discord.client.interactions.response.getOriginal(
          interaction.interaction.token,
        );
        await voter.beginVoting(sentMessage.data.channel_id, sentMessage.data.id);
      }
    },
    onNewButtonClick: async (interaction, _environment) => {
      logger.warn("reacher button interaction");

      // const channel = interaction.interaction.channel.id;
      const message = interaction.interaction.message.id;
      const user = interaction.interaction.member?.user.id ?? interaction.interaction.user?.id;
      if (!user) {
        logger.warn("could not find user id in this interaction");
        return;
      }
      const vote = interaction.interaction.data.custom_id as ButtonId;
      const weight = VoteWeight[vote];
      const voteValue = await voter.submitVote(message, user, weight);
      interaction.reply({ ...interaction.interaction.message, components: [buttonRow(voteValue)] });
    },
  };

  return EightPepe;
};
