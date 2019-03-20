export const tables = [
    {
        TableName: "Users",
        KeySchema: [{ AttributeName: "username", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "username", AttributeType: "S" }],
    },
    {
        TableName: "Tokens",
        KeySchema: [{ AttributeName: "token", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "token", AttributeType: "S" }],
    },
    {
        TableName: "Games",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    },
    {
        TableName: "GamesHistories",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    },
];
