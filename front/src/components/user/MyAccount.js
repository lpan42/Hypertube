import React,{ useState, useContext, useEffect, Fragment }  from 'react';
import UserContext from '../../contexts/user/userContext';
import EditAccount from './EditAccount';
import { toast } from 'react-toastify';
import toUpperCase from '../../utils/toUpperCase';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Avatar from '@material-ui/core/Avatar';
import Spinner from '../layout/Spinner';
import EN from '../../languages/en.json';
import FR from '../../languages/fr.json';
import Watch from './Watch';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
    card: {
        textAlign:"left",
        // maxHeight:400,
        minWidth: 300,
        maxWidth: 800,
        marginTop: "2%",
        backgroundColor: fade("#FFFFFF", 0.3),
    },
    context: {
      padding: "12px",
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
    dividerColor: {
      backgroundColor: theme.palette.primary.main,
   },
  }));

const MyAccount = () => {
    const userContext = useContext(UserContext);

    const { user, error, success, clearSuccess, clearError,loading } = userContext;
    const [edit, setEdit] = useState(false);
    const [lang] = useState( user && user.data.language ==="english"? EN:FR);
    const classes = useStyles();

    useEffect(() => {
      if(error) {
          toast.error(error);
          clearError();
      }
      if(success) {
        toast.success(success);
        clearSuccess();
        setTimeout(()=>{
          window.location.reload(1);
        }, 2000);
      }
          //eslint-disable-next-line
      },[error, success]);

    const onClick = () => {
        setEdit(true); 
    }

    const accountInfo = (
      <div className={classes.card}>
        <div className={classes.context}>
            <Button color="primary" style={{float:"right"}} onClick={onClick}>{lang.account.edit}</Button>
            <Typography variant="h5" color="primary">{lang.account.myaccount}</Typography>
            <br></br>
            <Avatar 
                alt={user&&user.data.username}
                src={user&&user.data.avatar} 
                className={classes.largeAvatar}
            />
            <br></br>
            <Typography variant="subtitle1" component="span" className={classes.text}>{lang.account.username}:</Typography>
            <Typography variant="subtitle1" component="span">{user && toUpperCase(user.data.username)}</Typography> 
            <br></br>
            <Typography variant="subtitle1" component="span" className={classes.text}>{lang.account.email}:</Typography>
            <Typography variant="subtitle1" component="span">{user && user.data.email}</Typography> 
            <br></br>
            <Typography variant="subtitle1" component="span" className={classes.text}>{lang.account.firstname}:</Typography>
            <Typography variant="subtitle1" component="span">{user && toUpperCase(user.data.firstname)}</Typography> 
            <br></br>
            <Typography variant="subtitle1" component="span" className={classes.text}>{lang.account.lastname}:</Typography>
            <Typography variant="subtitle1" component="span">{user && toUpperCase(user.data.lastname)}</Typography>
            <br></br>
            <Typography variant="subtitle1" component="span" className={classes.text}>{lang.account.language}:</Typography>
            <Typography variant="subtitle1" component="span">{user && toUpperCase(user.data.language)}</Typography> 
            <br></br><br></br>
            <Divider classes={{root: classes.dividerColor}}/>
            <div>
              <Typography variant="subtitle1" style={{textAlign:"right"}}>{lang.account.watchlaterlist}</Typography>
              <Watch movies={user && user.data.watchLater}/>
            </div>
            <br></br>
            <Divider classes={{root: classes.dividerColor}}/>
            <div>
              <Typography variant="subtitle1" style={{textAlign:"right"}}>{lang.account.moviewatched}</Typography>
              <Watch movies={user && user.data.watched}/>
            </div>
           
        </div>
      </div>
    )

    if (loading) return <Spinner />;

    return (
        <Fragment>
            { !edit ? accountInfo : <EditAccount />}
        </Fragment>
    )
}

export default MyAccount
