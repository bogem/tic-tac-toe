import { RequestHandler } from "express";

import { handleError } from "../utils/Errors";
import { getUsernameWithToken } from "../models/Token";
import { getUsersGames } from "../models/Game";

export const GamesOfMeGetHandler: RequestHandler = async (req, res) => {
    const token = req.session && req.session.token;
    if (!token) {
        res.sendStatus(404);
        return;
    }

    try {
        const username = await getUsernameWithToken(token);
        const usersGames = await getUsersGames(username);
        res.send(usersGames);
    } catch (error) {
        handleError(error, res);
    }
};
