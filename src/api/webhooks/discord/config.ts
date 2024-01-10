import { exists } from "fs/promises";
import { file } from "bun";

const discordConfigLocation = "data/discord.json";

export interface DiscordConfigFile {
    applicationId: string;
    adminGuild: string;
    token: string;
    publicKey: string;
    allowedApplicationIds: string[];
    administrators: { username: string; tag: string }[];
    homeGuild: string;
    extras: Record<string, unknown>;
}

export const loadDiscordConfig = async (configLocation = discordConfigLocation) => {
    if (!exists(configLocation)) {
        throw new Error(`No file found at: '${configLocation}'`);
    }

    return (await file(configLocation).json()) as DiscordConfigFile;
};
