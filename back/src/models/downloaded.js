const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const downloadedSchema = new Schema({
    ImdbId: String,
    Quality: String,
    Provider: String,
    FilePath: String,
    LastView: { type : Date, default: Date.now }
});

const Downloaded = mongoose.model("Downloaded", downloadedSchema);

module.exports = Downloaded;