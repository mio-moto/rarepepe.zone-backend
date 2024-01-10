import path, { basename } from "path";
import { Config } from "#/config";

export const buildUrlRenderer = (config: Config) => {
    if (!config.renderer || !config.renderer.basePath || !config.renderer.locations) {
        throw new Error("No configuration for renderer");
    }

    const prefixes = {
        simple: config.renderer.locations.simple!,
        rare: config.renderer.locations.rare!,
        ultra: config.renderer.locations.ultra!,
    };

    return {
        render: (type: "simple" | "rare" | "ultra", file: string) => {
            const basepath = config.renderer!.basePath;
            const prefix = prefixes[type];
            const name = basename(file);

            return new URL(path.join(prefix, name), basepath).href;
        },
    };
};
