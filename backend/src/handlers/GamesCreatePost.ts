import { RequestHandler } from "express";
import uuid = require("uuid/v4");

import { GamesCreatePostRequestBody } from "../../../common/types/api/games/create/post/RequestBody";
import { getUsernameWithToken } from "../models/Token";
import { GameEventName } from "../types/Game";
import { GamesCreatePostResponseBody } from "../../../common/types/api/games/create/post/ResponseBody";
import { putGame } from "../models/Game";
import { createAndPutInitialGameBoard } from "../models/GameBoard";

export const GamesCreatePostHandler: RequestHandler = async (req, res) => {
    const body = req.body as GamesCreatePostRequestBody;

    const token = req.session && req.session.token;
    if (!token) {
        res.sendStatus(404);
        return;
    }

    try {
        // Put game.
        const gameId = uuid();
        const hostUsername = await getUsernameWithToken(token);
        // TODO: after TS 3.4 release use "as const".
        const event = { name: GameEventName.GameCreation as GameEventName.GameCreation };
        const game = { lastEvent: event, hostUsername, id: gameId, ...body };
        await putGame(game);

        // Put game's history item.
        // await putGamesHistoriesItem({
        //     gameId,
        //     id: uuid(),
        //     status: { type: statusType },
        // });

        // Create game's board.
        await createAndPutInitialGameBoard(gameId, body.size);

        res.send(game as GamesCreatePostResponseBody);
    } catch (e) {}
};
