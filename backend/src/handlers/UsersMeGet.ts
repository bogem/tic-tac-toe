import { RequestHandler } from "express";

import { UsersMeGetResponseBody } from "../types/api/users/me/get/ResponseBody";
import { getUsernameWithToken } from "../models/Token";
import { handleError } from "../utils/Errors";

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
        handleError(error, res);
    }
};
