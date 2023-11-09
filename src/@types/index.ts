export * from "./user";

export const applicationJsonType = 'application/json';

export const applicationXmlType = 'application/xml';

export enum ResponseCode {
    SUCCESS = '00',
    FAILURE = '01',
    VALIDATION_ERROR = '02',
}

export enum ResponseType {
    SUCCESS = 1,
    FAILURE = 0,
}

export enum StatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDEN = 403,
    NOT_FOUND = 404,
    ALREADY_EXISTS = 409,
    INTERNAL_SERVER_ERROR = 500,
}

export type APIResponseType<T = any> = {
    status: string | number;
    responseCode: string;
    apiResponseCode?: string;
    responseMessage: string;
    details: T;
    message?: string;
};

export type HashedTokenType = { clientId: string; clientSecret: string };