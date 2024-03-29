import React,{ useState, useContext}  from 'react';
import UserContext from '../../contexts/user/userContext';
import toUpperCase from '../../utils/toUpperCase';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Avatar from '@material-ui/core/Avatar';
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


const VisitAccount = ({accountInfo}) => {
    const userContext = useContext(UserContext);
    const classes = useStyles();
    const { user } = userContext;
    const [lang] = useState( user && user.data.language ==="english"? EN:FR);
    
    return (
        <div className={classes.card}>
            <div className={classes.context}>
                <Typography variant="h5" color="primary">{lang.account.useraccount}</Typography>
                <br></br>
                <Avatar 
                    alt={accountInfo.username}
                    src={accountInfo.avatar} 
                    className={classes.largeAvatar}
                />
                <br></br>
                <Typography variant="h6" component="span" className={classes.text}>{lang.account.username}:</Typography>
                <Typography variant="subtitle1" component="span">{toUpperCase(accountInfo.username)}</Typography> 
                <br></br>
                <Typography variant="h6" component="span" className={classes.text}>{lang.account.firstname}:</Typography>
                <Typography variant="subtitle1" component="span">{toUpperCase(accountInfo.firstname)}</Typography> 
                <br></br>
                <Typography variant="h6" component="span" className={classes.text}>{lang.account.lastname}:</Typography>
                <Typography variant="subtitle1" component="span">{toUpperCase(accountInfo.lastname)}</Typography>
                
                <br></br>
                <Typography variant="h6" component="span" className={classes.text}>{lang.account.language}:</Typography>
                <Typography variant="subtitle1" component="span">{toUpperCase(accountInfo.language)}</Typography> 
                <br></br><br></br>
                <Divider classes={{root: classes.dividerColor}}/>
                <div>
                <Typography variant="subtitle1" style={{textAlign:"right"}}>{lang.account.watchlaterlist}</Typography>
                <Watch movies={accountInfo.watchLater}/>
                </div>
                <br></br>
                <Divider classes={{root: classes.dividerColor}}/>
                <div>
                <Typography variant="subtitle1" style={{textAlign:"right"}}>{lang.account.moviewatched}</Typography>
                <Watch movies={accountInfo.watched}/>
                </div>
            </div>
        </div>
    )
}

export default VisitAccount
