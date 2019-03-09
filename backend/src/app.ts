import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import express from "express";

import { UserNewHandler } from "./handlers/UserNew";
import { UserEnvironmentHandler } from "./handlers/UserEnvironment";

const app = express();

app.use(cors(), bodyParser.json(), cookieSession({ name: "tic-tac-toe", keys: ["12345"] }));

app.post("/api/user/new", UserNewHandler);
app.get("/api/user/environment", UserEnvironmentHandler);

app.listen(3000);
