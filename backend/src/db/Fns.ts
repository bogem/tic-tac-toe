import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { docClient } from "./Db";
import { GameStatus } from "common/types/game";

export const put = (params: DocumentClient.PutItemInput): Promise<void> =>
    new Promise((resolve, reject) => {
        docClient.put(params, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

export const doesUserExist = (username: string): Promise<boolean> => {
    const params = {
        TableName: "Users",
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {
            "#username": "username",
        },
        ExpressionAttributeValues: {
            ":username": username,
        },
    };

    return new Promise((resolve, reject) => {
        docClient.scan(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Count! > 0);
            }
        });
    });
};

interface GamesHistoriesItem {
    id: string;
    gameId: string;
    status: GameStatus;
}

export const putGamesHistoriesItem = (item: GamesHistoriesItem) => put({ TableName: "GamesHistories", Item: item });
