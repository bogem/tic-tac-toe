// import { Server } from "socket.io";

// import { GameJoinEventData } from "../../../common/types/sockets/GamesPlay";

// export const runGamesPlaySocketNamespace = (io: Server) => {
//     const gamePlayNamespace = io.of("/games/play");

//     gamePlayNamespace.on("connection", socket => {
//         socket.on("game_join", (gameJoinEventData: GameJoinEventData) => {
//             const { username, gameId } = gameJoinEventData;

//             if (false /* check if user is really joined */) {
//             }

//             io.in(gameId).on("connection");

//             socket.join(gameId);
//         });
//     });
// };
