import React, { useContext, useEffect, useState, Fragment } from 'react'
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
import EN from '../../languages/en.json';
import FR from '../../languages/fr.json';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
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

    const classes = useStyles();

    const torrentSelection = [];
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
    useEffect(() => {
        getSingleMovie();
        //eslint-disable-next-line
    }, []);
    

    const selectTorrent = async (e) => {
        setVideoSrc(`http://localhost:8000/movie/stream/${imdb_id}&${singleMovie.Torrents[e.currentTarget.value].provider}&${singleMovie.Torrents[e.currentTarget.value].quality}`)
    }   
   

    const onPlay = async () =>{
        if(videoSrc){
            setAuthToken(localStorage.token);
            try{
                const result =  await axios.post(`/movie/watched/add/${imdb_id}`);
            }catch(err){
                setError(err.response.data.error);
            }
        }
    }

    // console.log(singleMovie)
    singleMovie && singleMovie.Torrents.map((torrent,key) => {
        torrentSelection.push(
            <MenuItem key={key} value={key} onClick={e=>selectTorrent(e)}>{torrent.quality}{torrent.provider}</MenuItem>
        )
    })
    const player = (
        <div className={classes.palyerDiv}  onClick={()=>onPlay()}>
            <Player poster={singleMovie.Poster} preload="auto" src={videoSrc}>
            <ControlBar>
                <ReplayControl seconds={10} order={1.1} />
                <ForwardControl seconds={10} order={1.2} />
                {/* <CurrentTimeDisplay order={4.1} /> */}
                {/* <TimeDivider order={4.2} /> */}
                <PlaybackRateMenuButton rates={[2, 1.25, 1, 0.5]} order={7.1} />
                <VolumeMenuButton disabled />
            </ControlBar>
            </Player>
        </div>
       
    )
    return (
        <div>
            {/* { videoSrc ? player : null } */}
            {player}
            <Button ref={anchorRef} onClick={handleToggle} 
                variant="contained" color="primary" style={{float:"right", margin:"10px"}}
            >
              Choose a Moive Source
            </Button>
            <Popper open={open} anchorEl={anchorRef.current} >
                <Paper >
                    <ClickAwayListener onClickAway={handleClose}>
                    <MenuList autoFocusItem={open}>
                        {torrentSelection}
                    </MenuList>
                    </ClickAwayListener>
                </Paper>
            </Popper>
        </div>
    )
}

export default MoviePlayer
