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
import Popover from '@material-ui/core/Popover';
import Slider from '@material-ui/core/Slider';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import LastPageIcon from '@material-ui/icons/LastPage';

const Search = () => {
    const movieContext = useContext(MovieContext);
    const userContext = useContext(UserContext);
    const { movies, loading, searchByKeyword } = movieContext;
    const { loadUser, user } = userContext;
    const [language, setLanguage] = useState(en);

    const [searchInput, setSearchInput] = useState('');
    const [addwatchLater, setAddWatchLater] = useState('');
    const [removewatchLater,setRemoveWatchLater] = useState('');
    const [genre, setGenre] = useState('');
    const [sortBy, setSortBy] = useState('ImdbRating');
    const [yearrange, setYearrange] = useState([1900, 2020])
    const [ratingrange, setRatingrange] = useState([0, 10])

    const [search, setSearch] = useState(false);

    const [success, setSuccess] = useState('');
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState(false);

    const [page, setPage] = useState(1);
    
    const [watchLaterList, setwatchLaterList] = useState([])

    const [anchorEl, setAnchorEl] = React.useState(null);
    const popoverhandleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const popoverhandleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        if (user){
            const watchLaterList = user.data.watchLater;
            setwatchLaterList([...watchLaterList])
        }
    }, [user])

    useEffect(() => {
        if (searchInput !== ''){
            setSortBy('Title');
        }else{
            setSortBy('ImdbRating')
        }
        setSearch(true);
    }, [searchInput])

    useEffect(() => {
        setPage(1)
    }, [search])

    useEffect(() => {
        setIsFetching(true);
        searchByKeyword(TrimInputStr(searchInput), genre, yearrange, ratingrange, page, sortBy);
        setIsFetching(false);
        setSearch(false);
    }, [search, page])

    // useEffect(() => {
    //     setPage(1);
    //     setSearch(true);
    // }, [searchInput, genre, yearrange, ratingrange, sortBy])

    const addWatchLaterList = async() => {
        await axios.post(`/movie/watchlater/add/${addwatchLater}`);
        setAddWatchLater('');
        loadUser()
    }

    useEffect(() => {
        if (addwatchLater !== '' ){
            addWatchLaterList();
        }
    }, [addwatchLater])

    const removeWatchLaterList = async() => {
        await axios.post(`/movie/watchlater/remove/${removewatchLater}`);
        setRemoveWatchLater('');
        loadUser()
    }

    useEffect(()=> {
        if (removewatchLater !== ''){
            removeWatchLaterList();
        }
    }, [removewatchLater])

    const inWatchLaterList = (List, movie) => {
        if ( List ){
            for (let i = 0; i < List.length; i++){
                if (List[i].ImdbID === movie){
                    return (true)
                }
            }
        }
        return (false)
    }

    const filmList = useMemo(() => {
        if (movies.length !== 0){
            return movies.data.map((movie, key) => (
                <div className="card" key={key}>
                    <div className="ui slide masked reveal image" style={{backgroundColor: 'black'}}>
                        <img src={movie.Poster} className="visible content" onError={(e)=>{e.target.onerror = null; e.target.src='/images/No_Picture.jpg'}}/> 
                        <div className="hidden content center aligned">
                            <Typography variant="subtitle2">
                                <span style={{fontSize: 16}}>
                                {inWatchLaterList(watchLaterList, movie.ImdbId) ? 
                                    <BookmarkIcon style={{margin: '20 20 0 0', float: 'right', cursor: 'pointer', color: 'red'}} onClick={() => setRemoveWatchLater(movie.ImdbId)}/>
                                    : <BookmarkBorderIcon style={{margin: '20 20 0 0', float: 'right', cursor: 'pointer'}} onClick={() => setAddWatchLater(movie.ImdbId)}/>}
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
    }, [movies, watchLaterList])

    const checkPage = (page) => {
        if (page - 1 < 1){
            return (1);
            //alert ?: first page already
        // }else if (page + 1 > (17750 / 30)){
        }else{
            return (page)
        }
    }
    console.log(movies)
    return (
        <Fragment>
            <div className="ui search">
                <div className="ui icon input"></div>
                <input className="prompt" type="text" placeholder={language.filter.search} onChange={e => setSearchInput(e.target.value)}/>
                <i className="search icon"></i>
            </div>
            <Button aria-describedby={id} variant="contained" style={{float: 'right'}} onClick={popoverhandleClick}>
                {language.filter.filter}
            </Button>
            <FirstPageIcon style={{margin: '2em 0.5em', cursor: 'pointer'}} onClick={() => {setPage(1)}}/>
            <NavigateBeforeIcon style={{margin: '2em 0.5em', cursor: 'pointer'}}onClick={() => setPage(checkPage(page - 1))}/>
            <NavigateNextIcon style={{margin: '2em 0.5em', cursor: 'pointer'}}onClick={() => setPage(checkPage(page + 1))}/>
            <LastPageIcon style={{margin: '2em 0.5em', cursor: 'pointer' }}/>
            <Popover id={id} open={open} anchorEl={anchorEl} onClose={popoverhandleClose} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} transformOrigin={{vertical: 'top', horizontal: 'center'}}>
                <div style={{width: 200, padding: '1.5em'}}>
                <Typography variant="body2">{language.filter.year} {yearrange[0]} - {yearrange[1]}</Typography>
                <Slider value={yearrange} min={1900} max={2020} step={5}  onChange={(e,settingyearrange)=>{setYearrange(settingyearrange)}}/>
                <Typography variant="body2">{language.filter.rating} {ratingrange[0]} - {ratingrange[1]}</Typography>
                <Slider value={ratingrange} min={0} max={10} step={0.5}  onChange={(e,settingratingrange)=>{setRatingrange(settingratingrange)}}/>
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
                        <Button value="Thriller">{language.movietype.Thriller}</Button>
                        <Button value="War">{language.movietype.War}</Button>
                        <Button value="Western">{language.movietype.Western}</Button>
                    </Select>
                </FormControl>
                <FormControl stylr={{float: 'left', backgroundColor: 'white', margin: '2em'}}>
                    <Select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                        <Button value="ImdbRating">{language.sortby.ImdbRating}</Button>
                        <Button value="Title">{language.sortby.Title}</Button>
                        <Button value="DateAsc">{language.sortby.DateAsc}</Button>
                        <Button value="DateDsc">{language.sortby.DateDsc}</Button>
                    </Select>
                </FormControl>
                </div>
                <Button color={'primary'} style={{float: 'right'}} onClick={e => setSearch(true)}>Submit</Button>
            </Popover>
            <div className="ui divider" style={{margin: '0em 0em 3em 0em'}}></div>
            <div className="ui centered grid">
            {isFetching ? <Spinner/> :
                <div className='ui doubling stackable cards'>
                    {filmList}
                </div>
            }
            </div>
        </Fragment>
    )
}

export default Search;