import { Config } from "#/config";
import { watch } from "fs";
import { exists, readdir, stat } from "fs/promises";
import { buildUrlRenderer } from "./url-renderer";
import { basename, join } from "path";
import { PepeResult } from "#contracts/generators";

interface File {
    path: string,
    modified: number
}

const readdirRecursive = async (path: string) => {
    const dir = await readdir(path, { withFileTypes: true });

    let files: File[] = []
    for(var entry of dir) {
        if(entry.isDirectory()) {
            files = [...files, ...await readdirRecursive(entry.name)];
        }

        if(entry.isFile()) {
            const localizedPath = join(path, entry.name);
            const stats = await stat(localizedPath);
            const latestChangeTime = Math.max(stats.ctimeMs, stats.atimeMs, stats.birthtimeMs, stats.mtimeMs);
            files.push({path: join(path, entry.name), modified: latestChangeTime});
        }
    }
    return files;
}

const loadListing = async (path: string) => {
    const doesExist = path ? await exists(path) : false;
    if(!doesExist) {
        throw new Error(`The given path does not exist, value was: '${path}'`)
    }

    let files = await readdirRecursive(path);
    let lastModified = Math.max(...files.map(x => x.modified));
    const watcher = watch(
        path,
        { recursive: true },
        async (evt, filename) => {
            files = await readdirRecursive(path);
            lastModified = Math.max(...files.map(x => x.modified))
        }
    );

    return {
        getFiles: () => files,
        modified: () => lastModified 
    };
}

const loadAllListings = async (paths: string[] | undefined) => {
    if(paths === undefined) {
        throw new Error("The given paths were undefined, not configured perhaps?");
    }
    const listeners: Awaited<ReturnType<typeof loadListing>>[] = [];
    for(const path of paths) {
        listeners.push(await loadListing(path));
    }
    return {
        getfiles: () => listeners.flatMap(x => x.getFiles()),
        lastModified: () => Math.max(...listeners.map(x => x.modified())) 
    }
}

/**
 * Retains a permanently updated list of files in the returned categories
 */
export const buildLister = async (config: Config) => {
    const urlRenderer = buildUrlRenderer(config);

    const simples = await loadAllListings(config?.directory?.paths?.simple);
    const rares = await loadAllListings(config?.directory?.paths?.rare);
    const ultras = await loadAllListings(config?.directory?.paths?.ultra);

    const transformResult = (type: "simple" | "rare" | "ultra", file: File): PepeResult => ({
        type: type,
        path: file.path,
        filename: basename(file.path),
        url: urlRenderer.render(type, file.path)
    });

    const transformResults = (type: "simple" | "rare" | "ultra", paths: File[]): PepeResult[] =>
        paths.map(x => transformResult(type, x));


    const all = {
        getFiles: () => ({
            simples: transformResults("simple", simples.getfiles()),
            rares: transformResults("rare", rares.getfiles()),
            ultras: transformResults("ultra", ultras.getfiles()),
        })
    }    

    return {
        simples: {
            getfiles: () => transformResults("simple", simples.getfiles()),
            lastModified: simples.lastModified
        },
        rares: {
            getfiles: () => transformResults("rare", rares.getfiles()),
            lastModified: rares.lastModified
        },
        ultras: {
            getfiles: () => transformResults("ultra", ultras.getfiles()),
            lastModified: ultras.lastModified
        },
        all: all,
        lastModified: () => Math.max(simples.lastModified(), rares.lastModified(), ultras.lastModified())
    }
}

export type Lister = Awaited<ReturnType<typeof buildLister>>;