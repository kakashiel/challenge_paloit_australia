const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
require('dotenv').load();

const API_PORT = 3001;
const app = express();
const router = express.Router();

// this is our MongoDB database
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const dbRoute = `mongodb://${USERNAME}:${PASSWORD}@cluster0-shard-00-00-xa0fv.gcp.mongodb.net:27017,cluster0-shard-00-01-xa0fv.gcp.mongodb.net:27017,cluster0-shard-00-02-xa0fv.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`;

// connects our back end code with the database
mongoose.connect(
    dbRoute,
    { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
});


// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
    let data = new Data();

    const { id, name } = req.body;

    if ((!id && id !== 0) || !name) {
        return res.json({
            success: false,
            error: "INVALID INPUTS"
        });
    }
    data.name = name;
    data.id = id;
    data.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT} `));
