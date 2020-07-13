import { pipeline } from 'stream';

const axios = require('axios').default;
const User = require('../models/user');
const Movie = require('../models/movie');
const Downloaded = require('../models/downloaded');
const torrentStream = require('torrent-stream');
const fs = require('fs');
const rootPath = process.cwd();
const path = require('path');
const moment = require('moment');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const pump = require('pump');

export async function getSubtitle(req, res){
    const config = require('../config/oAuthIds');
    const OS = require('opensubtitles-api');
    const download = require('download');
    const OpenSubtitles = new OS({
        useragent:'UserAgent',
        username: config.OpenSubtitles.username,
        password: config.OpenSubtitles.password,
        ssl: true
    });
    let subPathEn = null;
    let subPathFr = null;

    OpenSubtitles.search({
        sublanguageid: ["fre", "eng"].join(),
        extensions: ['srt','vtt'],
        limit: '3', 
        imdbid: req.params.imdb_id,
    }).then( async subs => {
        const path = rootPath + '/../front/public/subtitles/' + req.params.imdb_id;
        if (subs.en && subs.en[0].vtt){
            if(!fs.existsSync(path + "en.vtt")){
                try{
                    const res = await download(subs.en[0].vtt);
                    fs.writeFileSync(path + "en.vtt",res);
                }
                catch(err){
                    try{
                        const res = await download(subs.en[1].vtt);
                        fs.writeFileSync(path + "en.vtt",res);
                    }
                    catch(err){
                        try{
                            const res = await download(subs.en[2].vtt);
                            fs.writeFileSync(path + "en.vtt",res);
                        }
                        catch(err){
                            console.log("No English subtitle is available.");
                        }
                    }
                }
            }
            if(fs.existsSync(path + "en.vtt")){
                subPathEn = "http://localhost:3000/subtitles/" + req.params.imdb_id + "en.vtt";
            }
        }
        if (subs.fr && subs.fr[0].vtt){
            if(!fs.existsSync(path + "fr.vtt")){
                try{
                    const res = await download(subs.fr[0].vtt);
                    fs.writeFileSync(path + "fr.vtt",res);
                }
                catch(err){
                    try{
                        const res = await download(subs.fr[1].vtt);
                        fs.writeFileSync(path + "fr.vtt",res);
                    }
                    catch(err){
                        try{
                            const res = await download(subs.fr[2].vtt);
                            fs.writeFileSync(path + "fr.vtt",res);
                        }
                        catch(err){
                            console.log("No French subtitle is available.");
                        }
                    }
                }
            }
            if(fs.existsSync(path + "fr.vtt")){
                subPathFr = "http://localhost:3000/subtitles/" + req.params.imdb_id + "fr.vtt";
            }
        }
        const result = {
            "en" : subPathEn,
            "fr" : subPathFr
        }
        return res.status(200).json({ data: result });
    });
}

export async function getMovieinfo(req, res){
    if(!req.params.imdb_id)
        return res.status(400).json({ error : "No IMDb ID" });
    try{
        let result = {};
        const themoviedb = await axios.get(
            `https://api.themoviedb.org/3/movie/${req.params.imdb_id}?api_key=d022dfadcf20dc66d480566359546d3c&language=${req.params.langPrefer}`
        )
        // console.log(themoviedb.data)
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
        // else{
        //     result = {
        //         "Title" : themoviedb.data.title,
        //         "Year" : omdi.data.Year,
        //         "Released" : omdi.data.Released,
        //         "Language" : omdi.data.Language,
        //         "Runtime" : omdi.data.Runtime,
        //         "Rated" : omdi.data.Rated,
        //         "Genre" : omdi.data.Genre,
        //         "Director" : omdi.data.Director,
        //         "Actors" : omdi.data.Actors,
        //         "Plot" : themoviedb.data.overview,
        //         "Country" : omdi.data.Country,
        //         "Poster" : "https://image.tmdb.org/t/p/w500" + themoviedb.data.poster_path,
        //         "Tagline" : themoviedb.data.tagline,
        //         "ImdbRating" : omdi.data.imdbRating,
        //         "ImdbID" : omdi.data.imdbID,
        //     }
        // }
        return res.status(200).json({ data: result });
    }catch(err){
        let result = {};
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
                "Plot" : omdi.data.Plot,
                "Country" : omdi.data.Country,
                "Poster" : omdi.data.Poster,
                "Tagline" : null,
                "ImdbRating" : omdi.data.imdbRating,
                "ImdbID" : omdi.data.imdbID,
            }
            return res.status(200).json({ data: result });
        }else{
            return res.status(400).json({ error : "Cannot find the movie" });
        }
    }
}

export async function addWatchLater(req, res){
    try{
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
    }catch(err){
        const omdi = await axios.get(
            `http://www.omdbapi.com/?i=${req.params.imdb_id}&apikey=35be5a73`
        )
        if(omdi.data.Response!=="False"){
            const data = {
                "ImdbID" : req.params.imdb_id,
                "Title" : omdi.data.Title,
                "Poster" : omdi.data.Poster,
        
            }
            await User.updateOne({ _id:req.userid },{ $addToSet : { watchLater :data }},(err) => {
                if(err) return res.status(400).json({ error:"Update failed" });
            });
            return res.status(200).json({ success: "Add to watchlater list" });
        }
        else{
            return res.status(400).json({ error:"Fail to add to  watchlater list" });
        }
    }
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
            return res.status(400).json({ error:"No available movie resource found" })
        }
        return res.status(200).json({ data: result });
    })
}

export async function convertMovieTypeAndStream(res, filePath, start, end){
    const stream = fs.createReadStream(filePath);
    var newStream = ffmpeg(filePath)
    .outputOptions('-movflags frag_keyframe+faststart')
    .videoCodec('libx264')
    .audioCodec('copy')
    .format('mp4')
    .on('end', function() {
      console.log('file has been converted succesfully');
    })
    .on('progress', function(progress) {
      console.log('Processing: ' + progress.percent + '% done');
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
    })
    .pipe(res);
  
    //   pump(newStream, res);
    // var outStream = fs.createWriteStream(rootPath+'/movies/converted.mp4');
    // ffmpeg(filePath)
    //     .outputFormat("webm")
    // let stream = fs.createReadStream(filePath
    //     ,{
    //         start: start,
    //         end: end
    // }
    // )
    // stream.on("open", ()=> {
    //     let output = ffmpeg(stream)
    //     .outputFormat("webm")
    //     // .outputOptions(
    //     //     [ 
    //     //         '-b:v',
    //     //         // '-maxrate 1000k',
    //     //         // '-bufsize 2000k', 
    //     //         // '-movflags frag_keyframe',
    //     //         // '-cpu-used 2', 
    //     //         // '-deadline realtime', 
    //     //         // '-threads 4',
    //     //     ]
    //     // )
        
    //     .outputOptions('-movflags frag_keyframe+faststart')
    //     // .videoCodec('libx264')
    //     // .audioCodec('libmp3lame')
    //     // .audioCodec('copy')
        
    //     .on("start", commandLine => {
    //         console.log('Spawned Ffmpeg with command: ' + commandLine);
    //     })
    //     .on('error', err => {
    //         console.log('An error occurred: ' + err.message);
    //     })
    //     .on('end', () => {
    //         console.log('Processing finished !');
    //     })
    //     pump(output, res);
    // })

       
       

    // var stream  = fs.createWriteStream(rootPath+"/movies/converted.mp4");
    // ffmpeg(fs.createReadStream(filePath))
    //     // .output(stream, { end:true })
    //     .outputFormat("mp4")
    //     .videoCodec('libx264')
    //     .audioCodec('aac')
    //     .outputOptions('-movflags frag_keyframe+faststart+empty_moov')
    //     .on("start", commandLine => {
    //         console.log('Spawned Ffmpeg with command: ' + commandLine);
    //     })
    //     .on('error', err => {
    //         console.log('An error occurred: ' + err.message);
    //     })
    //     .on('end', () => {
    //         console.log('Processing finished !');
    //     })
    //     .pipe(res, {end:true});
    // let stream = fs.createReadStream(filePath);
    // // stream.on("open", ()=>{
    // const output = ffmpeg(fs.createReadStream(filePath))
    //     .outputFormat("mp4")
    //     .videoCodec('libx264')
    //     .audioCodec('aac')
    //     .outputOptions('-movflags frag_keyframe+faststart+empty_moov')
       
    //     .on("start", commandLine => {
    //         console.log('Spawned Ffmpeg with command: ' + commandLine);
    //     })
    //     .on('error', err => {
    //         console.log('An error occurred: ' + err.message);
    //     })
    //     .on('end', () => {
    //         console.log('Processing finished !');
    //     })
    //     .pipe(res)
    //     // .pipe(res);
    // // pump(output,res);
    // // })
}

export function stream(res, filePath, start, end,contentType){
    if( contentType === 'video/webm'){
        convertMovieTypeAndStream(res, filePath, start, end)
    }
    let stream = fs.createReadStream(filePath, {
        start: start,
        end: end
    });
    stream.on('open',() => {
       pump(stream, res);
    })
    stream.on('error',(err)=>{
        console.log(err)
        res.end(err);
    })
} 

export function downloadTorrent(req,res,torrent){
    let fileSize;
    let filePath;

    const engine = torrentStream(torrent.url,{
        connections: 100,
        uploads: 10,
        verify: true,
        path: rootPath + '/movies',
    });

    engine.on('ready', () => {
        engine.files.forEach((file) => {
            const ext = path.extname(file.path);
            if(ext === '.mp4' || ext === '.avi' || ext === '.mkv' || ext === '.ogg'){
                file.select();
                fileSize = file.length;
                filePath = '/movies/' + file.path;
                let contentType;
                    if(ext === '.mp4')
                        contentType = 'video/mp4';
                    else if(ext === '.ogg')
                        contentType = 'video/ogg';
                    else 
                        contentType = 'video/webm';
                const range = req.headers.range;
                console.log("@@@range:" + range);
                if (range) {
                    const parts = range.replace(/bytes=/, "").split("-");
                    const start = parseInt(parts[0], 10);
                    const end = parts[1] ? parseInt(parts[1], 10): fileSize - 1;
                    const chunksize = (end - start)+ 1 ;
                    const head = {
                        'Transfer-Encoding':'chunked',
                        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                        'Accept-Ranges': 'bytes',
                        // 'Content-Length': chunksize,
                        'Content-Type': contentType,
                        "Connection": "keep-alive"
                    }
                    res.writeHead(206, head);
                    
                    const checkFileExist = setInterval(() => {
                        const fileExists = fs.existsSync(rootPath + filePath);
                        if (fileExists) {
                            clearInterval(checkFileExist);
                            stream(res, rootPath + filePath, start, end,contentType);
                        }
                    }, checkFileExist);
                } else {
                    const head = {
                        // 'Content-Length': fileSize,
                        'Content-Type': contentType,
                    }
                    res.writeHead(200, head);

                    const timeout = setInterval(function() {
                        const fileExists = fs.existsSync(rootPath + filePath);
                        if (fileExists) {
                            clearInterval(timeout);
                            stream(res, rootPath + filePath, 0, fileSize-1,contentType);
                        }
                    }, timeout);
                }
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

export function streamMovie(req,res){
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
                        const filePath = rootPath + downloaded.FilePath;
                        const fileExists = fs.existsSync(filePath);
                        if(!fileExists){
                            Downloaded.deleteOne({ImdbId: req.params.imdb_id},(err)=>{
                                if (err) console.log(err);
                            })
                            downloadTorrent(req,res, torrent.Torrents[0]);
                        }else{
                              //update LastView
                            const newTimestamp = moment().format();     
                            Downloaded.updateOne({ImdbId: req.params.imdb_id}, { $set: {LastView: newTimestamp}},(err)=>{
                                if (err) console.log(err);
                            })
                            const stat = fs.statSync(filePath);
                            const fileSize = stat.size;
                            const ext = path.extname(filePath);
                            let contentType;
                            if(ext === '.mp4')
                                contentType = 'video/mp4';
                            else if(ext === '.ogg')
                                contentType = 'video/ogg';
                            else 
                                contentType = 'video/webm';
                            const range = req.headers.range;
                            if (range) {
                                const parts = range.replace(/bytes=/, "").split("-");
                                const start = parseInt(parts[0], 10);
                                const end = parts[1] ? parseInt(parts[1], 10): fileSize - 1;
                                const chunksize = (end - start) + 1;
                                const head = {
                                    'Transfer-Encoding':'chunked',
                                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                                    'Accept-Ranges': 'bytes',
                                    // 'Content-Length': chunksize,
                                    'Content-Type': contentType,
                                    "Connection": "keep-alive"
                                }
                                res.writeHead(206, head);
                                stream(res, filePath, start, end,contentType);
                            } else {
                                const head = {
                                    // 'Content-Length': fileSize,
                                    'Content-Type': contentType,
                                }
                                res.writeHead(200, head);
                                stream(res, filePath, 0, fileSize-1,contentType);
                            }
                        }
                        
                    }
                })
            }
        }
    )
}

export async function addToWatched(req,res){
   await User.findOne({ _id: req.userid }, { watched:{ $elemMatch:{ ImdbID: req.params.imdb_id }}},
        async (err, watched) => {
        if (err) return res.status(400).json({ error:"Fail to add to  watched list" });
        if(!watched.watched.length){
            try{
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
            }catch(err){
                try{
                    const omdi = await axios.get(
                        `http://www.omdbapi.com/?i=${req.params.imdb_id}&apikey=35be5a73`
                    )
                    if(omdi.data.Response!=="False"){
                        const data = {
                            "ImdbID" : req.params.imdb_id,
                            "Title" : omdi.data.Title,
                            "Poster" : omdi.data.Poster,
                        }
                        await User.updateOne({ _id:req.userid },{ $addToSet : { watched :data }},(err) => {
                            if(err) return res.status(400).json({ error:"file to add to watched" });
                        });
                        return res.status(200);
                    }else{
                        return res.status(400).json({ error:"Fail to add to  watched list" });
                    }
                }catch(err){
                    return res.status(400).json({ error:"Fail to add to  watched list" });
                }
            }
        }else{
            return res.status(200);
        }
      });
    return res.status(200);
}
function CreateMongoQuery(queryProp,value){
    if (value === '' || value === null){
        return (null);
    }
    return ({[queryProp]: value});
}

function setSort(sortBy){
    if (sortBy === 'DateDsc'){
        return (-1);
    }else if (sortBy === 'DateAsc'){
        return (1);
    }else if (sortBy === 'ImdbRating'){
        return (-1);
    }
}

function setCriteria(sortBy){
    if (sortBy === "Title"){
        return ({['Title']: setSort(sortBy)});
    }else if (sortBy === 'ImdbRating'){
        return ({['ImdbRating']: setSort(sortBy)})
    }else if (sortBy === 'DateDsc' || sortBy === 'DateAsc'){
        return ({['Year']: setSort(sortBy)})
    }
}

export async function searchMovie(req, res){
    const genre = req.body.genre.length === 0 ? null : req.body.genre;
    const keyword = req.body.keyword.length === 0 ? null : new RegExp(req.body.keyword, 'i');
    const criteria = setCriteria(req.body.sortBy);
    const result = await Movie.find({ $and: [
        CreateMongoQuery('Title', keyword),
        CreateMongoQuery('Genre', genre),
        {'Year' : { $gt: Number(req.body.yearrange[0]), $lt: Number(req.body.yearrange[1])}},
        {'ImdbRating' : { $gt: Number(req.body.ratingrange[0]), $lt: Number(req.body.ratingrange[1])}}
    ].filter(q => q !== null),    
    }, (err, result) =>{
        if (err) { 
            return (res.status(500).json({error: "Fail to fetch Database"}))
        }else{
            return (res.status(200).json({data: result}));
        }
    }).sort(criteria).limit(30 * req.body.page);
}

export async function fetchPageNum(req, res){

    const genre = req.body.genre.length === 0 ? null : req.body.genre;
    const keyword = req.body.keyword.length === 0 ? null : new RegExp(req.body.keyword, 'i');
    const result = await Movie.countDocuments({ $and: [
        CreateMongoQuery('Title', keyword),
        CreateMongoQuery('Genre', genre),
        {'Year' : { $gt: Number(req.body.yearrange[0]), $lt: Number(req.body.yearrange[1])}},
        {'ImdbRating' : { $gt: Number(req.body.ratingrange[0]), $lt: Number(req.body.ratingrange[1])}}
    ].filter(q => q !== null),    
    }, (err, result) =>{
        if (err) { 
            return (res.status(500).json({error: "Fail to fetch Database"}))
        }else{
            return (res.status(200).json({data: result}));
        }
    });
}

export async function fetchPopular(req, res){
    const result = Movie.findOne({Title: req.body.title}, (err, result) => {
        if(err || result === null){
            return res.status(400).json({ error:"No available movie resource found" })
        }
        return (res.status(200).json({data: result}));
    })
}