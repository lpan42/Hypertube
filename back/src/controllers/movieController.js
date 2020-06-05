const axios = require('axios').default;
const User = require('../models/user');

export async function getMovieinfo(req, res){
    if(!req.params.imdb_id)
        return res.status(400).json({ error : "No IMDb ID" });
    try{
        let result = {};
        const themoviedb = await axios.get(
            `https://api.themoviedb.org/3/movie/${req.params.imdb_id}?api_key=d022dfadcf20dc66d480566359546d3c&language=${req.params.langPrefer}`
        )
        const omdi = await axios.get(
            `http://www.omdbapi.com/?i=${req.params.imdb_id}&apikey=35be5a73`
        )
        if(omdi.data.Response!=="False"){
            result = {
                "Title" : omdi.data.Title,
                "Year" : omdi.data.Year,
                "Released" : omdi.data.Released,
                "Language" : omdi.data.Language,
                "Runtime" : omdi.data.Runtime,
                "Rated" : omdi.data.Rated,
                "Genre" : omdi.data.Genre,
                "Director" : omdi.data.Director,
                "Actors" : omdi.data.Actors,
                "Plot" : themoviedb.data.overview,
                "Country" : omdi.data.Country,
                "Poster" : "https://image.tmdb.org/t/p/w500" + themoviedb.data.poster_path,
                "Tagline" : themoviedb.data.tagline,
                "ImdbRating" : omdi.data.imdbRating,
                "ImdbID" : omdi.data.imdbID,
            }
        }
        // console.log(omdi.data)
        // console.log(themoviedb.data)
        return res.status(200).json({ data: result });
    }catch(err){
        if(err){
            return res.status(400).json({ error : err.response.data.status_message });
        }
    }
}

export async function addWatchLater(req, res){
    const themoviedb = await axios.get(
        `https://api.themoviedb.org/3/movie/${req.params.imdb_id}?api_key=d022dfadcf20dc66d480566359546d3c`
    )
    const data = {
        "ImdbID" : req.params.imdb_id,
        "Title" : themoviedb.data.title,
        "Poster" : "https://image.tmdb.org/t/p/w500" + themoviedb.data.poster_path,

    }
    console.log(data)

    await User.updateOne({_id:req.userid},{$addToSet:{ watchLater :data}},(err) => {
        if(err) return res.status(400).json({ error:"Update failed" });
    });
    return res.status(200).json({ success: "Add to watchlater list" });
}


export async function removeWatchLater(req, res){
    await User.updateOne({_id:req.userid},{$pull:{ watchLater : req.params.imdb_id}},(err) => {
        if(err) return res.status(400).json({ error:"Update failed" });
    });
    return res.status(200).json({ success: "Remove from watchlater list" });
}