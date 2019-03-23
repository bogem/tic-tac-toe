import { RequestHandler } from "express";

import { GamesMakeMoveRequestBody } from "../../../common/types/api/games/make_move/RequestBody";
import { getGameBoard, updateGameBoard } from "../models/GameBoard";
import { isUserInGame } from "../models/Game";
import { getUsernameWithToken } from "../models/Token";
import { gameMoveEventEmitter } from "../eventEmitters/GameMove";

export const GamesMakeMovePostHandler: RequestHandler = async (req, res) => {
    const token = req.session && req.session.token;
    if (!token) {
        res.sendStatus(404);
        return;
    }

    const { gameId, coords } = req.body as GamesMakeMoveRequestBody;

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

        await updateGameBoard(gameId, gameBoard);
        gameMoveEventEmitter.emitGameMove({ gameId, username, gameBoard });
    } catch (error) {}
};
