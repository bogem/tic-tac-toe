import { RequestHandler } from "express";

import { GamesGetResponseBody } from "../types/api/games/get/ResponseBody";
import { getGame } from "../models/Game";
import { GameId } from "../types/Game";

export const GamesGetHandler: RequestHandler = async (req, res) => {
    const { gameId } = req.params as { gameId: GameId };

    try {
        const game = await getGame(gameId);
        if (game) {
            res.send(game as GamesGetResponseBody);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {}
};
