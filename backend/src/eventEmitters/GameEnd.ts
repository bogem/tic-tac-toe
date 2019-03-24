import { EventEmitter } from "events";

import { GameId } from "../../../common/types/Game";

const GAME_END_EVENT_NAME = "GameEnd";

class GameEndEventEmitter extends EventEmitter {
    emitGameEnd = (gameId: GameId) => {
        this.emit(GAME_END_EVENT_NAME, gameId);
    };

    onGameEnd = (listener: (gameId: GameId) => void) => {
        this.on(GAME_END_EVENT_NAME, listener);
    };
}

export const gameEndEventEmitter = new GameEndEventEmitter();
