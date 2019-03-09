import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import express from "express";

import { UserNewHander } from "./handlers/UserNew";

const app = express();

app.use(cors(), bodyParser.json(), cookieSession());

app.post("/api/user/new", UserNewHander);

app.get("/api/user/environment", (_, res) => {
    res.json({});
});

app.listen(3000);
