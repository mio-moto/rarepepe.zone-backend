import { exists, readFile } from "fs/promises"
import { file } from "bun"


interface IdealConfig {
    directory: {
        paths: {
            simple: string[],
            rare: string[],
            ultra: string[],
        }
    },
    database: {
        path: string
    },
    renderer: {
        locations: {
            simple: string,
            rare: string,
            ultra: string
        },
        basePath: string
    }
}

type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object | undefined ? RecursivePartial<T[P]> :
    T[P];
};

type PartialConfig = RecursivePartial<IdealConfig>;

export type Config = PartialConfig;

export const readConfig = async (path: string = "data/config.json") => {
    console.log("reading config");
    if (!await exists(path)) {
        throw new Error(`No file found at location '${path}'`);
    }

    return await (file(path).json()) as PartialConfig;
}