"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const config_1 = require("../config");
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: config_1.cloudinary.v2,
    params: {
        folder: 'MCICS app users',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        resource_type: 'auto',
        max_file_size: 5000000, // 5 MB in bytes
    },
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
