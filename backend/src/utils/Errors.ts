import { Response } from "express";

import { ERROR_GAME_NOT_FOUND } from "../models/Game";
import { ERROR_USERNAME_NOT_FOUND } from "../models/Token";
import { ERROR_GAME_BOARD_NOT_FOUND } from "../models/GameBoard";

export const handleError = (error: any, res: Response) => {
    if (error === ERROR_GAME_NOT_FOUND || error === ERROR_USERNAME_NOT_FOUND || error === ERROR_GAME_BOARD_NOT_FOUND) {
        res.status(404);
    } else if (error) {
        console.error(error);
        res.status(500);
    }

    if (error) {
        res.send(error);
    }
};
