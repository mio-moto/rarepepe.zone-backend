import { hash32String } from "#utils/murmurhash3_32";
import { Lister } from "#features/structuredLister";

const hashString = (text: string) => hash32String(text.toLowerCase(), 0xf3375_600d)!;

const hashCollection = <T>(text: string, collection: T[]): T => {
    const hash = hashString(text);
    return collection[hash % collection.length];
};

export const buildHasher = (lister: Lister) => {
    return {
        hashUltra: (text: string) => hashCollection(text, lister.ultras.getfiles()),
        hashRare: (text: string) => hashCollection(text, lister.rares.getfiles()),
        hashSimple: (text: string) => hashCollection(text, lister.simples.getfiles()),
    };
};
