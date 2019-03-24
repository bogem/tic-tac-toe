import { RequestHandler } from "express";

import { GameEventName, GameId } from "../../../common/types/Game";
import { getUsernameWithToken } from "../models/Token";
import { updateGameGuestUsername, updateGameLastEvent } from "../models/Game";
import { opponentJoinEventEmitter } from "../eventEmitters/OpponentJoin";

export const GamesJoinPostHandler: RequestHandler = async (req, res) => {
    const token = req.session && req.session.token;
    if (!token) {
        res.sendStatus(404);
        return;
    }

    const { gameId } = req.params as { gameId: GameId };

    try {
        const username = await getUsernameWithToken(token);

        await Promise.all([
            updateGameGuestUsername(gameId, username),
            updateGameLastEvent(gameId, { name: GameEventName.OpponentJoin }),
        ]);
        opponentJoinEventEmitter.emitOpponentJoin(gameId);

        res.sendStatus(200);
    } catch (e) {}
};
