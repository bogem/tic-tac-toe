import { RequestHandler } from "express";
import uuid = require("uuid/v4");

import { GamesCreatePostRequestBody } from "../../../common/types/api/games/create/post/RequestBody";
import { getUsernameWithToken } from "../utils/Tokens";
import { Game, GameStatusType } from "../../../common/types/game";
import { put, putGamesHistoriesItem } from "../db/Fns";

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
        const statusType = GameStatusType.WaitingForGuestJoin;
        await putGame({ statusType, hostUsername, id: gameId, ...body });

        // Put game's history item.
        await putGamesHistoriesItem({
            gameId,
            id: uuid(),
            status: { type: statusType },
        });

        res.sendStatus(200);
    } catch (e) {}
};

const putGame = (game: Game): Promise<void> => put({ TableName: "Games", Item: game });
