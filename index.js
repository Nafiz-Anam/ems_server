const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const port = process.env.PORT || 5000;

//route import
const Router = require("./routes/Router");

require("dotenv").config();
const app = express();

//middle-wares
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(require("sanitize").middleware);
// using static files
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/api/v1", Router);

app.get("/", (req, res) => {
    res.send("Welcome to EMS thesis-API");
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
