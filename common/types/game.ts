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
              gamer: Gamer;
              coords: GameBoardCoords;
          };
      }
    | {
          name: GameEventName.GameEnd;
          meta: {
              winner: Gamer;
          };
      };

export enum GameEventName {
    GameCreation = "GameCreation",
    OpponentJoin = "OpponentJoin",
    GamerMove = "GamerMove",
    GameEnd = "GameEnd",
}

export enum Gamer {
    Host = "Host",
    Guest = "Guest",
}

export type GameBoard = GameBoardCellContent[][];

export type GameBoardCellContent = Gamer.Host | Gamer.Guest | "N"; // "N" means nothing

export interface GameBoardCoords {
    x: number;
    y: number;
}
