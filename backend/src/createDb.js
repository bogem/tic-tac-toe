const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({ endpoint: "http://localhost:8000", region: "eu-central-1" });

const params = {
    TableName: "Users",
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" }, // Partition key
    ],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "N" }],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
    },
};

dynamodb.createTable(params, (err, data) => {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
