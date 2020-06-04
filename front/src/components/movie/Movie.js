import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../contexts/user/userContext';
import setAuthToken from '../../utils/setAuthToken';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TodayIcon from '@material-ui/icons/Today';
import LanguageIcon from '@material-ui/icons/Language';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Spinner from '../layout/Spinner';
import EN from '../../languages/en.json';
import FR from '../../languages/fr.json';

const useStyles = makeStyles(theme => ({
    movieInfo:{
        width:"100%",
        maxHeight:"70vh",
        margin: "0",
        display:"flex",
        flexDirection: "row",
        justifyContent:"center",
        alignContent:"center",
        backgroundColor: fade("#FFFFFF", 0.2),
        // backgroundImage: `https://image.tmdb.org/t/p/orginal/${movieInfo.backdrop_path}`,
        // backgroundPosition: 'center',
        // backgroundSize: 'cover',
        // backgroundRepeat: 'no-repeat',
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
        flexDirection: "column",
        justifyContent:"flex-start",
        // alignContent:"center",
        // alignItems:"center",
    }
  }));

const Movie = ({ match }) => {
    const userContext = useContext(UserContext);

    const {loadUser, user,token} = userContext;
    const history = useHistory();
    const classes = useStyles();

    const [lang, setLang] = useState( user && user.data.language ==="english"? EN:FR);
    const [movieInfo, setMovieInfo] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    // console.log(match.params.imdb_id)

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
            setLoading(false);
        }
    }
    useEffect(() => {
        loadUser();
        // getMoiveInfo(match.params.imdb_id);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(user)
            getMoiveInfo(match.params.imdb_id);
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

    if (loading) return <Spinner />;

    return (
        <div>
            <div>player</div>
            <div className={classes.movieInfo}>
                <img className={classes.poster} src={movieInfo.Poster} />
                <div className={classes.movieContent}>
                    <Typography variant="h4" component="p">{movieInfo.Title} ({movieInfo.Year})</Typography>
                    <Typography variant="subtitle1">{movieInfo.Genre}</Typography>
                    <Typography variant="subtitle1">
                        {movieInfo.Rated}
                        <TodayIcon />
                            {moment(movieInfo.Released).format('DD/MM/YYYY')}
                        <AccessTimeIcon />
                            {movieInfo.Runtime}
                        <LanguageIcon />
                            {movieInfo.Language}
                    </Typography>
                    <Typography variant="subtitle1">IMDb Rating: {movieInfo.imdbRating} / 10</Typography>
                    <Typography variant="subtitle1">Countries: {movieInfo.Country} / 10</Typography>
                    <Typography variant="subtitle1">Director: {movieInfo.Director}</Typography>
                    <Typography variant="subtitle1">Writers: {movieInfo.Writer}</Typography>
                    <Typography variant="subtitle1">Actors: {movieInfo.Actors}</Typography>
                    <br></br>
                    <Typography variant="h6">Overview:</Typography>
                    <Typography variant="subtitle1">
                      {movieInfo.Plot}
                    </Typography>
                   
                </div>
            </div>
            <div>comments</div>

        </div>
    )
}

export default Movie
