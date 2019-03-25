import AWS from "aws-sdk";
import { ClientConfiguration } from "aws-sdk/clients/dynamodb";

import { DynamoDbUrl } from "../../../common/Urls";
import { checkEnvVariable } from "../../../common/Env";

if (process.env.NODE_ENV) {
    checkEnvVariable("AWS_ACCESS_KEY_ID");
    checkEnvVariable("AWS_SECRET_ACCESS_KEY");
}

const options: ClientConfiguration = {
    endpoint: DynamoDbUrl,
    region: "eu-central-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

export const db = new AWS.DynamoDB(options);
export const docClient = new AWS.DynamoDB.DocumentClient(options);
