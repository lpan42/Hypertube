import React,{ useState, useContext, useEffect, Fragment }  from 'react';

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


const VisitAccount = ({accountInfo}) => {
    const classes = useStyles();
    
    return (
        <div className={classes.card}>
            <div className={classes.context}>
                <Typography variant="h5" color="primary">User Account</Typography>
                <br></br>
                <Avatar 
                    alt={accountInfo.username}
                    src={accountInfo.avatar} 
                    className={classes.largeAvatar}
                />
                <br></br>
                <Typography variant="h6" component="span" className={classes.text}>Username:</Typography>
                <Typography variant="subtitle1" component="span">{toUpperCase(accountInfo.username)}</Typography> 
                <br></br>
                <Typography variant="h6" component="span" className={classes.text}>Firstname:</Typography>
                <Typography variant="subtitle1" component="span">{toUpperCase(accountInfo.firstname)}</Typography> 
                <br></br>
                <Typography variant="h6" component="span" className={classes.text}>Lastname:</Typography>
                <Typography variant="subtitle1" component="span">{toUpperCase(accountInfo.lastname)}</Typography>
                
                <br></br>
                <Typography variant="h6" component="span" className={classes.text}>Language:</Typography>
                <Typography variant="subtitle1" component="span">{toUpperCase(accountInfo.language)}</Typography> 
            </div>
        </div>
    )
}

export default VisitAccount
