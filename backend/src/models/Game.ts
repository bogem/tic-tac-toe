import { GameEvent, Game } from "../../../common/types/Game";
import { docClient } from "../db/Db";
import { put } from "../db/Fns";
import { GameEventName } from "../../../common/types/Game";

// GETs

export const getGame = (gameId: string): Promise<Game | undefined> =>
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

export const isUserInGame = (gameId: string, username: string): Promise<boolean> =>
    new Promise((resolve, reject) => {
        docClient.get(
            {
                TableName: "Games",
                Key: { gameId },
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

export const updateGameGuestUsername = (gameId: string, guestUsername: string) =>
    new Promise((resolve, reject) => {
        docClient.update(
            {
                TableName: "Games",
                Key: { id: gameId },
                UpdateExpression: "set #gu = :gu",
                ExpressionAttributeNames: { "#gu": "guestUsername" },
                ExpressionAttributeValues: { ":gu": guestUsername },
            },
            err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });

export const updateGameLastEvent = (gameId: string, event: GameEvent) =>
    new Promise((resolve, reject) => {
        docClient.update(
            {
                TableName: "Games",
                Key: { id: gameId },
                UpdateExpression: "set #e = :e",
                ExpressionAttributeNames: { "#e": "event" },
                ExpressionAttributeValues: { ":e": event },
            },
            err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });

interface GamesHistoriesItem {
    id: string;
    gameId: string;
    event: GameEvent;
}

export const putGamesHistoriesItem = (item: GamesHistoriesItem) => put({ TableName: "GamesHistories", Item: item });
