import { uniq, range } from "lodash";

import { GameBoard, GameBoardCoords } from "../../../common/types/GameBoard";
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

export const isWin = (gameBoard: GameBoard): { winnerUsername: string; winCoords: GameBoardCoords[] } | undefined => {
    if (gameBoard.length === 0) {
        return undefined;
    }

    const rowsCount = gameBoard.length;
    const columnsCount = gameBoard[0].length;

    // 1. Check rows.
    const foundRowIndex = findRowIndexWithSameString(gameBoard);

    if (foundRowIndex > -1) {
        console.log(foundRowIndex, gameBoard);
        const foundRow = gameBoard[foundRowIndex];
        return {
            winnerUsername: foundRow[0]!,
            winCoords: range(foundRow.length).map(columnIndex => ({ row: foundRowIndex, column: columnIndex })),
        };
    }

    // 2. Check columns.
    const columns = range(columnsCount).map(columnIndex =>
        range(rowsCount).map(rowIndex => gameBoard[rowIndex][columnIndex])
    );

    const foundColumnIndex = findRowIndexWithSameString(columns);

    if (foundColumnIndex > -1) {
        const foundColumn = columns[foundColumnIndex];
        return {
            winnerUsername: foundColumn[0]!,
            winCoords: range(foundColumn.length).map(rowIndex => ({ row: rowIndex, column: foundColumnIndex })),
        };
    }

    // 3. Check diagonals, if game board is square.
    const isGameBoardSquare = gameBoard.length === gameBoard[0].length;
    if (!isGameBoardSquare) {
        return undefined;
    }

    // 3.1 Check "dexter" diagonal: https://en.wikipedia.org/wiki/Bend_(heraldry).
    const dexterDiagonal = range(gameBoard.length).map(index => gameBoard[index][index]);
    if (hasRowSameString(dexterDiagonal)) {
        return {
            winnerUsername: dexterDiagonal[0]!,
            winCoords: range(dexterDiagonal.length).map(index => ({ row: index, column: index })),
        };
    }

    // 3.2 Check "sinister" diagonal.
    const sinisterDiagonal = range(gameBoard.length).map(index => gameBoard[index][columnsCount - index - 1]);
    if (hasRowSameString(sinisterDiagonal)) {
        return {
            winnerUsername: sinisterDiagonal[0]!,
            winCoords: range(sinisterDiagonal.length).map(index => ({
                row: index,
                column: columnsCount - index - 1,
            })),
        };
    }

    return undefined;
};

const findRowIndexWithSameString = (table: any[][]) => table.findIndex(hasRowSameString);
const hasRowSameString = (row: any[]) => {
    const uniqRow = uniq(row);
    return uniqRow.length === 1 && typeof uniqRow[0] === "string";
};

// isFieldFill shows, if all cells are occupied, i.e. every cell is not null.
export const isFieldFull = (gameBoard: GameBoard) => gameBoard.every(row => row.every(cell => cell !== null));

// PUTs

export const createAndPutInitialGameBoard = (gameId: GameId, size: number) => {
    const board: GameBoard = Array(size).fill(Array(size).fill(null));

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
