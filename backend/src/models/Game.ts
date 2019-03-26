import { sortBy } from "lodash";

import { GameEvent, GameEventName, Game, GameId } from "../../../common/types/Game";
import { docClient } from "../db/Db";
import { put, update } from "../db/Fns";
import { TableName } from "../db/Tables";

export const ERROR_GAME_NOT_FOUND = new Error("Game not found");

// GETs

export const getGame = (gameId: GameId): Promise<Game> =>
    new Promise((resolve, reject) => {
        docClient.get(
            {
                TableName: TableName.Games,
                Key: { id: gameId },
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else if (!data.Item) {
                    reject(ERROR_GAME_NOT_FOUND);
                } else {
                    resolve(data.Item as Game);
                }
            }
        );
    });

export const getUsersGames = (username: String): Promise<Game[]> =>
    new Promise((resolve, reject) => {
        docClient.scan(
            {
                TableName: TableName.Games,
                FilterExpression: "#gu = :u or #hu = :u",
                ExpressionAttributeNames: {
                    "#gu": "guestUsername",
                    "#hu": "hostUsername",
                },
                ExpressionAttributeValues: {
                    ":u": username,
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

export const isUserInGame = (gameId: GameId, username: string): Promise<boolean> =>
    new Promise((resolve, reject) => {
        docClient.get(
            {
                TableName: TableName.Games,
                Key: { id: gameId },
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const game = data.Item as Game | undefined;
                    resolve(
                        Boolean(
                            game &&
                                (game.hostUsername === username || game.guestUsername === username)
                        )
                    );
                }
            }
        );
    });

export const getOnlyCreatedGames = (): Promise<Game[]> =>
    new Promise((resolve, reject) => {
        docClient.scan(
            {
                TableName: TableName.Games,
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
                    if (data.Items) {
                        resolve(sortBy(data.Items, "name") as Game[]);
                    } else {
                        resolve([]);
                    }
                }
            }
        );
    });

// PUTs

export const putGame = (game: Game) => put({ TableName: TableName.Games, Item: game });

// UPDATEs

export const updateGameGuestUsername = (gameId: GameId, guestUsername: string) =>
    update({
        TableName: TableName.Games,
        Key: { id: gameId },
        UpdateExpression: "set #gu = :gu",
        ExpressionAttributeNames: { "#gu": "guestUsername" },
        ExpressionAttributeValues: { ":gu": guestUsername },
    });

export const updateGameLastEvent = (gameId: GameId, event: GameEvent) =>
    update({
        TableName: TableName.Games,
        Key: { id: gameId },
        UpdateExpression: "set #e = :e",
        ExpressionAttributeNames: { "#e": "lastEvent" },
        ExpressionAttributeValues: { ":e": event },
    });
