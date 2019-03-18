import { RequestHandler } from "express";
import uuid = require("uuid/v4");

import { GamesCreatePostRequestBody } from "common/types/api/games/create/post/RequestBody";
import { docClient } from "../db/Db";
import { getUsernameWithToken } from "../utils/Tokens";
import { Game } from "common/types/game";
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
        const creatorUsername = await getUsernameWithToken(token);
        await putGame({ id: gameId, creatorUsername, ...body });

        // Put game's history item.
        const gamesHistoriesItemId = uuid();
        await putGamesHistoriesItem({
            gameId,
            id: gamesHistoriesItemId,
            status: { type: "WAITING_FOR_OPPONENT_JOIN" },
        });

        // Add game's history item ID to game.
        await addGamesHistoriesItemToGame(gamesHistoriesItemId, gameId);

        res.sendStatus(200);
    } catch (e) {}
};

const putGame = (game: Game): Promise<void> => put({ TableName: "Games", Item: game });

const addGamesHistoriesItemToGame = (gamesHistoriesItemId: string, gameId: string): Promise<void> => {
    const params = {
        TableName: "Games",
        Key: { id: gameId },
        UpdateExpression: "set lastHistoryItemId=:id",
        ExpressionAttributeValues: {
            ":id": gamesHistoriesItemId,
        },
        ReturnValues: "NONE",
    };

    return new Promise((resolve, reject) => {
        docClient.update(params, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
