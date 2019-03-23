import { UsersCreatePostRequestBody } from "../types/api/users/create/post/RequestBody";
import { put } from "../db/Fns";
import { docClient } from "../db/Db";

// GETs

export const checkPasswordCorrectness = (username: string, password: string): Promise<boolean> =>
    new Promise((resolve, reject) => {
        docClient.get(
            {
                TableName: "Users",
                ProjectionExpression: "username, password",
                Key: { username },
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Boolean(data.Item && data.Item.password === password));
                }
            }
        );
    });

export const doesUserExist = (username: string): Promise<boolean> =>
    new Promise((resolve, reject) => {
        docClient.scan(
            {
                TableName: "Users",
                FilterExpression: "#u = :u",
                ExpressionAttributeNames: { "#u": "username" },
                ExpressionAttributeValues: { ":u": username },
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Count! > 0);
                }
            }
        );
    });

// PUTs

export const putUser = (user: UsersCreatePostRequestBody) => put({ TableName: "Users", Item: user });
