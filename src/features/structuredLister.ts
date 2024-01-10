import { Config } from "#/config";
import { watch } from "fs";
import { exists, readdir, stat } from "fs/promises";
import { buildUrlRenderer } from "./url-renderer";
import { basename, join } from "path";
import { PepeRarity, PepeResult } from "#contracts/generators";
import { Database } from "#database/datastore";
import sizeOf from "image-size";
import { RarePepeMetaParameter, SimplePepeMetaParameter } from "#database/datastore/meta-data";
import { loggerFactory } from "#/logging";

const logger = loggerFactory("SYS:Feature:Lister");

interface File {
    path: string;
    modified: number;
    created: number;
}

const errornousImageFiles: string[] = [];

const readdirRecursive = async (path: string) => {
    const dir = await readdir(path, { withFileTypes: true });

    let files: File[] = [];
    for (const entry of dir) {
        if (entry.isDirectory()) {
            files = [...files, ...(await readdirRecursive(entry.name))];
        }

        if (entry.isFile()) {
            const localizedPath = join(path, entry.name);
            const stats = await stat(localizedPath);
            const latestChangeTime = Math.max(stats.ctimeMs, stats.atimeMs, stats.birthtimeMs, stats.mtimeMs);
            files.push({ path: join(path, entry.name), modified: latestChangeTime, created: stats.ctimeMs });
        }
    }
    return files;
};

const updateUntrackedEntries = async (entry: File[], rarity: PepeRarity, database: Database) => {
    const trackedEntries = await database.metadata.getAll(rarity);
    const untrackedEntries = entry.filter(x => !trackedEntries.some(y => y.filename === basename(x.path)));
    if (untrackedEntries.length > 0) {
        logger.info(`Trying to track [${untrackedEntries.length}] new entries of rarity '${rarity}'`);
    }
    for (const untrackedEntry of untrackedEntries) {
        // primarily to avoid pollution of the system logs
        if (errornousImageFiles.includes(untrackedEntry.path)) {
            continue;
        }
        try {
            const size = await sizeOf(untrackedEntry.path);
            const baseData = {
                title: null,
                filename: basename(untrackedEntry.path),
                location: untrackedEntry.path,
                created: untrackedEntry.created,
                updated: untrackedEntry.modified,
                width: size.width ?? 0,
                height: size.height ?? 0,
            };

            logger.info(`New entry for '${baseData.filename}' (${rarity} | ${baseData.width}x${baseData.height}px)`);

            switch (rarity) {
                case "ultra":
                    await database.metadata.createOrUpdate(rarity, {
                        ...baseData,
                        collectorsNumber: parseInt(baseData.filename.substring(0, 3)),
                    } as RarePepeMetaParameter);
                    continue;
                case "rare":
                    await database.metadata.createOrUpdate(rarity, baseData as RarePepeMetaParameter);
                    continue;
                case "simple":
                    await database.metadata.createOrUpdate(rarity, baseData as SimplePepeMetaParameter);
                    continue;
            }
        } catch {
            logger.error(`Cannot parse image size of ${untrackedEntry.path}, skipping`);
            errornousImageFiles.push(untrackedEntry.path);
        }
    }
};

const loadListing = async (path: string, type: PepeRarity, database: Database) => {
    const doesExist = path ? await exists(path) : false;
    if (!doesExist) {
        throw new Error(`The given path does not exist, value was: '${path}'`);
    }

    let files = await readdirRecursive(path);
    updateUntrackedEntries(files, type, database);

    let lastModified = Math.max(...files.map(x => x.modified));
    watch(path, { recursive: true }, async (_evt, _filename) => {
        files = await readdirRecursive(path);
        updateUntrackedEntries(files, type, database);
        lastModified = Math.max(...files.map(x => x.modified));
    });

    return {
        getFiles: () => files,
        modified: () => lastModified,
    };
};

const loadAllListings = async (paths: string[] | undefined, type: PepeRarity, database: Database) => {
    if (paths === undefined) {
        throw new Error("The given paths were undefined, not configured perhaps?");
    }
    const listeners: Awaited<ReturnType<typeof loadListing>>[] = [];
    for (const path of paths) {
        listeners.push(await loadListing(path, type, database));
    }
    return {
        getfiles: () => listeners.flatMap(x => x.getFiles()),
        lastModified: () => Math.max(...listeners.map(x => x.modified())),
    };
};

/**
 * Retains a permanently updated list of files in the returned categories
 */
export const buildLister = async (config: Config, database: Database) => {
    const urlRenderer = buildUrlRenderer(config);

    const simples = await loadAllListings(config?.directory?.paths?.simple, "simple", database);
    const rares = await loadAllListings(config?.directory?.paths?.rare, "rare", database);
    const ultras = await loadAllListings(config?.directory?.paths?.ultra, "ultra", database);

    const transformResult = (type: PepeRarity, file: File): PepeResult => ({
        type: type,
        path: file.path,
        filename: basename(file.path),
        url: urlRenderer.render(type, file.path),
    });

    const transformResults = (type: "simple" | "rare" | "ultra", paths: File[]): PepeResult[] =>
        paths.map(x => transformResult(type, x));

    const all = {
        getFiles: () => ({
            simples: transformResults("simple", simples.getfiles()),
            rares: transformResults("rare", rares.getfiles()),
            ultras: transformResults("ultra", ultras.getfiles()),
        }),
    };

    return {
        simples: {
            getfiles: () => transformResults("simple", simples.getfiles()),
            lastModified: simples.lastModified,
        },
        rares: {
            getfiles: () => transformResults("rare", rares.getfiles()),
            lastModified: rares.lastModified,
        },
        ultras: {
            getfiles: () => transformResults("ultra", ultras.getfiles()),
            lastModified: ultras.lastModified,
        },
        all: all,
        lastModified: () => Math.max(simples.lastModified(), rares.lastModified(), ultras.lastModified()),
    };
};

export type Lister = Awaited<ReturnType<typeof buildLister>>;
