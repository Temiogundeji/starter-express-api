"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const AppError_1 = require("./AppError");
const exitHandler_1 = require("../exitHandler");
class ErrorHandler {
    handleError(error, response) {
        if (this.isTrustedError(error) && response) {
            this.handleTrustedError(error, response);
        }
        else {
            this.handleUntrustedError(error, response);
        }
    }
    isTrustedError(error) {
        if (error instanceof AppError_1.AppError) {
            return error.isOperational;
        }
        return false;
    }
    handleTrustedError(error, response) {
        response.status(error.httpCode).json({ message: error.message });
    }
    handleUntrustedError(error, response) {
        if (response) {
            response.status(AppError_1.HttpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
        console.log('Application encountered an untrusted error.');
        console.log(error);
        exitHandler_1.exitHandler.handleExit(1);
    }
}
exports.Handler = new ErrorHandler();
