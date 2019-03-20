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

// Socket.IO namespaces.
import { runGamesListSocketNamespace } from "./socketNamespaces/GamesList";

app.use(
    cors({ credentials: true, origin: "http://localhost:3001" }),
    bodyParser.json(),
    cookieSession({ name: "tic-tac-toe", keys: ["12345"] })
);

app.post("/api/users/create", UsersCreatePostHandler);
app.post("/api/users/login", UsersLoginPostHandler);
app.get("/api/users/environment", UsersEnvironmentGetHandler);

app.post("/api/games/create", GamesCreatePostHandler);
app.post("/api/games/join", GamesJoinPostHandler);

app.listen(3000);

runGamesListSocketNamespace(io);

socketServer.listen(3002);
