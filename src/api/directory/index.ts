import { Elysia, t } from "elysia";
import { Environment } from "#/index";
import { simpleResult, rareResult, ultraResult } from "#contracts/api-results";
import { resultsToDto } from "#/utils/resultToDto";

export const collectionStat = t.Object({ count: t.Number(), changed: t.Date() });
export const collectionMetaStats = t.Object({
    changed: t.Date(),
    simples: collectionStat,
    rares: collectionStat,
    ultras: collectionStat,
});

export const collectionSimpleResponse = t.Object({ meta: collectionStat, entries: t.Array(simpleResult) });
export const collectionRareResponse = t.Object({ meta: collectionStat, entries: t.Array(rareResult) });
export const collectionUltraResponse = t.Object({ meta: collectionStat, entries: t.Array(ultraResult) });

export const allCollectionResponse = t.Object({
    meta: collectionMetaStats,
    simple: t.Array(simpleResult),
    rare: t.Array(rareResult),
    ultra: t.Array(ultraResult),
});

export default async <const Prefix extends string | undefined>(
    { prefix = "/directory" }: { prefix: Prefix },
    environment: Environment,
) => {
    const { lister } = environment;

    return new Elysia({ prefix })
        .get(
            `/`,
            () => {
                const simples = lister.simples.getfiles();
                const rares = lister.rares.getfiles();
                const ultras = lister.rares.getfiles();

                const stats = {
                    changed: new Date(lister.lastModified()),
                    simples: {
                        count: simples.length,
                        changed: new Date(lister.simples.lastModified()),
                    },
                    rares: {
                        count: rares.length,
                        changed: new Date(lister.rares.lastModified()),
                    },
                    ultras: {
                        count: ultras.length,
                        changed: new Date(lister.ultras.lastModified()),
                    },
                };

                return {
                    meta: stats,
                    simple: resultsToDto(simples),
                    rare: resultsToDto(rares),
                    ultra: resultsToDto(ultras),
                };
            },
            {
                response: {
                    200: allCollectionResponse,
                },
                detail: { tags: ["directory"] },
            },
        )

        .get(
            `/meta`,
            () => {
                const simples = lister.simples.getfiles();
                const rares = lister.rares.getfiles();
                const ultras = lister.rares.getfiles();
                const stats = {
                    changed: new Date(lister.lastModified()),
                    simples: {
                        count: simples.length,
                        changed: new Date(lister.simples.lastModified()),
                    },
                    rares: {
                        count: rares.length,
                        changed: new Date(lister.rares.lastModified()),
                    },
                    ultras: {
                        count: ultras.length,
                        changed: new Date(lister.ultras.lastModified()),
                    },
                };

                return stats;
            },
            {
                response: { 200: collectionMetaStats },
                detail: { tags: ["directory"] },
            },
        )

        .get(
            `/simple`,
            () => {
                const files = lister.simples.getfiles();
                const lastModified = new Date(lister.simples.lastModified());
                return {
                    meta: {
                        count: files.length,
                        changed: lastModified,
                    },
                    entries: resultsToDto(files),
                };
            },
            {
                response: { 200: collectionSimpleResponse },
                detail: { tags: ["directory"] },
            },
        )

        .get(
            `/rare`,
            () => {
                const files = lister.rares.getfiles();
                const lastModified = new Date(lister.rares.lastModified());
                return {
                    meta: {
                        count: files.length,
                        changed: lastModified,
                    },
                    entries: resultsToDto(files),
                };
            },
            {
                response: { 200: collectionRareResponse },
                detail: { tags: ["directory"] },
            },
        )

        .get(
            `/ultra`,
            () => {
                const files = lister.ultras.getfiles();
                const lastModified = new Date(lister.ultras.lastModified());
                return {
                    meta: {
                        count: files.length,
                        changed: lastModified,
                    },
                    entries: resultsToDto(files),
                };
            },
            {
                response: { 200: collectionUltraResponse },
                detail: { tags: ["directory"] },
            },
        );
};
