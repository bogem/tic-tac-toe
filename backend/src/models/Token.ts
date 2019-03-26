import uuid = require("uuid/v4");

import { docClient } from "../db/Db";
import { put, onlyErrDocClientCallback } from "../db/Fns";
import { TableName } from "../db/Tables";

export const ERROR_USERNAME_NOT_FOUND = new Error("Username not found");

// DELETEs

export const deleteToken = (token: string): Promise<void> =>
    new Promise((resolve, reject) => {
        docClient.delete(
            { TableName: TableName.Tokens, Key: { token } },
            onlyErrDocClientCallback(resolve, reject)
        );
    });

// GETs

export const getUsernameWithToken = (token: string): Promise<string> =>
    new Promise((resolve, reject) => {
        docClient.get(
            {
                TableName: TableName.Tokens,
                ProjectionExpression: "username",
                Key: { token },
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    if (!data.Item) {
                        reject(ERROR_USERNAME_NOT_FOUND);
                    } else {
                        resolve(data.Item.username as string);
                    }
                }
            }
        );
    });

// PUTs

export const generateAndSaveToken = async (username: string): Promise<string> => {
    const token = uuid();
    await put({ TableName: TableName.Tokens, Item: { token, username } });
    return token;
};
