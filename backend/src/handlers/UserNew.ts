import { RequestHandler } from "express";

import { UserNewPostRequestBody } from "common/types/api/user/new/post/RequestBody";
import { UserNewPostResponseBody } from "common/types/api/user/new/post/ResponseBody";
import { docClient } from "../db/Db";

export const UserNewHander: RequestHandler = async (req, res) => {
    const { username, password } = req.body as UserNewPostRequestBody;

    try {
        if (await doesUserAlreadyExist(username)) {
            res.status(400);
            res.send("USER_EXISTS_ALREADY");
            return;
        }

        await putUser(username, password);

        if (req.session) {
            req.session;
        }

        res.json({ username, password } as UserNewPostResponseBody);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

const doesUserAlreadyExist = (username: string): Promise<boolean> => {
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

const putUser = (username: string, password: string): Promise<void> => {
    const params = {
        TableName: "Users",
        Item: { username, password },
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
