const pino = require("pino");
const expressPino = require("express-pino-logger");
const logger = pino();
const expressLogger = expressPino({ logger });

export { logger, expressLogger };
