const axios = require('axios').default;

export async function getMovieinfo(req, res){
    try{
        const result = await axios.get(
            // `https://api.themoviedb.org/3/movie/${req.params.imdb_id}?api_key=d022dfadcf20dc66d480566359546d3c&language=${req.params.langPrefer}`
            `http://www.omdbapi.com/?i=${req.params.imdb_id}&apikey=35be5a73`
        )
        console.log(result.data)
        return res.status(200).json({ data: result.data });
    }catch(err){
        if(err){
            return res.status(400).json({ error : err.response.data.status_message });
        }
    }
    
    // const user = await User.findOne({ _id: req.userid});
    // if (!user) {
    //     return res.status(400).json({ error: "Auth user failed" });
    // }
    // const result = {
    //     id: user._id,
    //     username: user.username,
    //     firstname: user.firstname,
    //     lastname: user.lastname,
    //     email: user.email,
    //     avatar: user.avatar,
    //     language: user.language,
    // };
    // return res.status(200).json({
    //     data: result,
    // });
}