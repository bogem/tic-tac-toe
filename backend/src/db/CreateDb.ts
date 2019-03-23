import { db } from "./Db";
import { tables } from "./Tables";

tables.forEach(table => {
    db.createTable(
        {
            ...table,
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        },
        err => {
            if (err) {
                console.error(`Unable to create table "${table.TableName}": ${JSON.stringify(err)}`);
            } else {
                console.log(`Table "${table.TableName}" succesfully created!`);
            }
        }
    );
});
