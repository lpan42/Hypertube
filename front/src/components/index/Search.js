import React, { Fragment, useContext, useEffect, useState } from 'react'
import axios from 'axios';
import Spinner from '../layout/Spinner';
import CardMedia from '@material-ui/core/CardMedia';

const Search = () => {
    const [isFetching, setIsFetching] = useState(true);
    const [isError, setIsError] = useState(false);
    const [filmData, setfilmData] = useState({films: []});

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
        }
        </Fragment>
    )
}

export default Search;