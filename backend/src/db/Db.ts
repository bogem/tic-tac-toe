import AWS from "aws-sdk";

const options = { endpoint: "http://localhost:8000", region: "eu-central-1" };

export const db = new AWS.DynamoDB(options);
export const docClient = new AWS.DynamoDB.DocumentClient(options);
