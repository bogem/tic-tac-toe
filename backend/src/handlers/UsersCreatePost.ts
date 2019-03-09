import { RequestHandler } from "express";

import { UsersCreatePostRequestBody } from "common/types/api/users/create/post/RequestBody";
import { UsersCreatePostResponseBody } from "common/types/api/users/create/post/ResponseBody";
import { docClient } from "../db/Db";
import { generateAndSaveToken } from "../utils/Tokens";
import { doesUserExist } from "../db/Fns";

export const UsersCreatePostHandler: RequestHandler = async (req, res) => {
    const { username, password } = req.body as UsersCreatePostRequestBody;

    try {
        if (await doesUserExist(username)) {
            res.status(400);
            res.send("USER_EXISTS_ALREADY");
            return;
        }

        await putUser(username, password);

        if (req.session) {
            req.session.token = await generateAndSaveToken(username);
        }

        res.json({ username, password } as UsersCreatePostResponseBody);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
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
