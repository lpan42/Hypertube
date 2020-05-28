<<<<<<< HEAD
import React, { Fragment, useContext, useEffect, useState , useMemo} from 'react'
import axios from 'axios';
import Spinner from '../layout/Spinner';
import {moviedbAPI_KEY} from '../moviedbAPI_KEY';
=======
import React, { Fragment, useContext, useEffect, useState } from 'react'
import axios from 'axios';
import Spinner from '../layout/Spinner';
import CardMedia from '@material-ui/core/CardMedia';
>>>>>>> add fetch yts

const Search = () => {
    const [isFetching, setIsFetching] = useState(true);
    const [isError, setIsError] = useState(false);
    const [filmData, setfilmData] = useState({films: []});
<<<<<<< HEAD
    const [searchInput, setSearchInput] = useState('movie');

    useEffect(() => {
        function getFetchUrl(){
            return 'https://api.themoviedb.org/3/discover/' + searchInput +'?api_key=' + moviedbAPI_KEY;
        }

        async function getData(){
            const result = await axios(getFetchUrl())
            .then(res => {
                if (res.status === 200){
                    const Data = res.data.results;
                    setfilmData({
                        ...filmData,
                        films: Data
                    })
                    setIsFetching(false);
                }else{
                    setIsError(true);
                    setIsFetching(false);
                }
            })
            .catch ((err) => {
                setIsError(true);
                setIsFetching(false);
            })
            // setfilmData(result.data.results);
        }

        getData();
    }, [searchInput])

    const filmList = useMemo(() => {
        return filmData.films.map((film, key) => (
                <div className="card" key={key}>
                    <div className="image">
                        <img src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' + film.poster_path}/>
                    </div>
                    <div className="content">
                        <div className="ui medium header">{film.original_title}</div>
                        <div className="meta">
                            <span className="date">{film.release_date}</span>
                        </div>
                    </div>
                    <div className="extra">
                    Rating:
                        {Math.round(film.vote_average / 2)}
                    </div>
                </div>
            ))
    }, [filmData])

    if (isFetching) return <Spinner/>

    return (
        <Fragment>
        {
            <div className='ui four doubling stackable cards'>
            {filmList}
            </div>
=======

    useEffect(() => {
        getMovieList();
    }, [])

    const displayMovieList = () => {
        for (let i = 0; i < filmData.films.length; i++){
            console.log(i);
            console.log(filmData.films[i].medium_cover_image);
        }
    }

    const getMovieList = async() => {
        try {
            const filmList = await axios.get('https://yts.mx/api/v2/list_movies.json&sort_by=rating');
            const films = filmList.data.data.movies;
            setfilmData({
                ...filmData,
                films
            });
            displayMovieList();
        }catch (error){
            setIsError(true);
        }
        setIsFetching(false);
    }

    return (
        <Fragment>
            {isFetching === true ? 
            <Spinner/> : 
            <CardMedia
                component="img"
                alt=""
                height="140"
                image={filmData.films[0].medium_cover_image}
            >
            </CardMedia>
>>>>>>> add fetch yts
        }
        </Fragment>
    )
}

<<<<<<< HEAD
export default Search;

//poster path https://image.tmdb.org/t/p/w600_and_h900_bestv2/+path
//poster_path
=======
export default Search;
>>>>>>> add fetch yts
