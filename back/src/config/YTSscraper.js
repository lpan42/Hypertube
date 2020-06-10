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

  // mongoose.connection.dropCollection("Movie");
  try{
    let count_page = await cloudflareScraper.get('https://yts.mx/api/v2/list_movies.json');
    count_page = JSON.parse(count_page).data.movie_count;
    for(let i = 1;i < 3; i++){
      let res = await cloudflareScraper.get(`https://yts.mx/api/v2/list_movies.json?limit=50&page=${i}`);
     console.log(i)
    }
  }catch(err){
    console.log(err)
  }
 
}

// axios get total movie No / 50 per page
// loop through https://github.com/popcorn-official/popcorn-api/blob/development/src/scraper/providers/YtsProvider.js
//https://popcorn-official.github.io/popcorn-api/file/src/providers/movie/yts.js.html