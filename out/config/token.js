"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authConfig = {
    secret: "mcics-fpi-backend",
    jwtExpiration: 2592000000,
    jwtRefreshExpiration: 86400,
    jwtTempExpiration: 604800000
};
exports.default = authConfig;
