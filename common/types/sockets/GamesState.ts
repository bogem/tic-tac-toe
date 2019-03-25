import { GameBoard } from "../GameBoard";
import { Game, GameId } from "../Game";

export enum GameStateEventName {
    CurrentGameState = "CurrentGameState",
    SubscribeToGameStateChanges = "SubscribeToGameStateChanges",
}

export interface CurrentGameStateEventData {
    game: Game;
    gameBoard: GameBoard;
}

export interface SubscribeToGameChangesEventData {
    gameId: GameId;
    username: string;
}
