import { loggerFactory } from "#/logging";


const fallbackLogger = loggerFactory("SYS:TryInvoke")
export const tryInvoke = <T>(action: () => T, logger: ReturnType<typeof loggerFactory> = fallbackLogger) => {
    try {
        return action();
    } catch (e) {
        logger.error(e);
    }
};