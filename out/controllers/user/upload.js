"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
const services_1 = require("../../services");
const { apiResponse } = utils_1.Toolbox;
async function upload(req, res) {
    try {
        const appUser = req.user;
        const image = req.file?.path ? req.file?.path : '';
        if (!image)
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.BAD_REQUEST, _types_1.ResponseCode.FAILURE, {}, 'Image upload failed. Please try again.');
        const updatedUser = await services_1.Users.updateUser(appUser._id, { image });
        return apiResponse(res, _types_1.ResponseType.SUCCESS, _types_1.StatusCode.OK, _types_1.ResponseCode.SUCCESS, updatedUser);
    }
    catch (error) {
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(error)} `);
    }
}
exports.default = upload;
