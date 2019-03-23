// Express import and use.
import express from "express";
const app = express();

// Express middleware imports.
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";

// Socket.io imports.
import { createServer } from "http";
import socketIo from "socket.io";
const socketServer = createServer(app);
const io = socketIo(socketServer);

// Express handlers.
import { UsersCreatePostHandler } from "./handlers/UsersCreatePost";
import { UsersEnvironmentGetHandler } from "./handlers/UsersEnvironmentGet";
import { UsersLoginPostHandler } from "./handlers/UsersLoginPost";
import { GamesCreatePostHandler } from "./handlers/GamesCreatePost";
import { GamesJoinPostHandler } from "./handlers/GamesJoinPost";
import { GamesInfoGetHandler } from "./handlers/GamesInfoGet";
import { GamesMakeMovePostHandler } from "./handlers/GamesMakeMovePost";

// Socket.IO namespaces.
import { runGamesListSocketNamespace } from "./socketNamespaces/GamesList";
import { runGamesPlaySocketNamespace } from "./socketNamespaces/GamesPlay";

app.use(
    cors({ credentials: true, origin: "http://localhost:3001" }),
    bodyParser.json(),
    cookieSession({ name: "tic-tac-toe", keys: ["12345"] })
);

app.post("/api/users/create", UsersCreatePostHandler);
app.post("/api/users/login", UsersLoginPostHandler);
app.get("/api/users/environment", UsersEnvironmentGetHandler);

app.post("/api/games/create", GamesCreatePostHandler);
app.get("/api/games/:gameId/info", GamesInfoGetHandler);
app.post("/api/games/:gameId/join", GamesJoinPostHandler);
app.post("/api/games/:gameId/make_move", GamesMakeMovePostHandler);

app.listen(3000);

runGamesListSocketNamespace(io);
runGamesPlaySocketNamespace(io);

socketServer.listen(3002);
