import React, { useContext, useEffect, useState, Fragment } from 'react'
import UserContext from '../../contexts/user/userContext';
import setAuthToken from '../../utils/setAuthToken';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TodayIcon from '@material-ui/icons/Today';
import LanguageIcon from '@material-ui/icons/Language';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Spinner from '../layout/Spinner';
import Divider from '@material-ui/core/Divider';
import EN from '../../languages/en.json';
import FR from '../../languages/fr.json';
import Comments from './Comments';

const useStyles = makeStyles(theme => ({
    movieInfo:{
        width:"100%",
        maxHeight:"75vh",
        margin: "0",
        display:"flex",
        flexDirection: "row",
        justifyContent:"center",
        alignContent:"center",
        backgroundColor: fade("#FFFFFF", 0.1),
    },

    poster: {
        height: "auto",
        width:"40vw",
        objectFit: "scale-down",
        // borderRadius: "8px",
    },
    movieContent: {
        margin:"10px",
        display:"flex",
        overflow: "auto",
        flexDirection: "column",
        justifyContent:"flex-start",

    },
    iconsDiv: {
        display:"flex",
        flexDirection: "raw",
        justifyContent: "flex-start",
        alignItems:"baseline",
    },
    dividerColor: {
        backgroundColor: theme.palette.primary.main,
    },
  }));

  const MyTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.main,
      boxShadow: theme.shadows[1],
      fontSize: 12,
    }, 
  }))(Tooltip);

const Movie = ({ match }) => {
    const userContext = useContext(UserContext);

    const {loadUser, user,token} = userContext;
    const history = useHistory();
    const classes = useStyles();

    const [lang, setLang] = useState(null);
    const [movieInfo, setMovieInfo] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [invalidId, setInvalidId] = useState("");

    const getMoiveInfo = async (imdb_id) => {
        try{
            let langPrefer = '';
            if(user && user.data.language === "english") langPrefer = "en";
            else langPrefer = "fr"; 
            const result =  await axios.get(`/movie/${imdb_id}&${langPrefer}`);
            setMovieInfo(result.data.data);
            setLoading(false);
        }catch(err){
            setError(err.response.data.error);
            setInvalidId("Invalid IMDbId");
            setLoading(false);
        }
    }
    
    useEffect(() => {
        loadUser();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(user){
            setLang( user && user.data.language === "english" ? EN:FR)
            getMoiveInfo(match.params.imdb_id);
        }
        //eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        if(error) {
            toast.error(error);
            setError('');
        }
        if(success) {
          toast.success(success);
          setSuccess('');
        }
        //eslint-disable-next-line
    },[error, success]);

    const addWatchLater = async() => {
        setAuthToken(localStorage.token);
        try{
            const result =  await axios.post(`/movie/watchlater/add/${match.params.imdb_id}`);
            setSuccess(result.data.success);
            loadUser();
        }catch(err){
            setError(err.response.data.error);
        }
    }

    const removeWatchLater = async() => {
        setAuthToken(localStorage.token);
        try{
            const result =  await axios.post(`/movie/watchlater/remove/${match.params.imdb_id}`);
            setSuccess(result.data.success);
            loadUser();
        }catch(err){
            setError(err.response.data.error);
        }
    }

    if (loading) return <Spinner />;
    
    const watchLaterBtn = () => {
        if(user && user.data.watchLater){
            for(const key in user.data.watchLater){
                if(user.data.watchLater[key].ImdbID === match.params.imdb_id){
                    return (
                        <MyTooltip title={lang.movie.removefromwatchlater}>
                            <BookmarkIcon color="primary" onClick={removeWatchLater}/>
                        </MyTooltip>
                    )
                }
            }
            return(
                <MyTooltip title={lang.movie.addtowatchlater}>
                    <BookmarkBorderIcon color="primary" onClick={addWatchLater}/>
                </MyTooltip>
            )
        }
    }
    const moviePage = (
        <Fragment>
            <div>player</div>
            <div className={classes.movieInfo}>
                <img className={classes.poster} src={movieInfo.Poster} />
                <div className={classes.movieContent}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <Typography variant="h4" component="p" color="primary">{movieInfo.Title} ({movieInfo.Year})</Typography>
                        {watchLaterBtn()}
                    </div>
                    <Typography variant="subtitle2" >
                        <Box fontStyle="italic" color="secondary.light">
                            {movieInfo.Tagline}
                        </Box>
                    </Typography>
                    <br></br>
                    <div className={classes.iconsDiv}>
                        <Typography variant="subtitle2">
                                {movieInfo.Rated}
                            <TodayIcon />
                                {movieInfo.Released}
                            <AccessTimeIcon />
                                {movieInfo.Runtime}
                            <LanguageIcon />
                                {movieInfo.Language}
                        </Typography>
                    </div>
                    <Typography variant="subtitle2">Genre: {movieInfo.Genre}</Typography>
                    <Typography variant="subtitle2">{lang.movie.imdbrating}: {movieInfo.ImdbRating} / 10</Typography>
                    <Typography variant="subtitle2">{lang.movie.country}: {movieInfo.Country}</Typography>
                    <Typography variant="subtitle2">{lang.movie.director}: {movieInfo.Director}</Typography>
                    <Typography variant="subtitle2">{lang.movie.actors}: {movieInfo.Actors}</Typography>
                    <br></br>
                    <Typography variant="subtitle2">{lang.movie.overview}:</Typography>
                    <Typography variant="subtitle2">
                    {movieInfo.Plot}
                    </Typography>
                </div>
            </div>
            <Divider classes={{root: classes.dividerColor}}/>
            <Comments language={lang} imdbId={match.params.imdb_id}/>
        </Fragment>
    )

    return (
        <div>
        {invalidId ? 
            <Typography>{invalidId}</Typography> : 
            moviePage
        }
        </div>
    )
}

export default Movie
