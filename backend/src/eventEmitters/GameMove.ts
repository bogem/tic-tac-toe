import { EventEmitter } from "events";

import { GameId } from "../../../common/types/Game";

const GAME_MOVE_EVENT_NAME = "GameMove";

class GameMoveEventEmitter extends EventEmitter {
    emitGameMove = (gameId: GameId) => {
        this.emit(GAME_MOVE_EVENT_NAME, gameId);
    };

    onGameMove = (listener: (gameId: GameId) => void) => {
        this.on(GAME_MOVE_EVENT_NAME, listener);
    };
}

export const gameMoveEventEmitter = new GameMoveEventEmitter();
