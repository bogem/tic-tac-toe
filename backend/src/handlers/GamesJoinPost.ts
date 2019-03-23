import { RequestHandler } from "express";

import { updateGameLastEvent } from "../db/Fns";
import { GameEventName } from "../../../common/types/game";
import { getUsernameWithToken } from "../utils/Tokens";
import { docClient } from "../db/Db";

export const GamesJoinPostHandler: RequestHandler = async (req, res) => {
    const token = req.session && req.session.token;
    if (!token) {
        res.sendStatus(404);
        return;
    }

    const { gameId } = req.params as { gameId: string };

    try {
        const username = await getUsernameWithToken(token);

        // await putGamesHistoriesItem({
        //     gameId,
        //     id: uuid(),
        //     status: {
        //         type: statusType,
        //         meta: { gamer: Gamer.Host },
        //     },
        // });

        await updateGameGuestUsername(gameId, username);
        await updateGameLastEvent(gameId, { name: GameEventName.OpponentJoin });

        res.sendStatus(200);
    } catch (e) {}
};

const updateGameGuestUsername = (gameId: string, guestUsername: string) => {
    const params = {
        TableName: "Games",
        Key: {
            id: gameId,
        },
        UpdateExpression: "set #gu = :gu",
        ExpressionAttributeNames: {
            "#gu": "guestUsername",
        },
        ExpressionAttributeValues: {
            ":gu": guestUsername,
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
