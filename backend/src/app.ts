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

import { UsersCreatePostHandler } from "./handlers/UsersCreatePost";
import { UsersEnvironmentGetHandler } from "./handlers/UsersEnvironmentGet";
import { UsersLoginPostHandler } from "./handlers/UsersLoginPost";
import { GamesCreatePostHandler } from "./handlers/GamesCreatePost";

app.use(
    cors({ credentials: true, origin: "http://localhost:3001" }),
    bodyParser.json(),
    cookieSession({ name: "tic-tac-toe", keys: ["12345"] })
);

app.post("/api/users/create", UsersCreatePostHandler);
app.post("/api/users/login", UsersLoginPostHandler);
app.get("/api/users/environment", UsersEnvironmentGetHandler);

app.post("/api/games/create", GamesCreatePostHandler);

app.listen(3000);

const gamesListNamespace = io.of("/games/list");
gamesListNamespace.on("connection", () => {
    console.log("someone connected");
});
setInterval(() => {
    if (Object.keys(gamesListNamespace.connected).length > 0) {
        const params = {
            TableName: "Games",
        };
    }
}, 1000);

socketServer.listen(3002);
