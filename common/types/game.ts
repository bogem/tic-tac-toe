import { GameBoardCoords } from "./GameBoard";

export interface Game {
    id: string;
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
          name: GameEventName.GameEnd;
          meta: {
              winner: string;
              winningCoords: GameBoardCoords[];
          };
      };

export enum GameEventName {
    GameCreation = "GameCreation",
    OpponentJoin = "OpponentJoin",
    GamerMove = "GamerMove",
    GameEnd = "GameEnd",
}
