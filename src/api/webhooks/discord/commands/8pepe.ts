import { ComponentPlugin, ContextMenuPlugin, DiscordEnvironment, InteractionPlugin } from "../rabscuttle";
import { Environment } from "#/index";
import { PepeResult, RareResult, SimpleResult, UltraResult } from "#contracts/generators";
import { PepeVoting, buildVoter } from "../datastore/pepeVoting";
import logger from "#/logging";
import { BaseMetaResult } from "#database/datastore/meta-data";
import { DiscordAPIClient } from "../clients/apiClient";
import {
    ActionRow,
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
    ButtonStyles,
    CreateMessageOptions,
    DiscordInteractionDataOption,
    DiscordMessageFlag,
    MessageComponentTypes,
} from "@discordeno/types";
import { UnknownInteraction } from "../types";
import {
    ChatInputApplicationCommandInteractionClient,
    ContextMenuApplicationCommandInteractionClient,
    MessageComponentInteractionClient,
} from "../clients/interactionClient";

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
    Sentient = "pp_sentient",
    Horrible = "pp_horrible",
    Score = "pp_score",
}

const buttonRow = (score: number): ActionRow => ({
    type: MessageComponentTypes.ActionRow,
    components: [
        {
            customId: ButtonId.Horrible,
            label: "💀",
            type: MessageComponentTypes.Button,
            style: ButtonStyles.Danger,
        },
        {
            customId: ButtonId.Score,
            label: formatNumber(score),
            type: MessageComponentTypes.Button,
            style: ButtonStyles.Secondary,
        },
        {
            customId: ButtonId.Sentient,
            label: "🐸",
            type: MessageComponentTypes.Button,
            style: ButtonStyles.Success,
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

const buildVotingResult = (counter: number): ActionRow => ({
    type: MessageComponentTypes.ActionRow,
    components: [
        {
            type: MessageComponentTypes.Button,
            customId: "result",
            emoji: { name: ":frog:" },
            style: ButtonStyles.Secondary,
            label: `Voting Result: ${counter}`,
            disabled: true,
        },
    ],
});

const updateAllVotingComponents = async (client: DiscordAPIClient, voter: PepeVoting) => {
    const closeVotingSession = async (
        client: DiscordAPIClient,
        voter: PepeVoting,
        channelId: string,
        messageId: string,
    ) => {
        try {
            const message = await client.message.get(channelId, messageId);
            const result = (await voter.getVotingResult(messageId)) ?? 0;
            const components = result === 0 ? [] : [buildVotingResult(result)];
            client.message.edit(channelId, messageId, { embeds: message!.embeds, components: components });
        } catch (e) {
            logger.error(`Dicarding voting, error encountered: ${e}`);
        }
        await voter.closeVoting(messageId);
    };

    const messages = await voter.getOpenVotingsOlderThan(1);
    if (messages.length > 0) {
        logger.debug(`Closing ${messages.length} voting sessions`);
    }
    for (const message of messages) {
        await closeVotingSession(client, voter, message.channel, message.message);
    }
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
    meta: BaseMetaResult | null,
    interaction: UnknownInteraction,
): CreateMessageOptions => {
    return {
        embeds: [
            {
                title: `${pepe.filename}`,
                color: 0xdddddd,
                image: { url: pepe.url },
                author: { name: "ＵＬＴＲＡ ＲＡＲＥ", iconUrl: ultraIcon },
                footer: { text: `Unlocked by ${interaction.member?.user.globalName}` },
            },
        ],
    };
};

const embedRare = (rareIcon: string, pepe: RareResult, meta: BaseMetaResult | null): CreateMessageOptions => {
    return {
        embeds: [
            {
                author: {
                    name: "A RARE PEPE",
                    iconUrl: rareIcon,
                },
                image: { url: pepe.url },
                color: 0xf1c40f,
            },
        ],
        components: [buttonRow(0)],
    };
};

const embedSimple = (
    message: string | null | undefined,
    pepe: SimpleResult,
    meta: BaseMetaResult | null,
): CreateMessageOptions => {
    return {
        embeds: [
            {
                image: { url: pepe.url },
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

const buildMessageGenerator = async (environment: DiscordEnvironment) => {
    const gacha = buildGacha(environment);
    const { rareIcon, ultraIcon } = environment.discord.config.extras["eightPepe"] as EightPepeConfig;

    const voter = await buildVoter(environment.dataStore.database);
    setInterval(async () => {
        updateAllVotingComponents(environment.discord.client, voter);
    }, 60 * 1000);

    return {
        createMessage: async (interaction: UnknownInteraction, phrase?: string | null) => {
            const result = gacha.gachaPepe(phrase ? `${phrase}` : null);
            const metaData = await environment.dataStore.metadata.get(result.type, result.filename);
            switch (result.type) {
                case "ultra":
                    return [result, embedUltra(ultraIcon, result, metaData, interaction)] as const;
                case "rare":
                    return [result, embedRare(rareIcon, result, metaData)] as const;
                case "simple":
                    return [result, embedSimple(phrase ? `${phrase}` : null, result, metaData)] as const;
            }
        },
        beginVoting: async (
            result: PepeResult,
            client:
                | ChatInputApplicationCommandInteractionClient
                | MessageComponentInteractionClient
                | ContextMenuApplicationCommandInteractionClient,
        ) => {
            if (result.type === "rare" || result.type === "simple") {
                const sentMessage = await client.fetchReply();
                await voter.beginVoting(sentMessage.channelId, sentMessage.id);
            }
        },
        submitVote: voter.submitVote,
    };
};

export const buildEightPepe = async (environment: DiscordEnvironment) => {
    const messageGenerator = await buildMessageGenerator(environment);

    const EightPepe: InteractionPlugin & ComponentPlugin = {
        name: "PepeGPT",
        publishedComponentIds: [...InteractableButtonIds],
        descriptor: {
            type: ApplicationCommandTypes.ChatInput,
            name: "pepegpt",
            description:
                "Rabscuttles technology of deep space singularity machine learning will bring up the best Pepe!",
            options: [
                {
                    type: ApplicationCommandOptionTypes.String,
                    name: "phrase",
                    description: "Optional seed phrase",
                    required: false,
                },
            ],
        },
        onNewInteraction: async (interaction, environment) => {
            const phrase = interaction.data.data.options?.find(
                x => x.name === "phrase",
            ) as DiscordInteractionDataOption | null;
            const content = phrase ? `${phrase?.value}` : undefined;
            const cleanedUpMessage = content
                ? await environment.discord.messageParser.cleanMessage(content, {
                      guildSource: interaction.data.guildId ?? "",
                  })
                : undefined;

            const [result, message] = await messageGenerator.createMessage(interaction.data, cleanedUpMessage);
            await interaction.reply(message);
            messageGenerator.beginVoting(result, interaction);
        },
        onNewButtonClick: async (interaction, _environment) => {
            const message = interaction.data.message.id;
            const user = interaction.data.member?.user.id ?? interaction.data.user?.id;
            if (!user) {
                logger.warn("could not find user id in this interaction");
                return;
            }
            const vote = interaction.data.data.customId as ButtonId;
            const weight = VoteWeight[vote];
            const voteValue = await messageGenerator.submitVote(message, user, weight);
            interaction.edit({ ...interaction.data.message, components: [buttonRow(voteValue)] });
        },
    };

    const PepeThis: ContextMenuPlugin = {
        name: "Pepe This!",
        descriptor: {
            name: "Pepe this!",
            type: ApplicationCommandTypes.Message,
        },
        onNewContextAction: async (interaction, environment) => {
            if (interaction.data.data.type !== ApplicationCommandTypes.Message) {
                interaction.reply({
                    content: "This is not invoked via a context menu, that should not have happened.",
                    flags: DiscordMessageFlag.Ephemeral,
                });
                return;
            }

            // @todo: narrow types that resolved exists
            const discordMessage = Object.values(interaction.data.data.resolved!.messages!)[0];
            const content = discordMessage.content!;
            const guild = interaction.data.guildId ?? "";
            const cleanedUpMessage = await environment.discord.messageParser.cleanMessage(content, {
                guildSource: guild,
            });

            const [result, message] = await messageGenerator.createMessage(interaction.data, cleanedUpMessage);
            await interaction.reply(message);
            messageGenerator.beginVoting(result, interaction);
        },
    };

    return {
        eightPepePlugin: EightPepe,
        pepeThisPlugin: PepeThis,
    };
};
