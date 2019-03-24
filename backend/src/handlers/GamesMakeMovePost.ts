import { RequestHandler } from "express";

import { GamesMakeMoveRequestBody } from "../../../common/types/api/games/make_move/RequestBody";
import { getGameBoard, updateGameBoard } from "../models/GameBoard";
import { isUserInGame, updateGameLastEvent } from "../models/Game";
import { getUsernameWithToken } from "../models/Token";
import { gameMoveEventEmitter } from "../eventEmitters/GameMove";
import { GameId, GameEventName } from "../../../common/types/Game";

export const GamesMakeMovePostHandler: RequestHandler = async (req, res) => {
    const token = req.session && req.session.token;
    if (!token) {
        res.sendStatus(404);
        return;
    }

    const { gameId } = req.params as { gameId: GameId };
    const { coords } = req.body as GamesMakeMoveRequestBody;

    try {
        const username = await getUsernameWithToken(token);

        if (!(await isUserInGame(gameId, username))) {
            res.sendStatus(403);
            return;
        }

        const gameBoard = await getGameBoard(gameId);
        if (!gameBoard) {
            res.sendStatus(400);
            return;
        }

        const cell = gameBoard[coords.row] && gameBoard[coords.row][coords.column];
        if (!cell || cell !== "N") {
            res.sendStatus(400);
            return;
        }

        gameBoard[coords.row][coords.column] = username;

        await Promise.all([
            updateGameBoard(gameId, gameBoard),
            updateGameLastEvent(gameId, { name: GameEventName.GamerMove, meta: { username, coords } }),
        ]);
        gameMoveEventEmitter.emitGameMove({ gameId, username, gameBoard });

        res.sendStatus(200);
    } finally {
    }
};
