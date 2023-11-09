"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
const services_1 = require("../../services");
const { apiResponse } = utils_1.Toolbox;
async function softDeleteUser(req, res) {
    try {
        const { deactivate, id } = req.body;
        const appUser = await services_1.Users.getUserById(id);
        if (!appUser) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.BAD_REQUEST, _types_1.ResponseCode.FAILURE, {}, 'User not found');
        }
        if (appUser?.isDeleted?.status && deactivate)
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.BAD_REQUEST, _types_1.ResponseCode.FAILURE, {}, 'This account is already marked for deleting.');
        await services_1.Users.updateUser(appUser?._id, {
            isDeleted: {
                status: deactivate,
                date: new Date(),
            },
        });
        return apiResponse(res, _types_1.ResponseType.SUCCESS, _types_1.StatusCode.OK, _types_1.ResponseCode.SUCCESS, deactivate ? 'This account will be deleted in 30days.' : 'This account is restored.');
    }
    catch (error) {
        console.log(error);
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(error)} `);
    }
}
exports.default = softDeleteUser;
