import { RequestHandler } from "express";

import { GamesInfoGetResponseBody } from "../../../common/types/api/games/info/get/ResponseBody";
import { getGame } from "../models/Game";
import { GameId } from "../../../common/types/Game";

export const GamesInfoGetHandler: RequestHandler = async (req, res) => {
    const { gameId } = req.params as { gameId: GameId };

    try {
        const info = await getGame(gameId);
        if (info) {
            res.send(info as GamesInfoGetResponseBody);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {}
};
