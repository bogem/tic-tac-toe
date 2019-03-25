import { RequestHandler } from "express";

import { GamesGetResponseBody } from "../../../common/types/api/games/get/ResponseBody";
import { getGame } from "../models/Game";
import { GameId } from "../../../common/types/Game";
import { handleError } from "../utils/Errors";

export const GamesGetHandler: RequestHandler = async (req, res) => {
    const { gameId } = req.params as { gameId: GameId };

    try {
        const game = await getGame(gameId);
        res.json(game as GamesGetResponseBody);
    } catch (error) {
        handleError(error, res);
    }
};
