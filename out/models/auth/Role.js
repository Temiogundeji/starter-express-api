"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Role = mongoose.model("Role", new mongoose.Schema({
    name: String,
}));
exports.default = Role;
