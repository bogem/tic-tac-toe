export enum TableName {
    Users = "Users",
    Tokens = "Tokens",
    Games = "Games",
    GameBoards = "GameBoards",
}

export const tables = [
    {
        TableName: TableName.Users,
        KeySchema: [{ AttributeName: "username", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "username", AttributeType: "S" }],
    },
    {
        TableName: TableName.Tokens,
        KeySchema: [{ AttributeName: "token", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "token", AttributeType: "S" }],
    },
    {
        TableName: TableName.Games,
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    },
    {
        TableName: TableName.GameBoards,
        KeySchema: [{ AttributeName: "gameId", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "gameId", AttributeType: "S" }],
    },
];
