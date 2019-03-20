import { db } from "./Db";
import { tables } from "./Tables";

Object.values(tables).forEach(({ TableName }) => {
    db.deleteTable({ TableName }, err => {
        if (err) {
            console.error(`Unable to delete table ${TableName}. Error JSON: ${JSON.stringify(err, null, 2)}`);
        } else {
            console.log(`Table "${TableName}" succesfully deleted!`);
        }
    });
});
