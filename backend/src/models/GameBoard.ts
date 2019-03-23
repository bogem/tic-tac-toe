import { GameBoard } from "../types/GameBoard";
import { put, update } from "../db/Fns";
import { docClient } from "../db/Db";

// GETs

export const getGameBoard = (gameId: string): Promise<GameBoard | undefined> =>
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

export const createAndPutInitialGameBoard = (gameId: string, size: number) => {
    const board: GameBoard = Array(size).fill(Array(size).fill("N"));

    return put({ TableName: "GameBoards", Item: { gameId, board } });
};

// UPDATEs

export const updateGameBoard = (gameId: string, gameBoard: GameBoard) =>
    update({
        TableName: "GameBoards",
        Key: { gameId },
        UpdateExpression: "set #b = :b",
        ExpressionAttributeNames: { "#b": "board" },
        ExpressionAttributeValues: { ":b": gameBoard },
    });
