"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler_1 = require("./exceptions/ErrorHandler");
const exitHandler_1 = require("./exitHandler");
process.on('unhandledRejection', (reason) => {
    console.log(`Unhandled Rejection: ${reason.message || reason}`);
    throw new Error(reason.message || reason);
});
process.on('uncaughtException', (error) => {
    console.log(`Uncaught Exception: ${error.message}`);
    ErrorHandler_1.Handler.handleError(error);
});
process.on('SIGTERM', () => {
    console.log(`Process ${process.pid} received SIGTERM: Exiting with code 0`);
    exitHandler_1.exitHandler.handleExit(0);
});
process.on('SIGINT', () => {
    console.log(`Process ${process.pid} received SIGINT: Exiting with code 0`);
    exitHandler_1.exitHandler.handleExit(0);
});
