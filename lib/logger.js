const winston = require("winston");
winston.emitErrs = true;
const dailyRotate = require("winston-daily-rotate-file");
const logDir = "./logs";

exports.log = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: "debug",
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        new dailyRotate({
            filename: logDir + "/log-",
            datePattern: "yyyyMMdd.log",
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false
        })
    ],
    exitOnError: false
});
