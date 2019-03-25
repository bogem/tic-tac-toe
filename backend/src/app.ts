import path from "path";

import {
    ApiPathname,
    getGameApiPathname,
    gameJoinApiPathname,
    gameMakeMoveApiPathname,
    ApiServerPort,
    SocketServerPort,
} from "../../common/Urls";

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
import { UsersMeGetHandler } from "./handlers/UsersMeGet";
import { UsersLoginPostHandler } from "./handlers/UsersLoginPost";
import { GamesCreatePostHandler } from "./handlers/GamesCreatePost";
import { GamesJoinPostHandler } from "./handlers/GamesJoinPost";
import { GamesGetHandler } from "./handlers/GamesGet";
import { GamesMakeMovePostHandler } from "./handlers/GamesMakeMovePost";
import { UsersLogoutPostHandler } from "./handlers/UsersLogoutPost";
import { GamesOfMeGetHandler } from "./handlers/GamesOfMeGet";

// Socket.IO namespaces.
import { runGamesListSocketNamespace } from "./socketNamespaces/GamesList";
import { runGamesStateSocketNamespace } from "./socketNamespaces/GamesState";

app.use(
    cors({ credentials: true, origin: "http://localhost:3001" }),
    bodyParser.json(),
    cookieSession({ name: "tic-tac-toe", keys: ["12345"] })
);

app.post(ApiPathname.UsersCreate, UsersCreatePostHandler);
app.post(ApiPathname.UsersLogin, UsersLoginPostHandler);
app.get(ApiPathname.UsersMe, UsersMeGetHandler);
app.post(ApiPathname.UsersLogout, UsersLogoutPostHandler);

app.post(ApiPathname.GamesCreate, GamesCreatePostHandler);
app.get(ApiPathname.GamesOfMe, GamesOfMeGetHandler);
app.get(getGameApiPathname(":gameId"), GamesGetHandler);
app.post(gameJoinApiPathname(":gameId"), GamesJoinPostHandler);
app.post(gameMakeMoveApiPathname(":gameId"), GamesMakeMovePostHandler);

if (process.env.NODE_ENV === "production") {
    const frontendDistDir = path.join(__dirname, "../../../../frontend/dist");

    app.get("*.js", function(req, res) {
        res.set("Content-Encoding", "gzip");
        res.set("Content-Type", "text/javascript");
        res.sendFile(path.join(frontendDistDir, req.url + ".gz"));
    });

    app.get("*", (_, res) => {
        res.sendFile(path.join(frontendDistDir, "index.html"));
    });
}

app.listen(ApiServerPort, () => console.log("Express started"));

runGamesListSocketNamespace(io);
runGamesStateSocketNamespace(io);

socketServer.listen(SocketServerPort, () => console.log("Socket server started"));
