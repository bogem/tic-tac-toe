import express = require("express");
import bodyParser = require("body-parser");
import cors = require("cors");

process.title = "tic-tac-toe-backend";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/api/user/new", (req, res) => {
    res.send(req.body.username);
});

app.get("/api/user/environment", (_, res) => {
    res.json({});
});

app.listen(3000, function() {
    console.log("Example app listening on port 3000!");
});
