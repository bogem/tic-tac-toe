import uuid = require("uuid/v4");

import { docClient } from "../db/Db";
import { put, onlyErrDocClientCallback } from "../db/Fns";

export const ERROR_NO_USERNAME_FOUND = new Error("No username found");

// DELETEs

export const deleteToken = (token: string): Promise<void> =>
    new Promise((resolve, reject) => {
        docClient.delete({ TableName: "Tokens", Key: { token } }, onlyErrDocClientCallback(resolve, reject));
    });

// GETs

export const getUsernameWithToken = (token: string): Promise<string> =>
    new Promise((resolve, reject) => {
        docClient.get(
            {
                TableName: "Tokens",
                ProjectionExpression: "username",
                Key: { token },
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    if (!data.Item) {
                        reject(ERROR_NO_USERNAME_FOUND);
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
    await put({ TableName: "Tokens", Item: { token, username } });
    return token;
};
