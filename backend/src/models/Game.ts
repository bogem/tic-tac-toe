import { GameEvent, Game, GameId } from "../../../common/types/Game";
import { docClient } from "../db/Db";
import { put, update } from "../db/Fns";
import { GameEventName } from "../../../common/types/Game";

// GETs

export const getGame = (gameId: GameId): Promise<Game | undefined> =>
    new Promise((resolve, reject) => {
        docClient.get(
            {
                TableName: "Games",
                Key: { id: gameId },
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Item as Game | undefined);
                }
            }
        );
    });

export const isUserInGame = (gameId: GameId, username: string): Promise<boolean> =>
    new Promise((resolve, reject) => {
        docClient.get(
            {
                TableName: "Games",
                Key: { id: gameId },
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const game = data.Item as Game | undefined;
                    resolve(Boolean(game && (game.hostUsername === username || game.guestUsername === username)));
                }
            }
        );
    });

export const scanJustCreatedGames = (): Promise<Game[]> =>
    new Promise((resolve, reject) => {
        docClient.scan(
            {
                TableName: "Games",
                FilterExpression: "#le.#n = :n",
                ExpressionAttributeNames: {
                    "#le": "lastEvent",
                    "#n": "name",
                },
                ExpressionAttributeValues: {
                    ":n": GameEventName.GameCreation,
                },
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve((data.Items || []) as Game[]);
                }
            }
        );
    });

// PUTs

export const putGame = (game: Game) => put({ TableName: "Games", Item: game });

// UPDATEs

export const updateGameGuestUsername = (gameId: GameId, guestUsername: string) =>
    update({
        TableName: "Games",
        Key: { id: gameId },
        UpdateExpression: "set #gu = :gu",
        ExpressionAttributeNames: { "#gu": "guestUsername" },
        ExpressionAttributeValues: { ":gu": guestUsername },
    });

export const updateGameLastEvent = (gameId: GameId, event: GameEvent) =>
    update({
        TableName: "Games",
        Key: { id: gameId },
        UpdateExpression: "set #e = :e",
        ExpressionAttributeNames: { "#e": "lastEvent" },
        ExpressionAttributeValues: { ":e": event },
    });
