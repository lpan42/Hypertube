import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
    cardDiv: {
        display:"flex",
        flexWrap:"wrap",
        justifyContent:"center",
        alignContent:"center",
        overflow:"auto",
        maxHeight:"480px",
    },
    card: {
        margin:"5px",
        minWidth:135,
    },
    media: {
        height: 200,
    },
  }));

const WatchLater = ({movies, language}) => {
    const classes = useStyles();

   if(movies){
       const singleMovie = [];
       movies.map((movie, key) =>{
            singleMovie.push(
                <Card key={key} className={classes.card}>
                    <CardContent style={{padding:"0", textAlign:"center"}}>
                        <Link href={'/movie/'+movie.ImdbID}>
                            <CardMedia
                                className={classes.media}
                                image={movie.Poster}
                            />
                            <Typography style={{padding:"3px"}} variant="caption" color="primary">{movie.Title}</Typography>
                        </Link>
                    </CardContent>
                </Card>
            )
       })
        return (
            <div>
                <Typography variant="subtitle1" style={{textAlign:"right"}}>{language.account.watchlaterlist}</Typography>
                <div  className={classes.cardDiv} >
                    {singleMovie}
                </div>
                <Divider />
            </div>
        )
   }
    else{
        return (
            <div>
                <Typography variant="subtitle1" style={{textAlign:"right"}}>{language.account.watchlaterlist}</Typography>
                <Divider />
            </div>
        );
    }
}

export default WatchLater
