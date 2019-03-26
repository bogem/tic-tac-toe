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
              winCoords: GameBoardCoords[];
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

export const gameStatus = (game: Game, username: string) => {
    switch (game.lastEvent.name) {
        case GameEventName.GameCreation:
            return "Warte auf Gast ⌛️";

        case GameEventName.OpponentJoin:
            return game.hostUsername === username
                ? "Dein Zug 👊"
                : `${opponentUsername(game, username)}'s Zug ⌛️`;

        case GameEventName.GamerMove:
            return game.lastEvent.meta.username === username
                ? `${opponentUsername(game, username)}'s Zug ⌛️`
                : "Dein Zug 👊";

        case GameEventName.GameEndWithWinner:
            return game.lastEvent.meta.winnerUsername === username
                ? "Du hast gewonnen 🎉"
                : "Du hast verloren 👎";

        case GameEventName.GameEndWithDraw:
            return "Das Remis 🤷‍♂️";
    }
};

export const opponentUsername = (game: Game, username: string) =>
    game.hostUsername === username ? game.guestUsername : game.hostUsername;
