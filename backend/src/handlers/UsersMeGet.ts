import { RequestHandler } from "express";

import { UsersMeGetResponseBody } from "../types/api/users/me/get/ResponseBody";
import { getUsernameWithToken, ERROR_NO_USERNAME_FOUND } from "../models/Token";

export const UsersMeGetHandler: RequestHandler = async (req, res) => {
    const token = req.session && req.session.token;
    if (!token) {
        res.sendStatus(404);
        return;
    }

    try {
        const username = await getUsernameWithToken(token);

        res.json({ username } as UsersMeGetResponseBody);
    } catch (error) {
        if (error === ERROR_NO_USERNAME_FOUND) {
            res.sendStatus(404);
        } else {
            res.sendStatus(500);
        }
    }
};
