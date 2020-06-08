<<<<<<< HEAD
import React, { Fragment, useContext, useEffect, useState , useMemo} from 'react'
import axios from 'axios';
import Spinner from '../layout/Spinner';
import {moviedbAPI_KEY} from '../moviedbAPI_KEY';
<<<<<<< HEAD
=======
import React, { Fragment, useContext, useEffect, useState } from 'react'
import axios from 'axios';
import Spinner from '../layout/Spinner';
import CardMedia from '@material-ui/core/CardMedia';
>>>>>>> add fetch yts
=======
import TrimInputStr from '../../utils/TrimInputStr'
>>>>>>> add language, modify ui

const Search = () => {
    const [isFetching, setIsFetching] = useState(true);
    const [isError, setIsError] = useState(false);
    const [language, setLanguage] = useState('en');
    const [filmData, setfilmData] = useState({films: []});
<<<<<<< HEAD
<<<<<<< HEAD
    const [searchInput, setSearchInput] = useState('movie');
=======
    const [searchInput, setSearchInput] = useState('discover/movie/?api_key=' + moviedbAPI_KEY + '&language=' + language);
    const [mouseHover, setMouseHover] = useState({mouseOn: false, filmKey: null});
>>>>>>> add language, modify ui

    useEffect(() => {
        function getFetchUrl(){
            return 'https://api.themoviedb.org/3/' + searchInput;
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
        }

        getData();
    }, [searchInput])


    const filmList = useMemo(() => {
        return filmData.films.map((film, key) => (
                <div className="card" key={key} style={{boxShadow: 'none'}}>
                    <div className="ui slide masked reveal image" style={{backgroundColor: 'black'}}>
                        <img src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + film.poster_path} className="visible content"/>
                        <div className="hidden content center aligned" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                            <span style={{padding: '2' ,fontFamily: 'Montserrat, sans-serif', fontSize: 16}}>{film.overview.split(' ').slice(0, 30).join(' ') + ' ......'}</span><br/>
                        </div>
                    </div>
                    <div className="content">
                        <div className="ui medium header">{film.original_title}</div>
                        <div className="meta">
                            <span className="date">{film.release_date}</span>
                        </div>
                    </div>
                    <div className="extra">
                        Rating:{film.vote_average}
                    </div>
                </div>
            ))
    }, [filmData])

    const setQuery = (filmSearch) => {
        const filmSearchTrimmed = TrimInputStr(filmSearch);
        console.log(filmSearchTrimmed)
        if (filmSearchTrimmed == '' || !filmSearchTrimmed.replace(/\s/g, '').length){
            return ('discover/movie/?api_key=' + moviedbAPI_KEY)
        }
        return 'search/movie/?api_key=' + moviedbAPI_KEY + '&query=' + filmSearchTrimmed;
    }

    if (isFetching) return <Spinner/>

    return (
        <Fragment>
            <div className="ui search">
                <div className="ui icon input"></div>
                <input className="prompt" type="text" placeholder="Search..." onChange={e => setSearchInput(setQuery(e.target.value))}/>
                <i className="search icon"></i>
            </div>
            <div className="ui divider" style={{margin: '3em'}}></div>
            <div class="ui centered grid">
        {
            <div className='ui six doubling stackable cards'>
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
            </div>
        </Fragment>
    )
}

<<<<<<< HEAD
<<<<<<< HEAD
export default Search;

//poster path https://image.tmdb.org/t/p/w600_and_h900_bestv2/+path
//poster_path
=======
export default Search;
>>>>>>> add fetch yts
=======
export default Search;

//language --- &language=en-US after key
>>>>>>> add language, modify ui
