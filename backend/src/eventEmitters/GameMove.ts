import { EventEmitter } from "events";

import { GameBoard } from "../../../common/types/GameBoard";
import { GameId } from "../../../common/types/Game";

const GAME_MOVE_EVENT_NAME = "game_move";

interface GameMoveData {
    gameId: GameId;
    username: string;
    gameBoard: GameBoard;
}

class GameMoveEventEmitter extends EventEmitter {
    emitGameMove = (data: GameMoveData) => {
        this.emit(GAME_MOVE_EVENT_NAME, data);
    };

    onGameMove = (listener: (data: GameMoveData) => void) => {
        this.on(GAME_MOVE_EVENT_NAME, listener);
    };
}

export const gameMoveEventEmitter = new GameMoveEventEmitter();
