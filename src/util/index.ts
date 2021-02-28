import pino from "pino";

const log: pino.Logger = pino({
    prettyPrint: true,
    level: "info"
});

/**
 * Check the value of an input is valid
 *
 * @param {any} input any input where the value of the input is checked
 * @returns {boolean} whether an input is valid
 */
const unSet = (input: unknown): boolean => (input === (null || undefined));

export {
    log,
    unSet,
};