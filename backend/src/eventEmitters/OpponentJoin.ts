import { EventEmitter } from "events";

const OPPONENT_JOIN_EVENT_NAME = "opponent_join";

class OpponentJoinEventEmitter extends EventEmitter {
    emitOpponentJoin = () => {
        this.emit(OPPONENT_JOIN_EVENT_NAME);
    };

    onOpponentJoin = (listener: () => void) => {
        this.on(OPPONENT_JOIN_EVENT_NAME, listener);
    };
}

export const opponentJoinEventEmitter = new OpponentJoinEventEmitter();
