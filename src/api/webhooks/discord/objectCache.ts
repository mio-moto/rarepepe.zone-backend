import { AxiosResponse, isAxiosError } from "axios";

export interface ObjectCache<Identifier extends string | number | symbol, Payload> {
    entries: Record<Identifier, Payload>;
    get: (identifier: Identifier) => Payload;
    getAll: () => Payload[];
    [Symbol.iterator](): IterableIterator<Identifier>;
    set: (identifier: Identifier) => Payload;
}

export const buildObjectCache = <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Func extends (...args: any) => Promise<AxiosResponse<Payload>>,
    Payload = Awaited<ReturnType<Func>>["data"],
>(
    requestOne: Func,
    argumentIndex: number,
    selector: (object: Payload) => string,
) => {
    const entries: Record<string, Payload> = {};

    return {
        get: async (...args: Parameters<Func>): Promise<Payload | undefined> => {
            const discriminator = args[argumentIndex];
            if (typeof discriminator !== "string") {
                throw new Error("Invalid index for args");
            }
            const entry = entries[discriminator];
            if (entry) {
                return entry;
            }
            try {
                const result = await requestOne(args);
                if (result) {
                    entries[selector(result.data)] = result.data;
                }
                return result.data;
            } catch (error) {
                if (isAxiosError(error) && error.request?.status === 404) {
                    return;
                }
                throw error;
            }
        },
        getAll: () => entries,
        set: (payload: Payload) => {
            entries[selector(payload)] = payload;
        },
    };
};
