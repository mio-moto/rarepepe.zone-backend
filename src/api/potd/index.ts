import { Elysia, t } from "elysia";
import { Environment } from "#/index";
import { simpleResult } from "#contracts/api-results";

const potdResponse = t.Object({ ...simpleResult.properties, date: t.String() });

const dateTimeFormat = new Intl.DateTimeFormat("en-gb");

export default async <const Prefix extends string | undefined>(
    { prefix = "/potd" }: { prefix: Prefix },
    environment: Environment,
) => {
    const { dataStore, hasher } = environment;

    const retrievePotd = async (date: Date) => {
        let potd = await dataStore.potdStore.getPotd(date);
        if (!potd) {
            const formattedDate = dateTimeFormat.format(date);
            // @todo: should use probability based hashing
            potd = {
                url: await hasher.hashSimple(formattedDate).url,
                year: date.getUTCFullYear(),
                month: date.getUTCMonth() + 1,
                day: date.getUTCDate(),
            };
            await dataStore.potdStore.submitPotd(date, potd.url);
        }
        return {
            type: "simple",
            url: potd.url,
            date: new Date(Date.UTC(potd.year, potd.month, potd.day)).toLocaleDateString(),
        };
    };

    return new Elysia({ prefix })
        .get(
            `/`,
            async () => {
                const now = new Date(Date.now());
                return retrievePotd(now);
            },
            {
                response: {
                    200: potdResponse,
                },
                detail: { tags: ["potd"] },
            },
        )

        .get(
            `/:year/:month/:day`,
            async ({ params: { year, month, day }, set }) => {
                year = Math.floor(year);
                month = Math.floor(month);
                day = Math.floor(day);

                if (year < 1900 || year > 4500) {
                    set.status = 400;
                    return {
                        error: "Year outside of range of [1900, 4500]",
                        status: 400,
                    };
                }
                const date = new Date(Date.UTC(year, month - 1, day));
                return retrievePotd(date);
            },
            {
                params: t.Object({
                    year: t.Numeric(),
                    month: t.Numeric(),
                    day: t.Numeric(),
                }),
                response: {
                    200: potdResponse,
                    400: t.Object({ error: t.String(), status: t.Number() }),
                },
                detail: { tags: ["potd"] },
            },
        );
};
