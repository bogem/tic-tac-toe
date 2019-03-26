import fs from "fs";
import path from "path";

import {
    ApiPathname,
    getGameApiPathname,
    gameJoinApiPathname,
    gameMakeMoveApiPathname,
    ApiServerPort,
    SocketServerPort,
    ClientUrl,
} from "../../common/Urls";

// Express import and use.
import express from "express";
const app = express();

// Express middleware imports.
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";

// Socket.io imports.
import { Server } from "net";
import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from "https";
import socketIo from "socket.io";

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
    cors({ credentials: true, origin: ClientUrl }),
    bodyParser.json(),
    cookieSession({ name: "tic-tac-toe", keys: ["42"] })
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

let socketServer: Server;

if (process.env.NODE_ENV === "production") {
    const frontendDistDir = path.join(__dirname, "../../../../frontend/dist");

    app.get("*.js", (req, res) => {
        res.set("Content-Type", "text/javascript");

        const filePath = path.join(frontendDistDir, req.url);
        const compressedFilePath = filePath + ".gz";

        if (fs.existsSync(compressedFilePath)) {
            res.set("Content-Encoding", "gzip");
            res.sendFile(compressedFilePath);
        } else {
            res.sendFile(filePath);
        }
    });

    app.get("*", (_, res) => {
        res.sendFile(path.join(frontendDistDir, "index.html"));
    });

    const greenlock = require("greenlock-express").create({
        app,
        agreeTos: true,
        approveDomains: ["tic-tac-toe-sm.tk", "tic-tac-toe-sm.tk"],
        configDir: "~/.config/acme/",
        email: "albernigma@gmail.com",
    });
    greenlock.listen(80, 443);

    socketServer = createHttpsServer(greenlock.tlsOptions, app);
} else {
    app.listen(ApiServerPort, () => console.log("Express started"));

    socketServer = createHttpServer(app);
}

const io = socketIo(socketServer);
socketServer.listen(SocketServerPort, () => console.log("Socket server started"));

runGamesListSocketNamespace(io);
runGamesStateSocketNamespace(io);
