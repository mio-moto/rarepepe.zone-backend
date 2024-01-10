import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import directory from "#api/directory";
import discordWebhooks from "#api/webhooks/discord";
import { readConfig } from "#/config";
import randomizer from "#api/randomizer";
import hasher from "#api/hasher";
import { buildLister } from "#features/structuredLister";
import { buildRandomizer } from "#features/randomizer";
import { buildDataStore } from "#database/datastore";
import { buildHasher } from "./features/hasher";
import potd from "#api/potd";
import logger, { loggerFactory } from "#logging/index";
import axios from "axios";

/*
 * Quirks
 * 06. Jan 2024
 * Accept-Encoding: gzip
 * see: https://github.com/oven-sh/bun/issues/267
 * currently bun does not support brotli encoding
 */
axios.defaults.headers.common["Accept-Encoding"] = "gzip";

export type Environment = Awaited<ReturnType<typeof buildEnvironment>>;

const buildEnvironment = async () => {
    const config = await readConfig();
    const dataStore = await buildDataStore(config);
    const lister = await buildLister(config, dataStore);
    const randomizer = buildRandomizer(lister);
    const hasher = buildHasher(lister);
    const logger = loggerFactory("SYS:Host");

    return {
        config,
        dataStore,
        lister,
        randomizer,
        hasher,
        logger,
    };
};

(async () => {
    const environment = await buildEnvironment();

    const app = new Elysia();

    app.onError(({ code, error, set }) => {
        if (code === "NOT_FOUND") {
            set.status = 404;
            return JSON.stringify(
                {
                    error: "Not found",
                    status: 404,
                },
                null,
                2,
            );
        } else {
            logger.warn(`Error: ${error.message}\nStack: \n ${error.stack}`);
            set.status = 500;
            return JSON.stringify({ error: "Something went wrong.", status: 500 });
        }
    })
        .use(
            swagger({
                documentation: {
                    tags: [
                        { name: "info", description: "The introduction and index page of this API" },
                        { name: "potd", description: "Pepe of the day!" },
                        { name: "directory", description: "Listings for rarity-tagged Pepes" },
                        {
                            name: "randomizer",
                            description: "Gacha your pepe, request one of a specific rarity - or just hit lucky",
                        },
                        {
                            name: "hasher",
                            description: "Hash a pepe deterministically - same phrases will always yield the same pepe",
                        },
                    ],
                },
            }),
        )
        .use(await directory({ prefix: "/directory" }, environment))
        .use(await randomizer({ prefix: "/random" }, environment))
        .use(await hasher({ prefix: "/hash" }, environment))
        .use(await potd({ prefix: "/potd" }, environment))
        .use(await discordWebhooks({ prefix: "/webhooks/discord" }, environment))

        .get(
            "/",
            ({ headers }) => {
                headers["Content-Type"] = "application/json";
                return JSON.stringify(
                    {
                        greeting: "Hello there, you've reached the API of the rarepepe.zone",
                        history:
                            "This is a long term project of collecting Pepes all over the internet and sharing them.",
                        source: {
                            github: "https://github.com/darkmio/pepe-zone",
                            author: "https://miomoto.de/",
                        },
                        documentation: {
                            swagger: "/swagger",
                        },
                    },
                    null,
                    2,
                );
            },
            {
                detail: {
                    tags: ["info"],
                },
            },
        );
    app.listen(3000);

    const time = new Date(Date.now());

    environment.logger.info(`🐸 rarepepe.zone is running at ${app.server?.hostname}:${app.server?.port}`);
})();
