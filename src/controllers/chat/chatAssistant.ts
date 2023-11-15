import { Request, Response } from "express";
import { Toolbox } from "../../utils";
import { ResponseCode, ResponseType, StatusCode } from "../../@types";
import Chat from "../../services/Chat";

const { apiResponse } = Toolbox;

async function ChatAssistant(req: Request, res: Response) {
    const { queryText } = req.body;
    if (!queryText) {
        throw new Error("Content is required");
    }
    try {
        const user = req.user;
        if (!user) {
            return apiResponse( 
                res,
                ResponseType.FAILURE,
                StatusCode.NOT_FOUND,
                ResponseCode.FAILURE,
                "User not found"
            );
        }

        const chatResponse = await Chat(queryText);

        return apiResponse(res, ResponseType.SUCCESS, StatusCode.OK, ResponseCode.SUCCESS, {
            chatResponse
        })
    }
    catch (e: any) {
        return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.INTERNAL_SERVER_ERROR,
            ResponseCode.FAILURE,
            {},
            `looks like something went wrong: ${JSON.stringify(e.message || e)} `
        );
    }
}


export default ChatAssistant;