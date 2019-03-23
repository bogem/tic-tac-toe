import { RequestHandler } from "express";

import { GamesBoardGetResponseBody } from "../../../common/types/api/games/board/get/ResponseBody";
import { getGameBoard } from "../models/GameBoard";

export const GamesBoardGetHandler: RequestHandler = async (req, res) => {
    const { gameId } = req.params as { gameId: string };

    try {
        const gameBoard = await getGameBoard(gameId);
        if (gameBoard) {
            res.send(gameBoard as GamesBoardGetResponseBody);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {}
};
