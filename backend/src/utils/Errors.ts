import { Response } from "express";

import { ERROR_GAME_IS_NOT_FOUND } from "../models/Game";
import { ERROR_NO_USERNAME_FOUND } from "../models/Token";

export const handleError = (error: any, res: Response) => {
    if (error === ERROR_GAME_IS_NOT_FOUND || error === ERROR_NO_USERNAME_FOUND) {
        res.status(404);
        res.send(error);
    } else if (error) {
        console.error(error);

        res.status(500);
        res.send(error);
    }
};
