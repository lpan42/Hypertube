import React, { useContext, useEffect, useState, useRef } from 'react'
import UserContext from '../../contexts/user/userContext';
import setAuthToken from '../../utils/setAuthToken';
import axios from 'axios';
import {
    Player,
    ControlBar,
    ReplayControl,
    ForwardControl,
    // CurrentTimeDisplay,
    // TimeDivider,
    PlaybackRateMenuButton,
    VolumeMenuButton
  } from 'video-react';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Spinner from '../layout/Spinner';
import Divider from '@material-ui/core/Divider';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import EN from '../../languages/en.json';
import FR from '../../languages/fr.json';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';


const useStyles = makeStyles(theme => ({
    palyerDiv: {
        border:"2px solid red",
    }
  }));

const MoviePlayer = ({ imdb_id }) => {
    const userContext = useContext(UserContext);

    const { loadUser, user } = userContext;
    const [lang, setLang] = useState( user && user.data.language ==="english"? EN:FR);
    const [singleMovie, setSingleMovie] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [videoSrc, setVideoSrc] = useState('');
    const [subSrc, setSubSrc] = useState('');
    const [currentSub, setCurrentSub] = useState('');
    const [currentMovie, setCurrentMovie] = useState('');
    const [openMovie, setOpenMovie] = useState(false);
    const [openSub, setOpenSub] = useState(false);
    const [subPath, setSubPath] = useState('');//all sub path
    const classes = useStyles();

    const torrentSelection = [];

    const chooseMovie = useRef(null);
    const chooseSub = useRef(null);

    const handleMovieToggle = () => {
        setOpenMovie(true);
    };
    const handleSubToggle = () => {
        setOpenSub(true);
    };
    const handleSubClose = () => {
        setOpenSub(false);
    };
    const handleMovieClose = () => {
        setOpenMovie(false);
    };
    
    const getSingleMovie = async () => {
        setAuthToken(localStorage.token);
        try{
            const result =  await axios.get(`/movie/single/${imdb_id}`);
            setSingleMovie(result.data.data);
        }catch(err){
            setError(err.response.data.error);
        }
    }
    const setSub = () => {
        if(user.data.language === "english"){
            if(subPath.en !== null) setCurrentSub("English");
            else setCurrentSub("No subtitle");
        }
       else{
        if(subPath.fr !== null) setCurrentSub("Français");
        else setCurrentSub("English");
       }
    }

    const getSubtitle = async () => {
        setAuthToken(localStorage.token);
        try{
            const result =  await axios.get(`/movie/subtitle/${imdb_id}`);
            setSubPath(result.data.data);
        }catch(err){
            setError(err.response.data.error);
        }
    }
    useEffect(() => {
        getSingleMovie();
        getSubtitle();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
       if(subPath) setSub();
        //eslint-disable-next-line
    }, [subPath]);

    useEffect(()=> {
       
        if(currentSub === "English")
            setSubSrc(subPath.en);
        if(currentSub === "Français")
            setSubSrc(subPath.fr);
        if(currentSub === "No subtitle")
            setSubSrc('');
        //eslint-disable-next-line
    },[currentSub])
    // 
    useEffect(()=> {
        if(error){
            alert(error);
            setError('')
        }
    },[error]);

    const selectTorrent = async (e) => {
        setCurrentMovie(
            singleMovie.Torrents[e.currentTarget.value].quality + " " + 
            singleMovie.Torrents[e.currentTarget.value].provider
        );
        setVideoSrc(`http://localhost:8000/movie/stream/${imdb_id}&${singleMovie.Torrents[e.currentTarget.value].provider}&${singleMovie.Torrents[e.currentTarget.value].quality}`)
        handleMovieClose()
    }  
    
    const selectSub = (e) => {
        //en
        if(e.currentTarget.value === 1){
            setCurrentSub("English");
        }
        //fr
        if(e.currentTarget.value === 2){
            setCurrentSub("Français");
        }
        //no
        if(e.currentTarget.value === 0){
            setCurrentSub("No subtitle");
        }
        handleSubClose();
    }
    const OnPlay = async () =>{
        if(videoSrc){
            setAuthToken(localStorage.token);
            try{
                await axios.post(`/movie/watched/add/${imdb_id}`);
            }catch(err){
                setError(err.response.data.error);
            }
        }
    }

    singleMovie && singleMovie.Torrents.map((torrent,key) => {
        torrentSelection.push(
            <MenuItem key={key} value={key} onClick={e=>selectTorrent(e)}>{torrent.quality}{torrent.provider}</MenuItem>
        )
    })
    console.log(singleMovie.Poster)
    
    const player = (
        <div className={classes.palyerDiv}>
            <Player 
                poster={singleMovie.Poster} 
                preload="auto" 
                src={videoSrc} 
                onPlay={OnPlay}
            >
                <track label={currentSub} kind="subtitles" src={subSrc} default></track>
            <ControlBar>
                <ReplayControl seconds={10} order={1.1} />
                <ForwardControl seconds={10} order={1.2} />
                <PlaybackRateMenuButton rates={[10,5,2, 1.25, 1, 0.5]} order={7.1} />
                <VolumeMenuButton disabled />
            </ControlBar>
            </Player>
        </div>
       
    )
    return (
        <div>
            {/* { videoSrc ? player : null } */}
            {player}
            <Button ref={chooseSub} onClick={handleSubToggle} 
                variant="contained" color="primary" style={{float:"right", margin:"10px"}}
            >
              {currentSub ? "Subtitle: " + currentSub : "Choose a Subtitle"}
            </Button>
            <Popper open={openSub} anchorEl={chooseSub.current} >
                <Paper >
                    <ClickAwayListener onClickAway={handleSubClose}>
                        <MenuList autoFocusItem={openSub}>
                            {subPath.en === null ? null : <MenuItem value="1" onClick={e=>selectSub(e)}>English</MenuItem>}
                            {subPath.fr === null ? null : <MenuItem value='2' onClick={e=>selectSub(e)}>Français</MenuItem>}
                            <MenuItem value='0' onClick={e=>selectSub(e)}>No Subtitle</MenuItem>
                        </MenuList>
                    </ClickAwayListener>
                </Paper>
            </Popper>

            <Button ref={chooseMovie} onClick={handleMovieToggle} 
                variant="contained" color="primary" style={{float:"right", margin:"10px"}}
            >
              { currentMovie ? currentMovie : "Choose a Movie Source"}
            </Button>
            <Popper open={openMovie} anchorEl={chooseMovie.current} >
                <Paper >
                    <ClickAwayListener onClickAway={handleMovieClose}>
                        <MenuList autoFocusItem={openMovie}>
                            {torrentSelection}
                        </MenuList>
                    </ClickAwayListener>
                </Paper>
            </Popper>
        </div>
    )
}

export default MoviePlayer
