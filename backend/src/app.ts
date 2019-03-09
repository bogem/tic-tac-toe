import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import express from "express";

import { UsersCreatePostHandler } from "./handlers/UsersCreatePost";
import { UsersEnvironmentGetHandler } from "./handlers/UsersEnvironmentGet";
import { UsersLoginPostHandler } from "./handlers/UsersLoginPost";

const app = express();

app.use(cors(), bodyParser.json(), cookieSession({ name: "tic-tac-toe", keys: ["12345"] }));

app.post("/api/users/create", UsersCreatePostHandler);
app.get("/api/users/environment", UsersEnvironmentGetHandler);
app.post("/api/users/login", UsersLoginPostHandler);

app.listen(3000);
