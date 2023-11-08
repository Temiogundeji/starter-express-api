"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.all('/', (req, res) => {
    console.log("Just got a request!");
    res.send('Yo!');
});
exports.app.listen(process.env.PORT || 3000);
