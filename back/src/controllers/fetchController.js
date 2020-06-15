const axios = require('axios')
const moviedbAPI_KEY = require('../config/moviedbAPI_KEY');


export async function fetchYts(req, res){
    const result = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=` + moviedbAPI_KEY.API_KEY);
    // const body = await result;
    // const $ = cheerio.load(body);
    // console.log($)
    return res.status(200).json({data: result})
}