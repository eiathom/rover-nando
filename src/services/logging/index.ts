import * as bunyan from "bunyan";
import * as bunyanFormat from "bunyan-format";

const format: any = bunyanFormat.default({
    outputMode: "short",
});
const logger: any = bunyan.createLogger({
    name: "rover-nando",
    stream: format,
});

export {
    logger,
};
