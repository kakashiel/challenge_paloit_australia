const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const DataSchema = new Schema(
    {
        id: Number,
        name: String,
        res: Number
    },
    { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);