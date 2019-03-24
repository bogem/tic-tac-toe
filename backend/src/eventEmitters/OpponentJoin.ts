import { EventEmitter } from "events";
import { GameId } from "../../../common/types/Game";

const OPPONENT_JOIN_EVENT_NAME = "opponent_join";

interface OpponentJoinData {
    gameId: GameId;
    username: string;
}

class OpponentJoinEventEmitter extends EventEmitter {
    emitOpponentJoin = (data: OpponentJoinData) => {
        this.emit(OPPONENT_JOIN_EVENT_NAME, data);
    };

    onOpponentJoin = (listener: (data: OpponentJoinData) => void) => {
        this.on(OPPONENT_JOIN_EVENT_NAME, listener);
    };
}

export const opponentJoinEventEmitter = new OpponentJoinEventEmitter();
