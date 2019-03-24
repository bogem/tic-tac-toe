import { RequestHandler } from "express";

import { GamesMakeMoveRequestBody } from "../../../common/types/api/games/make_move/RequestBody";
import { getGameBoard, updateGameBoard, isWin, isFieldFull } from "../models/GameBoard";
import { isUserInGame, updateGameLastEvent } from "../models/Game";
import { getUsernameWithToken } from "../models/Token";
import { gameMoveEventEmitter } from "../eventEmitters/GameMove";
import { GameId, GameEventName } from "../../../common/types/Game";
import { gameEndEventEmitter } from "../eventEmitters/GameEnd";

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
        if (cell !== null) {
            res.sendStatus(400);
            return;
        }

        gameBoard[coords.row][coords.column] = username;

        await updateGameBoard(gameId, gameBoard);

        const winData = isWin(gameBoard);
        if (winData) {
            await updateGameLastEvent(gameId, { name: GameEventName.GameEndWithWinner, meta: winData });
            gameEndEventEmitter.emitGameEnd(gameId);
        } else if (isFieldFull(gameBoard)) {
            // If there is no win and field is full, then there is a draw.
            await updateGameLastEvent(gameId, { name: GameEventName.GameEndWithDraw });
            gameEndEventEmitter.emitGameEnd(gameId);
        } else {
            await updateGameLastEvent(gameId, { name: GameEventName.GamerMove, meta: { username, coords } });
            gameMoveEventEmitter.emitGameMove(gameId);
        }

        res.sendStatus(200);
    } finally {
    }
};
