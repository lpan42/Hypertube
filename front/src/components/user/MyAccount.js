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

const MyAccount = () => {
    const userContext = useContext(UserContext);

    const { user, error, success, loadUser,clearSuccess, clearError } = userContext;
    const [edit, setEdit] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        loadUser();
        if(error) {
            toast.error(error);
            clearError();
            setTimeout(()=>{
              window.location.reload(1);
            }, 2000);
        }
        if(success) {
          toast.success(success);
          clearSuccess();
          setTimeout(()=>{
            window.location.reload(1);
          }, 2000);
        }
          //eslint-disable-next-line
      }, [error, success]);

    const onClick = () => {
        setEdit(true); 
    }
  
    const accountInfo = (
      <div className={classes.card}>
        <div className={classes.context}>
            <Button color="primary" style={{float:"right"}} onClick={onClick}>Edit</Button>
            <Typography variant="h5" color="primary">My Account</Typography>
            <br></br>
            <Avatar 
                alt={user&&user.data.username}
                src={user&&user.data.avatar} 
                className={classes.largeAvatar}
            />
            <br></br>
            <Typography variant="h6" component="span" className={classes.text}>Username:</Typography>
            <Typography variant="subtitle1" component="span">{user && toUpperCase(user.data.username)}</Typography> 
            <br></br>
            <Typography variant="h6" component="span" className={classes.text}>Email:</Typography>
            <Typography variant="subtitle1" component="span">{user && user.data.email}</Typography> 
            <br></br>
            <Typography variant="h6" component="span" className={classes.text}>Firstname:</Typography>
            <Typography variant="subtitle1" component="span">{user && toUpperCase(user.data.firstname)}</Typography> 
            <br></br>
            <Typography variant="h6" component="span" className={classes.text}>Lastname:</Typography>
            <Typography variant="subtitle1" component="span">{user && toUpperCase(user.data.lastname)}</Typography>
            
            <br></br>
            <Typography variant="h6" component="span" className={classes.text}>Language:</Typography>
            <Typography variant="subtitle1" component="span">{user && toUpperCase(user.data.language)}</Typography> 
        </div>
      </div>
    )
    return (
        <Fragment>
            { !edit ? accountInfo : <EditAccount />}
        </Fragment>
    )
}

export default MyAccount