import winston from "winston";
import config from "../config/config.js";

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "cyan",
        debug: "white"
    }
};
let loggerVar;
if ( config.environment == "production" ) {
    loggerVar = winston.createLogger ({
        levels: customLevels.levels,
        transports: [
            new winston.transports.Console ({
                level: "info",
                format: winston.format.combine (
                    winston.format.colorize ({colors: customLevels.colors}),
                    winston.format.simple ()
                )
            }),
            new winston.transports.File ({
                filename: "./logs/errors.log",
                level: "error",
                format: winston.format.simple ()
            })
        ]
    });
} else {
    loggerVar = winston.createLogger ({
        levels: customLevels.levels,
        transports: [
            new winston.transports.Console ({
                level: "debug",
                format: winston.format.combine (
                    winston.format.colorize ({colors: customLevels.colors}),
                    winston.format.simple ()
                )
            })
        ]
    });
};
const logger = loggerVar;
export default logger;

