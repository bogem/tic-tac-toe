import { RequestHandler } from "express";
import uuid = require("uuid/v4");

import { GamesCreatePostRequestBody } from "common/types/api/games/create/post/RequestBody";
import { docClient } from "../db/Db";
import { getUsernameWithToken } from "../utils/Tokens";
import { Game } from "common/types/game";

export const GamesCreatePostHandler: RequestHandler = async (req, res) => {
    const body = req.body as GamesCreatePostRequestBody;

    const token = req.session && req.session.token;
    if (!token) {
        res.sendStatus(404);
        return;
    }

    try {
        const id = uuid();
        const creatorUsername = await getUsernameWithToken(token);
        await putGame({ id, creatorUsername, ...body });

        res.sendStatus(200);
    } catch (e) {}
};

const putGame = (game: Game): Promise<void> => {
    const params = { TableName: "Games", Item: game };

    return new Promise((resolve, reject) => {
        docClient.put(params, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
