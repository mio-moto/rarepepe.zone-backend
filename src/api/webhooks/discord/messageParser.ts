import { DiscordAPIClient } from "./clients/apiClient";

const MatchReference =
    /<(?:(?<type>@[!&]?|#)|(?:\/(?<commandName>[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai} ]+):)|(?:a?:(?<emojiName>[\w]+):))(?<id>\d{17,19})>/gu;

type MatchType = "command" | "emoji" | "role" | "user" | "channel" | "unknown";

const collectReferencedComponents = async (
    match: RegExpMatchArray,
    client: DiscordAPIClient,
    metadata: CleanMessageMeta,
) => {
    const { guildSource } = metadata;

    const [text, type, commandName, emojiName, id] = match;
    if (commandName) {
        return {
            type: "command",
            source: text,
            replacement: `/${commandName}`,
        };
    }

    if (emojiName) {
        return {
            type: "emoji",
            source: text,
            replacement: `:${emojiName}:`,
        };
    }

    switch (type) {
        case "@":
        case "@!": {
            const user = await client.user.get(id);
            const name = user?.globalName ?? user?.username;
            return {
                type: "user",
                source: text,
                replacement: name ? `@${name}` : text,
            };
        }
        case "@&": {
            const roles = guildSource ? await client.role.getAll(guildSource) : undefined;
            const role = roles?.roles.find(x => x.id == id);
            return {
                type: "role",
                source: text,
                replacement: role ? `@${role.name}` : text,
            };
        }
        case "#": {
            const channel = await client.channel.get(id);
            const channelName = channel?.name;
            return {
                type: "channel",
                source: text,
                replacement: channelName ? `#${channelName}` : text,
            };
        }
        default:
            return {
                type: "unknown",
                source: text,
                replacement: text,
            };
    }
};

type CleanMessageMeta = {
    guildSource: string;
};

export const buildMessageParser = (client: DiscordAPIClient) => {
    return {
        cleanMessage: async (message: string, metadata: CleanMessageMeta) => {
            const components = message.matchAll(MatchReference);

            let replacedString = `${message}`;
            for (const match of components) {
                const m = await collectReferencedComponents(match, client, metadata);
                const { type, source, replacement } = m;
                if (type === "unknown") {
                    continue;
                }
                replacedString = replacedString.replace(source, replacement);
            }
            return replacedString;
        },
    };
};

export type DiscordMessageParser = ReturnType<typeof buildMessageParser>;
