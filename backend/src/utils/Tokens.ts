import uuid = require("uuid/v4");
import { docClient } from "../db/Db";

export const ERROR_NO_USERNAME_FOUND = new Error("No username found");

export const generateAndSaveToken = (username: string): Promise<string> => {
    const token = uuid();

    return putToken(token, username).then(() => {
        return token;
    });
};

const putToken = (token: string, username: string): Promise<void> => {
    const params = {
        TableName: "Tokens",
        Item: { token, username },
    };

    return new Promise((resolve, reject) => {
        docClient.put(params, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const getUsernameWithToken = (token: string): Promise<string> => {
    const params = {
        TableName: "Tokens",
        ProjectionExpression: "username",
        Key: { token },
    };

    return new Promise((resolve, reject) => {
        docClient.get(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (!data.Item) {
                    reject(ERROR_NO_USERNAME_FOUND);
                } else {
                    resolve(data.Item.username as string);
                }
            }
        });
    });
};
