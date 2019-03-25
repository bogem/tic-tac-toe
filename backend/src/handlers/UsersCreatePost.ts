import { RequestHandler } from "express";

import { UsersCreatePostRequestBody } from "../../../common/types/api/users/create/post/RequestBody";
import {
    UsersCreatePostResponseBody,
    UsersCreatePostErrorMessage,
} from "../../../common/types/api/users/create/post/ResponseBody";
import { generateAndSaveToken } from "../models/Token";
import { putUser, doesUserExist } from "../models/User";
import { handleError } from "../utils/Errors";

export const UsersCreatePostHandler: RequestHandler = async (req, res) => {
    const body = req.body as UsersCreatePostRequestBody;
    const { username } = body;

    try {
        if (await doesUserExist(username)) {
            res.status(400);
            res.send(UsersCreatePostErrorMessage.AlreadyExistingUser);
            return;
        }

        await putUser(body);

        if (req.session) {
            req.session.token = await generateAndSaveToken(username);
        }

        res.json(body as UsersCreatePostResponseBody);
    } catch (error) {
        handleError(error, res);
    }
};
