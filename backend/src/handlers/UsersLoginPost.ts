import { RequestHandler } from "express";

import { generateAndSaveToken } from "../models/Token";
import {
    UsersLoginPostResponseBody,
    UsersLoginPostErrorMessage,
} from "../../../common/types/api/users/login/post/ResponseBody";
import { UsersLoginPostRequestBody } from "../../../common/types/api/users/login/post/RequestBody";
import { checkPasswordCorrectness, doesUserExist } from "../models/User";
import { handleError } from "../utils/Errors";

export const UsersLoginPostHandler: RequestHandler = async (req, res) => {
    const { username, password } = req.body as UsersLoginPostRequestBody;

    try {
        const userExists = await doesUserExist(username);
        if (!userExists) {
            res.status(404);
            res.send(UsersLoginPostErrorMessage.NonexistentUser);
            return;
        }

        const passwordCorrect = await checkPasswordCorrectness(username, password);
        if (!passwordCorrect) {
            res.status(400);
            res.send(UsersLoginPostErrorMessage.IncorrectPassword);
            return;
        }

        if (req.session) {
            req.session.token = await generateAndSaveToken(username);
        }

        res.json({ username } as UsersLoginPostResponseBody);
    } catch (error) {
        handleError(error, res);
    }
};
