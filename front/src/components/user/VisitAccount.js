import React,{ useState, useContext, useEffect, Fragment }  from 'react';
import axios from 'axios';
import Spinner from '../layout/Spinner';
import setAuthToken from '../../utils/setAuthToken';
import { toast } from 'react-toastify';
import toUpperCase from '../../utils/toUpperCase';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
    card: {
        textAlign:"left",
        maxHeight:400,
        minWidth: 300,
        maxWidth: 600,
        marginTop: "2%",
        backgroundColor: fade("#FFFFFF", 0.5),
    },
    context: {
      padding: "15px",
    },
    text: {
      paddingRight: "15px",
    },
    largeAvatar: {
        [theme.breakpoints.down('sm')]: {
            width: theme.spacing(10),
            height: theme.spacing(10),
          },
        [theme.breakpoints.up('md')]: {
            width: theme.spacing(10),
            height: theme.spacing(10),
        },
        [theme.breakpoints.up('lg')]: {
            width: theme.spacing(15),
            height: theme.spacing(15),
        },
      },
  }));


const VisitAccount = ({userid}) => {
    const classes = useStyles();
    const [user,setUser] = useState('');
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState('');

    const getAccount = async (userid) => {
        setAuthToken(localStorage.token);
        try{
            const result =  await axios.get(`/user/account/${userid}`);
            setUser(result.data.data);
            setLoading(false);
        }catch(err){
            setError(err.response.data.error);
        }
    }
    console.log(user)
    useEffect(() => {
        getAccount(userid);
        //eslint-disable-next-line
      }, []);

    const accountInfo = (
        <div className={classes.card}>
            <div className={classes.context}>
                <Typography variant="h5" color="primary">User Account</Typography>
                <br></br>
                <Avatar 
                    alt={user.username}
                    src={user.avatar} 
                    className={classes.largeAvatar}
                />
                <br></br>
                <Typography variant="h6" component="span" className={classes.text}>Username:</Typography>
                <Typography variant="subtitle1" component="span">{toUpperCase(user.username)}</Typography> 
                <br></br>
                <Typography variant="h6" component="span" className={classes.text}>Firstname:</Typography>
                <Typography variant="subtitle1" component="span">{toUpperCase(user.firstname)}</Typography> 
                <br></br>
                <Typography variant="h6" component="span" className={classes.text}>Lastname:</Typography>
                <Typography variant="subtitle1" component="span">{toUpperCase(user.lastname)}</Typography>
                
                <br></br>
                <Typography variant="h6" component="span" className={classes.text}>Language:</Typography>
                <Typography variant="subtitle1" component="span">{toUpperCase(user.language)}</Typography> 
            </div>
    </div>
    );
    return (
       <Fragment>
           {error ? <Typography variant="h6" color="primary">{error}</Typography> : accountInfo}
       </Fragment>
    )
}

export default VisitAccount
