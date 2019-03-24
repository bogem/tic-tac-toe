import { Server } from "socket.io";

import {
    GameRoomConnectEventData,
    GamePlayEventName,
    CurrentGameStateEventData,
} from "../../../common/types/sockets/GamesPlay";
import { opponentJoinEventEmitter } from "../eventEmitters/OpponentJoin";
import { gameMoveEventEmitter } from "../eventEmitters/GameMove";
import { GameId } from "../../../common/types/Game";
import { getGame } from "../models/Game";
import { getGameBoard } from "../models/GameBoard";

export const runGamesPlaySocketNamespace = (io: Server) => {
    const namespace = io.of("/games/play");
    const rooms: GameId[] = [];

    const emitCurrentGameState = (gameId: GameId) => {
        Promise.all([getGame(gameId), getGameBoard(gameId)]).then(([game, gameBoard]) => {
            namespace
                .to(gameId)
                .emit(GamePlayEventName.CurrentGameState, { game, gameBoard } as CurrentGameStateEventData);
        });
    };

    const subscribeToGameMove = () => {
        gameMoveEventEmitter.onGameMove(data => {
            console.log("game_move", data);
            namespace.to(data.gameId).emit(GamePlayEventName.GameMove, data);
            emitCurrentGameState(data.gameId);
        });
    };

    const subscribeToOpponentJoin = () => {
        opponentJoinEventEmitter.onOpponentJoin(data => {
            console.log("opponent_join", data);
            emitCurrentGameState(data.gameId);
        });
    };

    const runNamespace = () => {
        namespace.on("connection", socket => {
            socket.on(GamePlayEventName.GameRoomConnect, ({ gameId, username }: GameRoomConnectEventData) => {
                console.log("game_room_connect", { gameId, username });
                username; // check if user joined the game and can connect to room.

                if (!rooms.includes(gameId)) {
                    rooms.push(gameId);
                }

                socket.join(gameId, () => {
                    emitCurrentGameState(gameId);
                });
            });
        });
    };

    subscribeToGameMove();
    subscribeToOpponentJoin();
    runNamespace();
};
