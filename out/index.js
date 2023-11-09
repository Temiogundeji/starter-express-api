"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpTerminator = exports.server = exports.app = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const http_terminator_1 = require("http-terminator");
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./process");
require("dotenv/config");
const config_1 = require("./config");
const routes_1 = __importDefault(require("./routes"));
const mongoose = require("mongoose");
const config_2 = require("./config");
const Role_1 = __importDefault(require("./models/auth/Role"));
const PORT = config_1.env.PORT || 3000;
// import checkPermissions from "./middlewares/checkPermissions";
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.server = http_1.default.createServer(exports.app);
exports.app.use((0, helmet_1.default)());
exports.app.use(body_parser_1.default.json());
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
// app.use(checkPermissions);
exports.app.get('/', (req, res) => {
    res.send(`${config_1.env.environment === 'production'
        ? 'Welcome to MCICS FPI production environment'
        : 'Welcome to MCICS FPI development environment'}`);
});
exports.app.use('/mcics/api/v1', routes_1.default);
exports.app.all('/*', (req, res, next) => {
    next(new Error('Resource unavailable'));
});
exports.app.use((err, req, res) => {
    res.status(400).send({
        success: false,
        message: err.message.toLowerCase().includes('duplicate key')
            ? 'Account already exists'
            : err.message,
    });
});
exports.httpTerminator = (0, http_terminator_1.createHttpTerminator)({
    server: exports.server,
});
mongoose
    .connect(config_1.env.DATABASE_URI)
    .then(() => {
    const server = exports.app.listen(PORT, () => {
        const { port, address } = server.address();
        initialize();
        (0, config_2.logger)("start application", `Server is running on http://${address}${port}`);
    });
})
    .catch((err) => {
    console.log(err);
    process.exit(1);
});
function initialize() {
    Role_1.default.estimatedDocumentCount({})
        .then((count) => {
        // Use the count
        if (count <= 1) {
            new Role_1.default({
                name: "user",
            }).save();
            new Role_1.default({
                name: "moderator",
            }).save();
            new Role_1.default({
                name: "admin",
            }).save();
        }
    })
        .catch((err) => {
        // Handle the error
        throw new Error(err.message);
    });
}
