const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    ImdbId: String,
    Title: String,
    // TitleFR: String,
    Year: Number,
    Poster: String,
    Runtime: Number,
    Plot: String,
    // PlotFR: String,
    Language: String,
    Genre: Array,
    ImdbRating: Number,
    Trailer: String,
    Torrents: Array,
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;