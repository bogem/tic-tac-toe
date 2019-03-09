import { RequestHandler } from "express";

import { generateAndSaveToken } from "../utils/Tokens";
import { doesUserExist } from "../db/Fns";
import { docClient } from "../db/Db";
import { UsersLoginPostResponseBody } from "common/types/api/users/login/post/ResponseBody";
import { UsersLoginPostRequestBody } from "common/types/api/users/login/post/RequestBody";

export const UsersLoginPostHandler: RequestHandler = async (req, res) => {
    const { username, password } = req.body as UsersLoginPostRequestBody;

    try {
        const userExists = await doesUserExist(username);
        if (!userExists) {
            res.status(400);
            res.send("USER_DOES_NOT_EXIST");
            return;
        }

        const passwordCorrect = await checkPasswordCorrectness(username, password);
        if (!passwordCorrect) {
            res.status(400);
            res.send("INVALID_PASSWORD");
            return;
        }

        if (req.session) {
            req.session.token = await generateAndSaveToken(username);
        }

        res.json({ username } as UsersLoginPostResponseBody);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

const checkPasswordCorrectness = (username: string, password: string): Promise<boolean> => {
    const params = {
        TableName: "Users",
        ProjectionExpression: "username, password",
        Key: { username },
    };

    return new Promise((resolve, reject) => {
        docClient.get(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(Boolean(data.Item && data.Item.password === password));
            }
        });
    });
};
