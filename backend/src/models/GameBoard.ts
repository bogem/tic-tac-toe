import { GameBoard } from "../../../common/types/GameBoard";
import { GameId } from "../../../common/types/Game";
import { docClient } from "../db/Db";
import { put, update } from "../db/Fns";

// GETs

export const getGameBoard = (gameId: GameId): Promise<GameBoard | undefined> =>
    new Promise((resolve, reject) => {
        docClient.get(
            {
                TableName: "GameBoards",
                Key: { gameId },
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    if (data.Item) {
                        resolve(data.Item.board as GameBoard);
                    } else {
                        resolve(undefined);
                    }
                }
            }
        );
    });

// PUTs

export const createAndPutInitialGameBoard = (gameId: GameId, size: number) => {
    const board: GameBoard = Array(size).fill(Array(size).fill("N"));

    return put({ TableName: "GameBoards", Item: { gameId, board } });
};

// UPDATEs

export const updateGameBoard = (gameId: GameId, gameBoard: GameBoard) =>
    update({
        TableName: "GameBoards",
        Key: { gameId },
        UpdateExpression: "set #b = :b",
        ExpressionAttributeNames: { "#b": "board" },
        ExpressionAttributeValues: { ":b": gameBoard },
    });
