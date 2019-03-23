import { EventEmitter } from "events";
import { GameBoard } from "../types/GameBoard";

const GAME_MOVE_EVENT_NAME = "game_move";

interface GameMoveInfo {
    gameId: string;
    username: string;
    gameBoard: GameBoard;
}

class GameMoveEventEmitter extends EventEmitter {
    emitGameMove = (gameMoveInfo: GameMoveInfo) => {
        this.emit(GAME_MOVE_EVENT_NAME, gameMoveInfo);
    };

    onGameMove = (listener: (gameMoveInfo: GameMoveInfo) => void) => {
        this.on(GAME_MOVE_EVENT_NAME, listener);
    };
}

export const gameMoveEventEmitter = new GameMoveEventEmitter();
