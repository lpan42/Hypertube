const Movie = require('../models/movie');
const axios = require("axios");
const mongoose = require("mongoose");
const cloudflareScraper = require('cloudflare-scraper');

async function connection(){
  mongoose.connect("mongodb://localhost:27017/hypertube", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  mongoose.connection.db.listCollections({name: 'movies'})
    .next(function(err, collinfo) {
        if (collinfo) {
          mongoose.connection.dropCollection("movies", err =>{
            console.log(err);
        });
      }
    });
}

async function countMovies(){
  try{
    let count = await cloudflareScraper.get('https://yts.mx/api/v2/list_movies.json');
    count = JSON.parse(count).data.movie_count;
    return count;
  }catch(err){
    console.log(err)
  }
}

export async function scrapYTS(){
  connection();
  let processed = [];
  const count_movies = await countMovies();
  // console.log(count_movies)

  for(let i = 1; i <= count_movies / 50; i++){
        let result = await cloudflareScraper.get(`https://yts.mx/api/v2/list_movies.json?limit=50&page=${i}`);
        result = JSON.parse(result);
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
              // url: `magnet:?xt=urn:btih:${t.hash}&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337`,
            })
          }
          processed.push({
            "ImdbId": movie.imdb_code,
            "Title": movie.title,
            "TitleFR": "",
            "Year": movie.year,
            "Poster": movie.large_cover_image,
            "Runtime": movie.runtime,
            "Language": movie.language,
            "Plot":movie.description_full,
            "PlotFR":"",
            "Genre": movie.genres,
            "ImdbRating": movie.rating,
            "Trailer": movie.yt_trailer_code ? "https://www.youtube.com/watch?v="+movie.yt_trailer_code:'',
            "Torrents": torrents,
          })
        })
    }
    
    // console.log("adding French")
    // for(let p in processed){
    //   console.log(p)
    //   try{
    //     const tmdb =  await axios.get(
    //       `https://api.themoviedb.org/3/movie/${processed[p].ImdbId}?api_key=d022dfadcf20dc66d480566359546d3c&language=fr`
    //     )
    //     processed[p].TitleFR = tmdb.data.title;
    //     processed[p].PlotFR = tmdb.data.overview;
    //   }catch(err){
    //     processed[p].TitleFR = processed[p].Title;
    //     processed[p].PlotFR = processed[p].Plot;
    //   }
    // }
    // console.log(processed)
  console.log("adding to DB")
    Movie.insertMany(processed, err =>{
      if(err) console.log(err)
    })
}