import { AWSError } from "aws-sdk";
import { KeySchema, AttributeDefinitions } from "aws-sdk/clients/dynamodb";

import { db } from "./Db";

const createTable = (params: {
    TableName: string;
    KeySchema: KeySchema;
    AttributeDefinitions: AttributeDefinitions;
}) => {
    db.createTable(
        {
            ...params,
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        },
        (err: AWSError) => {
            if (err) {
                console.error(`Unable to create table "${params.TableName}": ${JSON.stringify(err)}`);
            } else {
                console.log(`Table "${params.TableName}" succesfully created!`);
            }
        }
    );
};

createTable({
    TableName: "Users",
    KeySchema: [{ AttributeName: "username", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "username", AttributeType: "S" }],
});

createTable({
    TableName: "Tokens",
    KeySchema: [{ AttributeName: "token", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "token", AttributeType: "S" }],
});

createTable({
    TableName: "Games",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
});

createTable({
    TableName: "GamesHistories",
    KeySchema: [],
    AttributeDefinitions: [],
});
