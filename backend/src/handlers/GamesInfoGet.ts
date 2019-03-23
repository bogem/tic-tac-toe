import { RequestHandler } from "express";

import { GamesInfoGetResponseBody } from "../../../common/types/api/games/info/get/ResponseBody";
import { getGame } from "../models/Game";

export const GamesInfoGetHandler: RequestHandler = async (req, res) => {
    const { gameId } = req.params as { gameId: string };

    try {
        const info = await getGame(gameId);
        if (info) {
            res.send(info as GamesInfoGetResponseBody);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {}
};
