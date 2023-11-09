"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = exports.ResponseType = exports.ResponseCode = exports.applicationXmlType = exports.applicationJsonType = void 0;
__exportStar(require("./user"), exports);
exports.applicationJsonType = 'application/json';
exports.applicationXmlType = 'application/xml';
var ResponseCode;
(function (ResponseCode) {
    ResponseCode["SUCCESS"] = "00";
    ResponseCode["FAILURE"] = "01";
    ResponseCode["VALIDATION_ERROR"] = "02";
})(ResponseCode || (exports.ResponseCode = ResponseCode = {}));
var ResponseType;
(function (ResponseType) {
    ResponseType[ResponseType["SUCCESS"] = 1] = "SUCCESS";
    ResponseType[ResponseType["FAILURE"] = 0] = "FAILURE";
})(ResponseType || (exports.ResponseType = ResponseType = {}));
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCode[StatusCode["FORBIDEN"] = 403] = "FORBIDEN";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["ALREADY_EXISTS"] = 409] = "ALREADY_EXISTS";
    StatusCode[StatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
