import { RequestHandler } from "express";
import uuid = require("uuid/v4");

import { GamesCreatePostRequestBody } from "../../../common/types/api/games/create/post/RequestBody";
import { getUsernameWithToken } from "../models/Token";
import { GameEventName } from "../../../common/types/Game";
import { GamesCreatePostResponseBody } from "../../../common/types/api/games/create/post/ResponseBody";
import { putGame } from "../models/Game";
import { createAndPutInitialGameBoard } from "../models/GameBoard";
import { newGameEventEmitter } from "../eventEmitters/NewGame";
import { handleError } from "../utils/Errors";

export const GamesCreatePostHandler: RequestHandler = async (req, res) => {
    const body = req.body as GamesCreatePostRequestBody;

    const token = req.session && req.session.token;
    if (!token) {
        res.sendStatus(404);
        return;
    }

    try {
        const gameId = uuid();
        const hostUsername = await getUsernameWithToken(token);

        const game = {
            lastEvent: {
                name: GameEventName.GameCreation as GameEventName.GameCreation,
            },
            hostUsername,
            id: gameId,
            ...body,
        };

        await Promise.all([putGame(game), createAndPutInitialGameBoard(gameId, body.size)]);

        newGameEventEmitter.emitNewGame();
        res.send(gameId as GamesCreatePostResponseBody);
    } catch (error) {
        handleError(error, res);
    }
};
