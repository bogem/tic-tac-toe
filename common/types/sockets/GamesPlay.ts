import { GameBoardCoords, GameBoard } from "../GameBoard";
import { Game, GameId } from "../Game";

export enum GamePlayEventName {
    CurrentGameState = "CurrentGameState",
    GameMove = "GameMove",
    GameRoomConnect = "GameRoomConnect",
}

export interface CurrentGameStateEventData {
    game: Game;
    gameBoard: GameBoard;
}

export interface GameRoomConnectEventData {
    gameId: GameId;
    username: string;
}

export interface GameMoveEventData {
    gameId: GameId;
    username: string;
    coords: GameBoardCoords;
}
