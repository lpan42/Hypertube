const axios = require('axios').default;
const User = require('../models/user');
const Movie = require('../models/movie');
const Downloaded = require('../models/downloaded');
const torrentStream = require('torrent-stream');
const fs = require('fs');
const rootPath = process.cwd();
const path = require('path');

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
                "Title" : themoviedb.data.title,
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
    await User.updateOne({ _id:req.userid },{ $addToSet : { watchLater :data }},(err) => {
        if(err) return res.status(400).json({ error:"Update failed" });
    });
    return res.status(200).json({ success: "Add to watchlater list" });
}


export async function removeWatchLater(req, res){
    await User.updateOne({ _id:req.userid },{ $pull : { watchLater : { ImdbID : req.params.imdb_id }}},(err) => {
        if(err) return res.status(400).json({ error:"Update failed" });
    });
    return res.status(200).json({ success: "Remove from watchlater list" });
}

export async function getSingleMovie(req,res){
    await Movie.findOne({ ImdbId:req.params.imdb_id }, (err, result) => {
        if(err || result === null){
            return res.status(400).json({ error:"No movie resource found" })
        }
        return res.status(200).json({ data: result });
    })
}

export async function stream(req,res,fileSize,filePath,ext){
    let contentType;
    let start;
    let end;
    if(ext === '.mp4')
        contentType = 'video/mp4';
    else if(ext === '.ogg')
        contentType = 'video/ogg';
    else 
        contentType = 'video/webm';
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        start = parseInt(parts[0], 10);
        end = parts[1] ? parseInt(parts[1], 10): fileSize - 1;
        const chunksize = (end - start) + 1;
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': contentType,
        }
        res.writeHead(206, head);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': contentType,
        }
        res.writeHead(200, head);
    }
    let stream = fs.createReadStream(filePath, {
        start: start,
        end: end
    });
    stream.pipe(res);
} 

export async function downloadTorrent(req,res,torrent){
    let fileSize;
    let filePath;

    const engine = torrentStream(torrent.url,{
        connections: 100,
        uploads: 10,
        path: rootPath + '/movies',
    });

    engine.on('ready', function() {
        engine.files.forEach(function(file) {
            const ext = path.extname(file.path);
            if(ext === '.mp4' || ext === '.avi' || ext === '.mkv' || ext === '.ogg'){
console.log(ext)
                file.select();
                fileSize = file.length;
                filePath = rootPath + '/movies/' + file.path;
                stream(req,res,fileSize,filePath,ext);
            }else {
                file.deselect();
            }
        });
    });
    engine.on("download", () => {
        console.log("Downloding: " + Math.round(engine.swarm.downloaded / fileSize * 100) + "%");
    })
    engine.on('idle', () => {
        //check if exists
        Downloaded.findOne({ 
            ImdbId: req.params.imdb_id,
            Quality: req.params.quality,
            Provider: req.params.provider,
            FilePath: filePath 
        },(err,res) => {
            if(err){
                console.log(err)
            }
            if(res === null){
                const newDowloaded =  new Downloaded({  
                    ImdbId: req.params.imdb_id,
                    Quality: req.params.quality,
                    Provider: req.params.provider,
                    FilePath: filePath 
                })
                newDowloaded.save((err) => {
                    if(err)
                        console.log(err)
                })
            }
        })
        console.log("Download Finish");
    })
}

export async function streamMovie(req,res){
    Movie.findOne({ 
        ImdbId:req.params.imdb_id},
        { Torrents: { $elemMatch: { quality: req.params.quality, provider: req.params.provider } } }, 
        (err,torrent) => {
            if(err || !torrent.Torrents.length){
                return res.status(400).json({ error:"No movie resource found" })
            }
            else{
                //check if downloaded
                Downloaded.findOne({ ImdbId:req.params.imdb_id, Quality: req.params.quality, Provider: req.params.provider },
                    (err, downloaded) => {
                    if (err) console.log(err);
                    if(downloaded === null){
                        downloadTorrent(req,res, torrent.Torrents[0]);
                    }
                    else{
                        const filePath = downloaded.FilePath;
                        const stat = fs.statSync(filePath);
                        const fileSize = stat.size;
                        const ext = path.extname(filePath);
                        stream(req,res,fileSize,filePath,ext);
                    }
                })
            }
        }
    )
}

export async function addToWatched(req,res){
    User.findOne({ _id: req.userid }, { watched:{ $elemMatch:{ ImdbID: req.params.imdb_id }}},
        async (err, watched) => {
        if (err) console.log(err);
        if(!watched.watched.length){
            console.log("call")
            const themoviedb = await axios.get(
                `https://api.themoviedb.org/3/movie/${req.params.imdb_id}?api_key=d022dfadcf20dc66d480566359546d3c`
            )
            const data = {
                "ImdbID" : req.params.imdb_id,
                "Title" : themoviedb.data.title,
                "Poster" : "https://image.tmdb.org/t/p/w500" + themoviedb.data.poster_path,
        
            }
            await User.updateOne({ _id:req.userid },{ $addToSet : { watched :data }},(err) => {
                if(err) return res.status(400).json({ error:"file to add to watched" });
            });
            return res.status(200);
        }else{
            return res.status(200);
        }
      });
}