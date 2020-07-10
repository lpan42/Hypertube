import React, { Fragment, useContext, useEffect, useState , useMemo} from 'react'
import axios from 'axios';
import Spinner from '../layout/Spinner';
/******************** utils ********************/
import TrimInputStr from '../../utils/TrimInputStr'
/******************** style ********************/
import Typography from '@material-ui/core/Typography';
import TodayIcon from '@material-ui/icons/Today';
import StarIcon from '@material-ui/icons/Star';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import Button from '@material-ui/core/Button';
/******************** package ********************/
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import french from '../../languages/fr.json';
import english from '../../languages/en.json';

import MovieContext from '../../contexts/movie/movieContext';

import UserContext from '../../contexts/user/userContext';
import Popover from '@material-ui/core/Popover';
import Slider from '@material-ui/core/Slider';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const Search = () => {
    const movieContext = useContext(MovieContext);
    const userContext = useContext(UserContext);
    const { movies, searchByKeyword, nbpages, loading, fetchpop } = movieContext;
    const { loadUser, user } = userContext;
    const [language, setLanguage] = useState(english);

    const [searchInput, setSearchInput] = useState('');
    const [addwatchLater, setAddWatchLater] = useState('');
    const [removewatchLater,setRemoveWatchLater] = useState('');
    const [genre, setGenre] = useState('');
    const [sortBy, setSortBy] = useState('ImdbRating');
    const [yearrange, setYearrange] = useState([1900, 2020])
    const [ratingrange, setRatingrange] = useState([0, 10])

    const [search, setSearch] = useState(false);

    const [isFetching, setIsFetching] = useState(true);

    const [page, setPage] = useState(1);
    const [suggPop, setSggPop] = useState(true);
    
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
            setLanguage( user && user.data.language === "english" ? english:french)
        }
    }, [user])

    useEffect(() => {
        if (user){
            const watchLaterList = user.data.watchLater;
            setwatchLaterList([...watchLaterList])
        }
    }, [user])

    useEffect(() => {
        if (searchInput !== ''){
            setSortBy('Title');
            setSearch(true);
        }
    }, [searchInput])

    useEffect(() => {
        setPage(1)
    }, [search])

    useEffect(() => {
        if (fetchpop === false){
            setSggPop(false);
            setIsFetching(true);
            searchByKeyword(TrimInputStr(searchInput), genre, yearrange, ratingrange, page, sortBy);
            setIsFetching(false);
            setSearch(false);
        }
    }, [search, page])

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

    const inList = (List, movie) => {
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
        if (movies.length !== 0 && user){
            return movies.map((movie, key) => (
                <div className="card" key={key}>
                    <div className="ui slide masked reveal image" style={{backgroundColor: 'black'}}>
                        <img src={movie.Poster} alt={movie.Title} className="visible content" onError={(e)=>{e.target.onerror = null; e.target.src='/images/No_Picture.jpg'}}/> 
                    <div className="hidden content center aligned">
                        <Typography variant="subtitle2">
                            <span style={{fontSize: 16}}>
                            {movie.Plot}
                            <br/><br/>
                            </span>
                        </Typography>
                    </div>
                    </div>
                    <div className="content">
                        <a className="ui medium header" href={"/movie/" + movie.ImdbId}>{movie.Title}{inList(user.data.watched, movie.ImdbId) ? <img style={{width: '15px',float: 'right'}} alt="watched" src="http://localhost:3000/images/watched.png" /> : null}</a>
                        <div className="meta">
                            <Typography variant="subtitle1"><TodayIcon/><span className="date">{movie.Year}</span></Typography>
                        </div>
                    </div>
                    <div className="extra">
                        <Typography variant="subtitle1"><StarIcon style={{ color: '#fdd835', margin: '0 10 0 0'}}/>{movie.ImdbRating}{inList(watchLaterList, movie.ImdbId) ? 
                                <BookmarkIcon style={{margin: '20 20 0 0', float: 'right', cursor: 'pointer', color: 'red'}} onClick={() => setRemoveWatchLater(movie.ImdbId)}/>
                                : <BookmarkBorderIcon style={{margin: '20 20 0 0', float: 'right', cursor: 'pointer'}} onClick={() => setAddWatchLater(movie.ImdbId)}/>}</Typography>
                    </div>
                </div>
            ))
        }
    }, [movies, watchLaterList, user])

    const checkPage = (page) => {
        if (page > 300){
            return (300);
        }else if (page > nbpages){
            return (nbpages)
        }else{
            return (page)
        }
    }

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
            
            <Popover id={id} open={open} anchorEl={anchorEl} onClose={popoverhandleClose} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} transformOrigin={{vertical: 'top', horizontal: 'center'}}>
                <div style={{width: 200, padding: '1.5em'}}>
                <Typography variant="body2">{language.filter.year} {yearrange[0]} - {yearrange[1]}</Typography>
                <Slider value={yearrange} min={1900} max={2020} step={5}  onChange={(e,settingyearrange)=>{setYearrange(settingyearrange)}}/>
                <Typography variant="body2">{language.filter.rating} {ratingrange[0]} - {ratingrange[1]}</Typography>
                <Slider value={ratingrange} min={0} max={10} step={0.5}  onChange={(e,settingratingrange)=>{setRatingrange(settingratingrange)}}/>
                <div>
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
                        <Button value="History">{language.movietype.History}</Button>
                        <Button value="Horror">{language.movietype.Horror}</Button>
                        <Button value="Music">{language.movietype.Music}</Button>
                        <Button value="Musical">{language.movietype.Musical}</Button>
                        <Button value="Mystery">{language.movietype.Mystery}</Button>
                        <Button value="Romance">{language.movietype.Romance}</Button>
                        <Button value="Sci-Fi">{language.movietype.SciFi}</Button>
                        <Button value="Sport">{language.movietype.Sport}</Button>
                        <Button value="Thriller">{language.movietype.Thriller}</Button>
                        <Button value="War">{language.movietype.War}</Button>
                        <Button value="Western">{language.movietype.Western}</Button>
                    </Select>
                </FormControl>
                </div>
                <div>
                <FormControl stylr={{float: 'right', backgroundColor: 'white', margin: '2em'}}>
                    <Select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                        <Button value="ImdbRating">{language.sortby.ImdbRating}</Button>
                        <Button value="Title">{language.sortby.Title}</Button>
                        <Button value="DateAsc">{language.sortby.DateAsc}</Button>
                        <Button value="DateDsc">{language.sortby.DateDsc}</Button>
                    </Select>
                </FormControl>
                </div>
                </div>
                <Button color={'primary'} style={{float: 'right'}} onClick={e => {setSearch(true);popoverhandleClose()}}>Submit</Button>
            </Popover>
            <div className="ui divider" style={{margin: '0em 0em 3em 0em'}}></div>
            <div className="ui centered grid">

            {loading === true ? <Spinner/> :
                <div className='ui doubling stackable cards'>
                    {filmList}
                </div>
            }
            {suggPop || checkPage(page) === nbpages ? null :
            <div>
            <ArrowDownwardIcon style={{margin: '2em'}} onClick={() => setPage(checkPage(page + 1))}/>
            </div>}

            </div>
        </Fragment>
    )
}

export default Search;