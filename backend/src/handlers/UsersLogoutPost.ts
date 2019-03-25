import { RequestHandler } from "express";

import { deleteToken } from "../models/Token";
import { handleError } from "../utils/Errors";

export const UsersLogoutPostHandler: RequestHandler = async (req, res) => {
    const token = req.session && req.session.token;
    if (!token) {
        res.sendStatus(404);
        return;
    }

    try {
        req.session!.token = null;

        await deleteToken(token);

        res.sendStatus(200);
    } catch (error) {
        handleError(error, res);
    }
};
