import { Server } from "socket.io";
import { Game, GameStatusType } from "../../../common/types/game";
import { docClient } from "../db/Db";

export const runGamesListSocketNamespace = (io: Server) => {
    const gamesListNamespace = io.of("/games/list");

    setInterval(() => {
        console.log(Object.keys(gamesListNamespace.connected).length);
        if (Object.keys(gamesListNamespace.connected).length > 0) {
            scanGamesWaitingForGuestJoin().then(games => {
                gamesListNamespace.emit("games_list", games);
            });
        }
    }, 1000);

    const scanGamesWaitingForGuestJoin = (): Promise<Game[]> => {
        const params = {
            TableName: "Games",
            FilterExpression: "statusType = :statusType",
            ExpressionAttributeValues: {
                ":statusType": GameStatusType.WaitingForGuestJoin,
            },
        };

        return new Promise((resolve, reject) => {
            docClient.scan(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve((data.Items || []) as Game[]);
                }
            });
        });
    };
};
