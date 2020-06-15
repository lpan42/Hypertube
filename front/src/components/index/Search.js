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
import Button from '@material-ui/core/Button';
/******************** package ********************/
import { toast } from 'react-toastify';

import fr from '../../languages/fr.json';
import en from '../../languages/en.json';

import MovieContext from '../../contexts/movie/movieContext';
import UserState from '../../contexts/user/UserState';


const Search = () => {
    const [language, setLanguage] = useState(en);
    const [searchInput, setSearchInput] = useState('');
    const [watchLater, setWatchLater] = useState('');
    const [genre, setGenre] = useState('');
    const [success, setSuccess] = useState('');
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState(false);

    const movieContext = useContext(MovieContext);
    const { fetchmovie, movies, loading, searchByKeyword } = movieContext;

    const [referenceNode, setReferenceNode] = useState();
    const [pages, setPages] = useState(1)

    useEffect(() => {
        fetchmovie(pages)
        setIsFetching(false);
    }, [pages])

    useEffect(() => {
        const setQuery = (searchInput) => {
            const searchMovieTrimmed = TrimInputStr(searchInput);
            if (searchMovieTrimmed == '' || !searchMovieTrimmed.replace(/\s/g, '').length){
                return (false)
            }
            return (searchMovieTrimmed);
        }
        if (setQuery(searchInput)){
            setIsFetching(true);
            searchByKeyword(setQuery(searchInput), pages);
        }
        setIsFetching(false);
    }, [searchInput])

    const handleScroll = (event) => {
        var node = event.target;
        const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
        if (bottom) {
            setPages(pages + 1);
        }
    }

    const paneDidMount = (node) => {
        if (node) {
            node.addEventListener('scroll', handleScroll);
            setReferenceNode(node);
        }
    };

    const filmList = useMemo(() => {
        if (movies.length !== 0){
            return movies.data.map((movie, key) => (
                <div className="card" key={key}>
                    <div className="ui slide masked reveal image" style={{backgroundColor: 'black'}}>
                        <img src={movie.Poster} className="visible content"/>
                        <div className="hidden content center aligned">
                            <Typography variant="subtitle2">
                                <span style={{fontSize: 16}}>
                                <BookmarkBorderIcon style={{margin: '20 20 0 0', float: 'right'}} onClick={() => setWatchLater(movie.id)}/>
                                <br/><br/>
                                </span>
                            </Typography>
                        </div>
                    </div>
                    <div className="content">
                        <div className="ui medium header">{movie.Title}</div>
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
    }, [movies])

    return (
        <Fragment>
            <div className="ui search">
                <div className="ui icon input"></div>
                <input className="prompt" type="text" placeholder={language.filter.search} onChange={e => setSearchInput(e.target.value)}/>
                <i className="search icon"></i>
            </div>
            <div className="ui divider" style={{margin: '3em'}}></div>
            <div className="ui centered grid"  ref={paneDidMount} style={{overflowY: 'scroll', maxHeight: '1200px'}}>
            {isFetching ? <Spinner/> :
                <div className='ui six doubling stackable cards'>
                    {filmList}
                </div>
            }
            </div>
        </Fragment>
    )
}

//scrollintoview scroll-into-view-if-needed !! load more movies when scroll down

export default Search;

    // useEffect(() => {
    //     if(error) {
    //         toast.error(error);
    //         setError('');
    //     }
    //     if(success) {
    //         toast.success(success);
    //         setSuccess('');
    //     }
    // }, [success, error])
    
    // useEffect(() => {
    //     const getIMDBUrl = () => {
    //         return 'https://cors-anywhere.herokuapp.com/api.themoviedb.org/3/movie/' + watchLater + '/external_ids?api_key=' + moviedbAPI_KEY;
    //     } 
    //             //temporarily add cors anywhere to resolve cors problem
    //     const addWatchLater = async() => {
    //         const url = getIMDBUrl(watchLater);
    //         await axios(url)
    //             .then(res => {
    //                 if (res.status === 200){
    //                     const imdbid = res.data.imdb_id;
    //                     setAddfilmID(imdbid);
    //                 }else{
    //                     setError(true);
    //                 }
    //             })
    //             .catch ((err) => {
    //                 setError(true);
    //             })
    //         console.log('addWatchLater');
    //     }

    //     if (watchLater){
    //         addWatchLater();
    //     }
    // }, [watchLater])

    // useEffect(() => {
    //     const addToWatchLater = async() => {
    //         try {
    //             const result = await axios.post(`/movie/watchlater/add/${addfilmID}`)
    //             setSuccess(result.data.success);
    //         } catch (error) {
    //             setError(error.response.data.error);
    //         }
    //     }
    //     if (addfilmID){
    //         addToWatchLater();
    //     }
    //     console.log('addfilmID')
    // }, [addfilmID])

    // const filmList = useMemo(() => {
    //     return filmData.films.map((movie, key) => (
    //         <div className="card" key={key}>
    //             <div className="ui slide masked reveal image" style={{backgroundColor: 'black'}}>
    //                 <img src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movie.poster_path} className="visible content"/>
    //                 <div className="hidden content center aligned">
    //                     <Typography variant="subtitle2">
    //                         <span style={{fontSize: 16}}>
    //                         <BookmarkBorderIcon style={{margin: '20 20 0 0', float: 'right'}} onClick={() => setWatchLater(movie.id)}/>
    //                         <br/><br/>{movie.overview.split(' ').slice(0, 30).join(' ') + ' ......'}
    //                         </span>
    //                     </Typography>
    //                 </div>
    //             </div>
    //             <div className="content">
    //                 <div className="ui medium header">{movie.original_title}</div>
    //                 <div className="meta">
    //                     <Typography variant="subtitle1"><TodayIcon/><span className="date">{movie.release_date}</span></Typography>
    //                 </div>
    //             </div>
    //             <div className="extra">
    //                 <Typography variant="subtitle1"><StarIcon style={{ color: '#fdd835', margin: '0 10 0 0'}}/>{movie.vote_average}</Typography>
    //             </div>
    //         </div>
    //         ))
    // }, [filmData])

    // const setQuery = (filmSearch) => {
    //     const filmSearchTrimmed = TrimInputStr(filmSearch);
    //     if (filmSearchTrimmed == '' || !filmSearchTrimmed.replace(/\s/g, '').length){
    //         return ('discover/movie/?api_key=' + moviedbAPI_KEY)
    //     }
    //     return 'search/movie/?api_key=' + moviedbAPI_KEY + '&query=' + filmSearchTrimmed;
    // }