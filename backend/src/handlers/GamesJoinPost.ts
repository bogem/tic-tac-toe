import { RequestHandler } from "express";
import queryString from "query-string";
import uuid = require("uuid");

import { putGamesHistoriesItem, updateGameStatusType } from "../db/Fns";
import { GameStatusType, Gamer } from "../../../common/types/game";
import { getUsernameWithToken } from "../utils/Tokens";
import { docClient } from "../db/Db";

export const GamesJoinPostHandler: RequestHandler = async (req, res) => {
    const token = req.session && req.session.token;
    if (!token) {
        res.sendStatus(404);
        return;
    }

    const { gameId } = queryString.parse(req.originalUrl) as { gameId: string };
    const statusType = GameStatusType.WaitingForMove;

    try {
        const username = await getUsernameWithToken(token);

        await putGamesHistoriesItem({
            gameId,
            id: uuid(),
            status: {
                type: statusType,
                meta: { gamer: Gamer.Host },
            },
        });

        await updateGameGuestUsername(gameId, username);
        await updateGameStatusType(gameId, statusType);
    } catch (e) {}
};

const updateGameGuestUsername = (gameId: string, guestUsername: string) => {
    const params = {
        TableName: "Games",
        Key: {
            id: gameId,
        },
        UpdateExpression: "set guestUsername = :o",
        ExpressionAttributeValues: {
            ":o": guestUsername,
        },
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
