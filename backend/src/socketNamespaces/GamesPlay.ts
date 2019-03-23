import { Server } from "socket.io";

import { GameJoinEventData } from "../../../common/types/sockets/GamesPlay";
import { opponentJoinEventEmitter } from "../eventEmitters/OpponentJoin";
import { gameMoveEventEmitter } from "../eventEmitters/GameMove";

export const runGamesPlaySocketNamespace = (io: Server) => {
    const gamePlayNamespace = io.of("/games/play");

    gamePlayNamespace.on("connection", socket => {
        socket.on("game_room_connect", (gameJoinEventData: GameJoinEventData) => {
            const { gameId } = gameJoinEventData;

            // if (false /* check if user is really joined */) {
            // }

            io.in(gameId).on("connection", roomSocket => {
                console.log(roomSocket.listenerCount);
                roomSocket.emit("current_game_state", { gameId });

                opponentJoinEventEmitter.onOpponentJoin(() => {
                    roomSocket.emit("opponent_join");
                });

                gameMoveEventEmitter.onGameMove(gameMoveInfo => {
                    roomSocket.emit("game_move", gameMoveInfo);
                });
            });

            socket.join(gameId);
        });
    });
};
