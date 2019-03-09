import { docClient } from "../db/Db";

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
