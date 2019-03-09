import { RequestHandler } from "express";

import { UserEnvironmentGetResponseBody } from "common/types/api/user/environment/get/ResponseBody";
import { getUsernameWithToken, ERROR_NO_USERNAME_FOUND } from "../utils/Tokens";

export const UserEnvironmentHandler: RequestHandler = async (req, res) => {
    const token = req.session && req.session.token;
    if (!token) {
        res.sendStatus(404);
        return;
    }

    try {
        const username = await getUsernameWithToken(token);

        res.json({ username } as UserEnvironmentGetResponseBody);
    } catch (e) {
        if (e === ERROR_NO_USERNAME_FOUND) {
            res.sendStatus(404);
        } else {
            res.sendStatus(500);
        }
    }
};
