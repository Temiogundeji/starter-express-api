"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exitHandler = void 0;
const _1 = require(".");
class ExitHandler {
    async handleExit(code, timeout = 5000) {
        try {
            console.log(`Attempting a graceful shutdown with code ${code}`);
            setTimeout(() => {
                console.log(`Forcing a shutdown with code ${code}`);
                process.exit(code);
            }, timeout).unref();
            if (_1.server.listening) {
                console.log('Terminating HTTP connections');
                await _1.httpTerminator.terminate();
            }
            console.log(`Exiting gracefully with code ${code}`);
            process.exit(code);
        }
        catch (error) {
            console.log('Error shutting down gracefully');
            console.log(error);
            console.log(`Forcing exit with code ${code}`);
            process.exit(code);
        }
    }
}
exports.exitHandler = new ExitHandler();
