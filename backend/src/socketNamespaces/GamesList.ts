import { Server } from "socket.io";

import { Game } from "../../../common/types/Game";
import { GamesListEventName } from "../../../common/types/sockets/GamesList";
import { newGameEventEmitter } from "../eventEmitters/NewGame";
import { scanOnlyCreatedGames } from "../models/Game";
import { opponentJoinEventEmitter } from "../eventEmitters/OpponentJoin";
import { SocketNamespacePathname } from "../../../common/Urls";

export const runGamesListSocketNamespace = (io: Server) => {
    const gamesListNamespace = io.of(SocketNamespacePathname.GamesList);

    let gamesList: Game[] = [];
    const setGamesList = (games: Game[]) => (gamesList = games);

    const emitGamesList = () => gamesListNamespace.emit(GamesListEventName, gamesList);

    // Set initial games list.
    scanOnlyCreatedGames().then(setGamesList);

    // Emit games list on connection.
    gamesListNamespace.on("connection", emitGamesList);

    // Gets created games and emits to namespace,
    // if there is someone connected.
    const updateAndEmitGamesList = () => {
        scanOnlyCreatedGames().then(games => {
            setGamesList(games);

            if (Object.keys(gamesListNamespace.connected).length > 0) {
                emitGamesList();
            }
        });
    };

    newGameEventEmitter.onNewGame(updateAndEmitGamesList);
    opponentJoinEventEmitter.onOpponentJoin(updateAndEmitGamesList);
};
