import { AWSError } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { docClient } from "./Db";

export const onlyErrDocClientCallback = (resolve: () => void, reject: (reason: any) => void) => (err: AWSError) => {
    if (err) {
        reject(err);
    } else {
        resolve();
    }
};

export const put = (params: DocumentClient.PutItemInput): Promise<void> =>
    new Promise((resolve, reject) => {
        docClient.put(params, onlyErrDocClientCallback(resolve, reject));
    });

export const update = (params: DocumentClient.UpdateItemInput): Promise<void> =>
    new Promise((resolve, reject) => {
        docClient.update(params, onlyErrDocClientCallback(resolve, reject));
    });
