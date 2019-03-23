import { Server } from "socket.io";
import { Game, GameEventName } from "../../../common/types/game";
import { GamesListEventName, GamesListEventMessageData } from "../../../common/types/sockets/GamesList";
import { docClient } from "../db/Db";

export const runGamesListSocketNamespace = (io: Server) => {
    const gamesListNamespace = io.of("/games/list");

    setInterval(() => {
        if (Object.keys(gamesListNamespace.connected).length > 0) {
            scanJustCreatedGames().then(games => {
                gamesListNamespace.emit(GamesListEventName, games as GamesListEventMessageData);
            });
        }
    }, 1000);

    const scanJustCreatedGames = (): Promise<Game[]> => {
        const params = {
            TableName: "Games",
            FilterExpression: "#le.#n = :n",
            ExpressionAttributeNames: {
                "#le": "lastEvent",
                "#n": "name",
            },
            ExpressionAttributeValues: {
                ":n": GameEventName.GameCreation,
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
