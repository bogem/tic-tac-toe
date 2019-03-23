import { GameBoardCoords } from "../GameBoard";

export interface GameJoinEventData {
    username: string;
    gameId: string;
}

export interface GameMoveEventData {
    username: string;
    coords: GameBoardCoords;
}
