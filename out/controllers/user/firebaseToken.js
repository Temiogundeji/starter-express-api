"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
const { apiResponse } = utils_1.Toolbox;
async function firebaseToken(req, res) {
    try {
        const { firebaseToken } = req.body;
        if (!firebaseToken)
            return res.status(400).send({ success: false, message: 'Token is required' });
        let user = req.user;
        user.firebaseToken = firebaseToken;
        await user.save();
        res.status(200).send({ success: true });
        // return apiResponse(
        //   res,
        //   ResponseType.SUCCESS,
        //   StatusCode.OK,
        //   ResponseCode.SUCCESS,
        //   'Success message string.'
        // );
    }
    catch (error) {
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(error)} `);
    }
}
exports.default = firebaseToken;
