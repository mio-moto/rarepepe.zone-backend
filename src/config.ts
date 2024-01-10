import { exists } from "fs/promises";
import { file } from "bun";
import { loggerFactory } from "./logging";

interface IdealConfig {
    directory: {
        paths: {
            simple: string[];
            rare: string[];
            ultra: string[];
        };
    };
    database: {
        path: string;
    };
    renderer: {
        locations: {
            simple: string;
            rare: string;
            ultra: string;
        };
        basePath: string;
    };
}

type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : T[P] extends object | undefined
          ? RecursivePartial<T[P]>
          : T[P];
};

type PartialConfig = RecursivePartial<IdealConfig>;

export type Config = PartialConfig;

const logger = loggerFactory("SYS:Config");

export const readConfig = async (path: string = "data/config.json") => {
    logger.debug("Reading config");
    if (!(await exists(path))) {
        const message = `No file found at location '${path}'`;
        logger.error(message);
        throw new Error(message);
    }

    return (await file(path).json()) as PartialConfig;
};
