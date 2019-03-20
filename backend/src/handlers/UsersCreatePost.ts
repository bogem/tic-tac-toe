import { RequestHandler } from "express";

import { UsersCreatePostRequestBody } from "../../../common/types/api/users/create/post/RequestBody";
import {
    UsersCreatePostResponseBody,
    UsersCreatePostErrorMessages,
} from "../../../common/types/api/users/create/post/ResponseBody";
import { doesUserExist, put } from "../db/Fns";
import { generateAndSaveToken } from "../utils/Tokens";

export const UsersCreatePostHandler: RequestHandler = async (req, res) => {
    const body = req.body as UsersCreatePostRequestBody;
    const { username } = body;

    try {
        if (await doesUserExist(username)) {
            res.status(400);
            res.send(UsersCreatePostErrorMessages.AlreadyExistingUser);
            return;
        }

        await putUser(body);

        if (req.session) {
            req.session.token = await generateAndSaveToken(username);
        }

        res.json(body as UsersCreatePostResponseBody);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

const putUser = (user: UsersCreatePostRequestBody): Promise<void> => put({ TableName: "Users", Item: user });
