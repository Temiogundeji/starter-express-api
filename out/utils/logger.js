"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressLogger = exports.logger = void 0;
const pino = require("pino");
const expressPino = require("express-pino-logger");
const logger = pino();
exports.logger = logger;
const expressLogger = expressPino({ logger });
exports.expressLogger = expressLogger;
