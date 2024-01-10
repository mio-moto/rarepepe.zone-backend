import {
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import { DiscordEnvironment, InteractionPlugin, Plugin, Rabscuttle } from "../rabscuttle";
import { ApplicationCommandUpdateRequest } from "../rest";
import { loggerFactory } from "#/logging";

const collectPluginDescriptors = (plugins: Plugin[]) => {
    const globalCommands: (
        | RESTPostAPIChatInputApplicationCommandsJSONBody
        | RESTPostAPIContextMenuApplicationCommandsJSONBody
    )[] = [];
    const localCommands: Record<
        string,
        (RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIContextMenuApplicationCommandsJSONBody)[]
    > = {};

    Object.values(plugins).forEach(plugin => {
        if (!("descriptor" in plugin)) {
            return;
        }
        if ("locallyScoped" in plugin && plugin.locallyScoped) {
            for (const guild of plugin.guilds) {
                if (guild in localCommands) {
                    if (localCommands[guild].some(x => x.name === plugin.descriptor.name)) {
                        continue;
                    }
                    localCommands[guild].push(plugin.descriptor);
                } else {
                    localCommands[guild] = [plugin.descriptor];
                }
            }
        } else {
            if (globalCommands.some(x => x.name === plugin.descriptor.name)) {
                return;
            }
            globalCommands.push(plugin.descriptor);
        }
    });

    return [
        globalCommands as ApplicationCommandUpdateRequest[],
        localCommands as Record<string, ApplicationCommandUpdateRequest[]>,
    ] as const;
};

export const buildCycleCommands = async (getRabs: () => Rabscuttle, { discord }: DiscordEnvironment) => {
    const homeGuilds: string[] = [discord.config.homeGuild];
    const logger = loggerFactory("WEBHK:Discord:Admin");
    const descriptor = {
        name: "reload",
        description: "Remove all commands everywhere and run the registering",
    };

    const response = await discord.client.commands.guild.listAll(discord.config.homeGuild);
    if (!response.data.some(x => x.name === descriptor.name)) {
        logger.warn("Reload mechanism is not in home guild, creating it now");
        await discord.client.commands.guild.create(discord.config.homeGuild, descriptor);
    }

    const cycleCommands: InteractionPlugin = {
        locallyScoped: true,
        guilds: homeGuilds,
        name: "ADMIN: Reload Commands",
        descriptor: descriptor,
        onNewInteraction: async ({ reply, interaction }, { discord }) => {
            const member = interaction.member?.user ?? interaction.user;
            if (
                !member ||
                !discord.config.administrators.some(
                    x => x.tag === member.discriminator && x.username === member.username,
                )
            ) {
                await reply({ content: "Not allowed, go away." });
                return;
            }
            const { client } = discord;

            const rabs = getRabs();

            const [gloablCommands, localCommands] = collectPluginDescriptors([
                ...Object.values(rabs.autocompletes),
                ...rabs.components,
                ...Object.values(rabs.contextMenu),
                ...Object.values(rabs.interactions),
                ...rabs.modals,
            ]);

            logger.info(`Requested to overwrite all commands and re-register.`);

            const response = await client.commands.global.overwriteAll(gloablCommands);
            const registeredGlobalCommands = response.data.map(x => x.name);
            const registeredGuildCommands: Record<string, string[]> = {};

            for (const [guild, commands] of Object.entries(localCommands)) {
                const response = await client.commands.guild.overwriteAll(guild, commands);
                registeredGuildCommands[guild] = response.data.map(x => x.name);
            }

            const report =
                `Global: [${registeredGlobalCommands.join(", ")}]\n` +
                `Locally:\n${JSON.stringify(registeredGuildCommands, null, 2)}`;
            logger.info(`Overwritten and registered:\n${report}`);

            const reportObject = {
                global: registeredGlobalCommands,
                guild: registeredGuildCommands,
            };
            reply({
                content: `Overwritten and registered:\n\`\`\`json\n${JSON.stringify(reportObject, null, 1)}\n\`\`\``,
            });
        },
    };

    return cycleCommands;
};
