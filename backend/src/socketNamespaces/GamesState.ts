import { Server } from "socket.io";

import {
    SubscribeToGameChangesEventData,
    GameStateEventName,
    CurrentGameStateEventData,
} from "../../../common/types/sockets/GamesState";
import { opponentJoinEventEmitter } from "../eventEmitters/OpponentJoin";
import { gameMoveEventEmitter } from "../eventEmitters/GameMove";
import { GameId } from "../types/Game";
import { getGame, isUserInGame } from "../models/Game";
import { getGameBoard } from "../models/GameBoard";
import { gameEndEventEmitter } from "../eventEmitters/GameEnd";
import { SocketNamespacePathname } from "../../../common/Urls";

export const runGamesStateSocketNamespace = (io: Server) => {
    const namespace = io.of(SocketNamespacePathname.GamesState);

    const emitCurrentGameState = (gameId: GameId) =>
        Promise.all([getGame(gameId), getGameBoard(gameId)]).then(([game, gameBoard]) => {
            namespace
                .to(gameId)
                .emit(GameStateEventName.CurrentGameState, { game, gameBoard } as CurrentGameStateEventData);
        });

    const subscribeToOpponentJoin = () => {
        opponentJoinEventEmitter.onOpponentJoin(gameId => {
            emitCurrentGameState(gameId);
        });
    };

    const subscribeToGameMove = () => {
        gameMoveEventEmitter.onGameMove(gameId => {
            emitCurrentGameState(gameId);
        });
    };

    const subscribeToGameEnd = () => {
        gameEndEventEmitter.onGameEnd(gameId => {
            emitCurrentGameState(gameId);
        });
    };

    const runNamespace = () => {
        namespace.on("connection", socket => {
            socket.on(
                GameStateEventName.SubscribeToGameStateChanges,
                ({ gameId, username }: SubscribeToGameChangesEventData) => {
                    if (isUserInGame(gameId, username)) {
                        socket.join(gameId, () => {
                            emitCurrentGameState(gameId);
                        });
                    }
                }
            );
        });
    };

    subscribeToOpponentJoin();
    subscribeToGameMove();
    subscribeToGameEnd();

    runNamespace();
};
