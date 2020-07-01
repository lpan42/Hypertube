const Movie = require('../models/movie');
const axios = require("axios");
const mongoose = require("mongoose");
const cloudflareScraper = require('cloudflare-scraper');

async function connection(){
  await mongoose.connect("mongodb://localhost:27017/hypertube", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  await mongoose.connection.db.listCollections({name: 'movies'})
    .next(function(err, collinfo) {
        if (collinfo) {
          mongoose.connection.dropCollection("movies", err =>{
            console.log(err);
        });
      }
    });
}

async function countMoviesPagePOP(){
  try{
    const config = {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    let count = await axios.get('https://cors-anywhere.herokuapp.com/movies-v2.api-fetch.sh/movies',config);
    return count.data.length;
  }catch(err){
    console.log(err.response)
  }
}

async function scrapPOP(){
  await mongoose.connect("mongodb://localhost:27017/hypertube", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log("Start to scrap Popcorn")
const count_movies = await countMoviesPagePOP();
for(let i = 1; i <= count_movies; i++){
  try{
      const config = {
          headers: {
              'X-Requested-With': 'XMLHttpRequest',
          }
      }
      let result = await axios.get(`https://cors-anywhere.herokuapp.com/movies-v2.api-fetch.sh/movies/${i}`, config);
      result.data.map((movie) => {
          Movie.findOne({ImdbId:movie.imdb_id},(err,res)=>{
              if(err) console.log(err);
              if(res){
                  for (let lang in movie.torrents) {
                      for (const p in movie.torrents[lang]) {
                        const torrent = {
                          url: movie.torrents[lang][p].url,
                          quality: p,
                          seeds: movie.torrents[lang][p].seed,
                          peers: movie.torrents[lang][p].peer,
                          size_bytes: movie.torrents[lang][p].size,
                          size: movie.torrents[lang][p].filesize,
                          provider: "Popcorn"
                        };
                        Movie.updateOne({ ImdbId:movie.imdb_id },{$push:{Torrents: torrent}}, (err,res)=> {
                            if(err) console.log(err);
                        })
                      }
                  }
              }
          })
      })
      console.log("Scraping PopCorn Page " + i);
  }catch(err){
    console.log(err.response)
  }
}
  console.log(" POPCORN adding to DB")
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

async function scrapYTS(){
  connection();
  console.log("Start to scrap YTS")
  let processed = [];
  const count_movies = await countMovies();

  for(let i = 1; i <= count_movies/50; i++){
    try{
      let result = await cloudflareScraper.get(`https://yts.mx/api/v2/list_movies.json?limit=50&page=${i}`);
        result = JSON.parse(result);
        result.data.movies.map((movie) => {
          let torrents = [];
          for (let t in movie.torrents) {
            torrents.push({ 
              url: `magnet:?xt=urn:btih:${movie.torrents[t].hash}&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337`,
              hash:  movie.torrents[t].hash,
              seeds:  movie.torrents[t].seeds,
              peers:  movie.torrents[t].peers,
              quality: movie.torrents[t].quality,
              size:  movie.torrents[t].size,
              size_bytes:  movie.torrents[t].size_bytes,
              provider: "YTS"
            })
          }
          processed.push({
            "ImdbId": movie.imdb_code,
            "Title": movie.title,
            // "TitleFR": "",
            "Year": movie.year,
            "Poster": movie.large_cover_image,
            "Runtime": movie.runtime,
            "Language": movie.language,
            "Plot":movie.description_full,
            // "PlotFR":"",
            "Genre": movie.genres,
            "ImdbRating": movie.rating,
            "Trailer": movie.yt_trailer_code ? "https://www.youtube.com/watch?v="+movie.yt_trailer_code:'',
            "Torrents": torrents,
          })
        })
        console.log("Scraping YTS Page " + i);
    }catch(err){
      console.log(err.response)
    }
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
    
    Movie.insertMany(processed, err =>{
      if(err) console.log(err)
    })
    console.log(" YTS adding to DB");
    
    await scrapPOP();
}

// scrapPOP();
scrapYTS();