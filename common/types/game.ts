import { GameBoardCoords } from "./GameBoard";

export type GameId = string;

export interface Game {
    id: GameId;
    name: string;
    hostUsername: string;
    size: number;
    lastEvent: GameEvent;
    guestUsername?: string;
}

export type GameEvent =
    | { name: GameEventName.GameCreation }
    | { name: GameEventName.OpponentJoin }
    | {
          name: GameEventName.GamerMove;
          meta: {
              username: string;
              coords: GameBoardCoords;
          };
      }
    | {
          name: GameEventName.GameEndWithWinner;
          meta: {
              winnerUsername: string;
              winningCoords: GameBoardCoords[];
          };
      }
    | { name: GameEventName.GameEndWithDraw };

export enum GameEventName {
    GameCreation = "GameCreation",
    OpponentJoin = "OpponentJoin",
    GamerMove = "GamerMove",
    GameEndWithWinner = "GameEndWithWinner",
    GameEndWithDraw = "GameEndWithDraw",
}
