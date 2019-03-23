import { RequestHandler } from "express";

import { GameEventName } from "../../../common/types/Game";
import { getUsernameWithToken } from "../models/Token";
import { updateGameGuestUsername, updateGameLastEvent } from "../models/Game";

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
