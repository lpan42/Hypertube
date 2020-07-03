import React,{Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
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
        minWidth:130,
        maxWidth:150,
    },
    media: {
        height: 200,
    },
  }));

const Watch = ({movies, language}) => {
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
                            <Typography variant="caption" color="primary">{movie.Title}</Typography>
                        </Link>
                    </CardContent>
                </Card>
            )
            return singleMovie
       })
        return (
            <Fragment>
                <div className={classes.cardDiv} >
                    {singleMovie}
                </div>
            </Fragment>
        )
   }
    else{
        return (
            <Fragment></Fragment>
        );
    }
}

export default Watch
