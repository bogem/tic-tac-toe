import { EventEmitter } from "events";

const NEW_GAME_EVENT_NAME = "new_game";

class NewGameEventEmitter extends EventEmitter {
    emitNewGame = () => {
        this.emit(NEW_GAME_EVENT_NAME);
    };

    onNewGame = (listener: () => void) => {
        this.on(NEW_GAME_EVENT_NAME, listener);
    };
}

export const newGameEventEmitter = new NewGameEventEmitter();
