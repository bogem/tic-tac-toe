export interface Game {
    id: string;
    name: string;
    hostUsername: string;
    size: number;
    statusType: GameStatusType;
    guestString?: string;
}

export enum GameStatusType {
    WaitingForGuestJoin = "WaitingForGuestJoin",
    WaitingForMove = "WaitingForMove",
    GamerMove = "GamerMove",
    GameEnd = "GameEnd",
}

export enum Gamer {
    Host = "Host",
    Guest = "Guest",
}

export type GameStatus =
    | {
          type: GameStatusType.WaitingForGuestJoin;
      }
    | {
          type: GameStatusType.WaitingForMove;
          meta: {
              gamer: Gamer;
          };
      }
    | {
          type: GameStatusType.GamerMove;
          meta: {
              gamer: Game;
              coords: BoardCoords;
          };
      }
    | {
          type: GameStatusType.GameEnd;
          meta: {
              winner: Gamer;
          };
      };

export interface BoardCoords {
    x: number;
    y: number;
}
