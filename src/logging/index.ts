import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
const { printf } = format;

const levelToString = (level: string): string => {
    const lowerLevel = level.toLowerCase().trim();

    // these are the default levels that winston provides
    switch (lowerLevel) {
        case "error":
            return "err ";
        case "warn":
            return "warn";
        case "info":
            return "info";
        case "http":
            return "http";
        case "verbose":
            return "vrbs";
        case "debug":
            return "debg";
        case "silly":
            return "sill";
        default:
            return lowerLevel.substring(0, 3);
    }
};
let longestTopic = 0;

const timeFormat = () =>
    new Date()
        .toLocaleString("en-gb", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
        .replace(/\//g, "-")
        .replace(", ", " ");

const messageFormat = printf(({ level, message, label }) => {
    const abbreviation = levelToString(level);
    const date = `[${timeFormat()}]`;
    const prefix = `[${label}:${abbreviation}]`;
    // 7: 4 from abbreviation, 3 from [:]
    return `${date} ${prefix.padEnd(longestTopic + 7)} ${message}`;
});

const fileFormat = printf(({ level, message, label, timestamp }) => {
    const dateObject = new Date(timestamp);
    const time = dateObject.toTimeString().split(" ")[0];
    const date = dateObject.toJSON().slice(0, 10).split("-").reverse().join("/");
    return `${date} ${time} - ${level.toUpperCase()} - [${label}] ${message}`;
});

/**
 *
 * @param prefix should be of length 6 or less
 * @returns
 */
export const loggerFactory = (prefix: string) => {
    longestTopic = Math.max(longestTopic, prefix.length);
    return createLogger({
        level: "silly",
        format: format.combine(format.errors({ stack: true }), format.splat(), format.json()),
        defaultMeta: { service: prefix },
        transports: [
            new transports.Console({
                format: format.combine(format.label({ label: prefix }), messageFormat),
            }),
            new DailyRotateFile({
                level: "info",
                filename: "data/logs/rolling-%DATE%.log",
                datePattern: "yyyy-MM-DD",
                maxFiles: 100,
                options: { flags: "a" },
                format: format.combine(format.timestamp(), format.label({ label: prefix }), fileFormat),
            }),
        ],
    });
};

{
    // capturing console and redirecting it into winston
    const logger = loggerFactory("BASE:!Console");
    console.log = (...args: Parameters<typeof console.log>) => logger.info(args);
    console.warn = (...args: Parameters<typeof console.warn>) => logger.warn(args);
    console.error = (...args: Parameters<typeof console.error>) => logger.error(args);
    console.debug = (...args: Parameters<typeof console.debug>) => logger.debug(args);
}

const logger = loggerFactory("!Default");
export default logger;
