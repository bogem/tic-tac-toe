export interface Game {
    id: string;
    name: string;
    creatorUsername: string;
    size: number;
}

export type GameStatus =
    | {
          type: "WAITING_FOR_OPPONENT_JOIN";
      }
    | {
          type: "WAITING_FOR_MOVE";
          meta: {
              gamerUsername: string;
          };
      }
    | {
          type: "GAMER_MOVE";
          meta: {
              gamerUsername: string;
              coords: BoardCoords;
          };
      }
    | {
          type: "GAME_END";
          meta: {
              winnerUsername: string;
          };
      };

export interface BoardCoords {
    x: number;
    y: number;
}
