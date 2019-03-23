import { Server } from "socket.io";

import { Game } from "../../../common/types/Game";
import { GamesListEventName } from "../../../common/types/sockets/GamesList";
import { newGameEventEmitter } from "../eventEmitters/NewGame";
import { scanJustCreatedGames } from "../models/Game";

export const runGamesListSocketNamespace = (io: Server) => {
    const gamesListNamespace = io.of("/games/list");

    let gamesList: Game[] = [];
    const setGamesList = (games: Game[]) => (gamesList = games);

    const emitGamesList = () => gamesListNamespace.emit(GamesListEventName, gamesList);

    // Set initial games list.
    scanJustCreatedGames().then(setGamesList);

    // Emit games list on connection.
    gamesListNamespace.on("connection", emitGamesList);

    // Emit games list on new game.
    newGameEventEmitter.onNewGame(() => {
        scanJustCreatedGames().then(games => {
            setGamesList(games);

            if (Object.keys(gamesListNamespace.connected).length > 0) {
                emitGamesList();
            }
        });
    });
};
