import { db } from "./Db";

["Users", "Tokens"].forEach(TableName => {
    db.deleteTable({ TableName }, err => {
        if (err) {
            console.error(`Unable to delete table ${TableName}. Error JSON: ${JSON.stringify(err, null, 2)}`);
        } else {
            console.log(`Table "${TableName}" succesfully deleted!`);
        }
    });
});
