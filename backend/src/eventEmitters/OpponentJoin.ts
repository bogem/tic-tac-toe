import { EventEmitter } from "events";

import { GameId } from "../../../common/types/Game";

const OPPONENT_JOIN_EVENT_NAME = "OpponentJoin";

class OpponentJoinEventEmitter extends EventEmitter {
    emitOpponentJoin = (gameId: GameId) => {
        this.emit(OPPONENT_JOIN_EVENT_NAME, gameId);
    };

    onOpponentJoin = (listener: (gameId: GameId) => void) => {
        this.on(OPPONENT_JOIN_EVENT_NAME, listener);
    };
}

export const opponentJoinEventEmitter = new OpponentJoinEventEmitter();
