"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, label, printf } = winston_1.format;
const myFormat = printf(({ level, message, label, timestamp }) => `${timestamp} || [${label}] || ${level}: ${message}`);
const log = (action, message) => {
    const logger = (0, winston_1.createLogger)({
        format: combine(label({ label: `tracking action: ${action}` }), timestamp(), myFormat),
        transports: [new winston_1.transports.Console()],
    });
    logger.log({ level: 'info', message });
};
exports.default = log;
