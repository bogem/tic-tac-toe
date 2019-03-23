import { GameBoardCoords } from "../../../GameBoard";

export interface GamesMakeMoveRequestBody {
    gameId: string;
    coords: GameBoardCoords;
}
