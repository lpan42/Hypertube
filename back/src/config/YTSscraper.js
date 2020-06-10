const Movie = require('../models/movie');
const axios = require("axios");
const mongoose = require("mongoose");
const cloudflareScraper = require('cloudflare-scraper');

export async function scrapYTS(){
  mongoose.connect("mongodb://localhost:27017/hypertube", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  let processed = [];

  mongoose.connection.db.listCollections({name: 'movies'})
    .next(function(err, collinfo) {
        if (collinfo) {
          mongoose.connection.dropCollection("movies", err =>{
            console.log(err);
        });
      }
    });
  try{
    let count_page = await cloudflareScraper.get('https://yts.mx/api/v2/list_movies.json');
    count_page = JSON.parse(count_page).data.movie_count;
    for(let i = 1; i <= count_page/50; i++){
      let result = await cloudflareScraper.get(`https://yts.mx/api/v2/list_movies.json?limit=50&page=${i}`);
      result = JSON.parse(result);
      if (!result.data.movies) 
        break;
      result.data.movies.map((movie) => {
        let torrents = [];
        for (let t in movie.torrents) {
          torrents.push({ 
            url: movie.torrents[t].url,
            hash:  movie.torrents[t].hash,
            seeds:  movie.torrents[t].seeds,
            peers:  movie.torrents[t].peers,
            quality: movie.torrents[t].quality,
            size:  movie.torrents[t].size,
            size_bytes:  movie.torrents[t].size_bytes,
            provider: "YTS"
          })
        }
          // url: `magnet:?xt=urn:btih:${t.hash}&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337`,
        processed.push({
          "ImdbId": movie.imdb_code,
          "Title": movie.title,
          "Year": movie.year,
          "Poster": movie.large_cover_image,
          "Runtime": movie.runtime,
          "Language": movie.language,
          "Plot":movie.description_full,
          "Genre": movie.genres,
          "ImdbRating": movie.rating,
          "Trailer": movie.yt_trailer_code ? "https://www.youtube.com/watch?v="+movie.yt_trailer_code:'',
          "Torrents": torrents,
        })
      })
    }
    Movie.insertMany(processed, err =>{
      if(err) console.log(err)
    })
  }catch(err){
    console.log(err)
  }
}

// axios get total movie No / 50 per page
// loop through https://github.com/popcorn-official/popcorn-api/blob/development/src/scraper/providers/YtsProvider.js
//https://popcorn-official.github.io/popcorn-api/file/src/providers/movie/yts.js.html