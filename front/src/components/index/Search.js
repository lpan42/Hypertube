import React, { Fragment, useContext, useEffect, useState , useMemo, useRef} from 'react'
import axios from 'axios';
import Spinner from '../layout/Spinner';
/******************** utils ********************/
import {moviedbAPI_KEY} from '../moviedbAPI_KEY';
import TrimInputStr from '../../utils/TrimInputStr'
/******************** style ********************/
import Typography from '@material-ui/core/Typography';
import TodayIcon from '@material-ui/icons/Today';
import StarIcon from '@material-ui/icons/Star';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import Button from '@material-ui/core/Button';
/******************** package ********************/
import { toast } from 'react-toastify';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import fr from '../../languages/fr.json';
import en from '../../languages/en.json';

import MovieContext from '../../contexts/movie/movieContext';
import UserState from '../../contexts/user/UserState';

import UserContext from '../../contexts/user/userContext';

const Search = () => {
    const movieContext = useContext(MovieContext);
    const userContext = useContext(UserContext);
    const { fetchmovie, movies, loading, searchByKeyword } = movieContext;
    const { watchLater, loadUser } = userContext;
    const [language, setLanguage] = useState(en);
    const [searchInput, setSearchInput] = useState('');
    const [addwatchLater, setAddWatchLater] = useState('');
    const [genre, setGenre] = useState('');
    const [success, setSuccess] = useState('');
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState(false);


    useEffect(() => {
        fetchmovie()
        setIsFetching(false);
    }, [])

    useEffect(() => {
        const setQuery = (searchInput) => {
            const searchMovieTrimmed = TrimInputStr(searchInput);
            return (searchMovieTrimmed);
        }
        
        if (TrimInputStr(searchInput) || genre.length !== 0){
            setIsFetching(true);
            searchByKeyword(TrimInputStr(searchInput), genre);
        }else{
            fetchmovie()
        }

        setIsFetching(false);
    }, [searchInput, genre])

    useEffect(()=> {
        const addWatchLaterList = async() => {
            const result = await axios.post(`/movie/watchlater/add/${addwatchLater}`);
        }
        if (addwatchLater.length !== 0 ){
            addWatchLaterList();
        }
        setAddWatchLater('');
    }, [addwatchLater])

    useEffect(() =>{
        loadUser();
    }, [watchLater])

    const filmList = useMemo(() => {
        if (movies.length !== 0){
            return movies.data.map((movie, key) => (
                <div className="card" key={key}>
                    <div className="ui slide masked reveal image" style={{backgroundColor: 'black'}}>
                        <img src={movie.Poster} className="visible content"/>
                        <div className="hidden content center aligned">
                            <Typography variant="subtitle2">
                                <span style={{fontSize: 16}}>
                                <BookmarkBorderIcon style={{margin: '20 20 0 0', float: 'right', cursor: 'pointer'}} onClick={() => setAddWatchLater(movie.ImdbId)}/>
                                {movie.Plot}
                                <br/><br/>
                                </span>
                            </Typography>
                        </div>
                    </div>
                    <div className="content">
                        <a className="ui medium header" href={"/movie/" + movie.ImdbId}>{movie.Title}</a>
                        <div className="meta">
                            <Typography variant="subtitle1"><TodayIcon/><span className="date">{movie.Year}</span></Typography>
                        </div>
                    </div>
                    <div className="extra">
                        <Typography variant="subtitle1"><StarIcon style={{ color: '#fdd835', margin: '0 10 0 0'}}/>{movie.ImdbRating}</Typography>
                    </div>
                </div>
            ))
        }
    }, [movies, genre])

    return (
        <Fragment>
            <div className="ui search">
                <div className="ui icon input"></div>
                <input className="prompt" type="text" placeholder={language.filter.search} onChange={e => setSearchInput(e.target.value)}/>
                <i className="search icon"></i>
            </div>
            <FormControl style={{float: 'right', backgroundColor: 'white', margin: '2em'}}>
                <Select value={genre} onChange={e=>setGenre(e.target.value)}>
                    <Button value="">{language.movietype.All}</Button>
                    <Button value="Action">{language.movietype.Action}</Button>
                    <Button value="Adventure">{language.movietype.Adventure}</Button>
                    <Button value="Animation">{language.movietype.Animation}</Button>
                    <Button value="Biography">{language.movietype.Biography}</Button>
                    <Button value="Comedy">{language.movietype.Comedy}</Button>
                    <Button value="Crime">{language.movietype.Crime}</Button>
                    <Button value="Documentary">{language.movietype.Documentary}</Button>
                    <Button value="Drama">{language.movietype.Drama}</Button>
                    <Button value="Family">{language.movietype.Family}</Button>
                    <Button value="Fantasy">{language.movietype.Fantasy}</Button>
                    <Button value="Filmnoir">{language.movietype.FilmNoir}</Button>
                    <Button value="History">{language.movietype.History}</Button>
                    <Button value="Horror">{language.movietype.Horror}</Button>
                    <Button value="Music">{language.movietype.Music}</Button>
                    <Button value="Musical">{language.movietype.Musical}</Button>
                    <Button value="Mystery">{language.movietype.Mystery}</Button>
                    <Button value="Romance">{language.movietype.Romance}</Button>
                    <Button value="Scifi">{language.movietype.SciFi}</Button>
                    <Button value="Shortfilm">{language.movietype.ShortFilm}</Button>
                    <Button value="Sport">{language.movietype.Sport}</Button>
                    <Button value="Superhero">{language.movietype.Superhero}</Button>
                    <Button value="Thriller">{language.movietype.Thriller}</Button>
                    <Button value="War">{language.movietype.War}</Button>
                    <Button value="Western">{language.movietype.Western}</Button>
                </Select>
            </FormControl>
            <div className="ui divider" style={{margin: '3em'}}></div>
            <div className="ui centered grid">
            {isFetching ? <Spinner/> :
                <div className='ui six doubling stackable cards'>
                    {filmList}
                </div>
            }
            </div>
        </Fragment>
    )
}

export default Search;