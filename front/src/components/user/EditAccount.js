import React, {useEffect, useContext} from 'react';
import UserContext from '../../contexts/user/userContext';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { fade } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FaceIcon from '@material-ui/icons/Face';
import InputAdornment from '@material-ui/core/InputAdornment';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import MenuItem from '@material-ui/core/MenuItem';
import toUpperCase from '../../utils/toUpperCase';
import LanguageIcon from '@material-ui/icons/Language';
import UploadAvatar from './UploadAvatars';

const useStyles = makeStyles(theme => ({
    card: {
        textAlign:"center",
        maxHeight:500,
        minWidth: 300,
        maxWidth: 600,
        marginTop: "2%",
        backgroundColor: fade("#FFFFFF", 0.5),
    },
    context: {
        padding: "15px",
    },
    form: {
        "& .MuiTextField-root": {
            marginTop: "2%",
            margin: theme.spacing(0.8),
            width: "20ch",
          }
    },
  }));
  
const EditAccount = () => {
    const userContext = useContext(UserContext);
    const { user, editAccount } = userContext;
    const classes = useStyles();
    const [language, setLanguage] = React.useState(user.data.language);

    useEffect(() => {
        user && (user.data.language = language);
        //eslint-disable-next-line
    }, [language]);

    const languages = [ { value: "english" },{ value: "français" }];

    const onSubmit =(e) => {
        e.preventDefault();
        console.log(user.data)
        //     editAccount(user);
    }
    return (
        <div className={classes.card}>
            <div className={classes.context}>
                <Typography variant="h5" color="primary">Edit My Account</Typography>
                <form className={classes.form} onSubmit={onSubmit}>
                    <UploadAvatar />
                    <br></br>
                    <TextField id="firstname" label="firstname" style = {{width: 110}}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <FaceIcon fontSize="small" color="primary"/>
                            </InputAdornment>
                            ),
                        }}
                        type="text" size="small" placeholder={user && user.data.firstname} 
                        onChange={e => user.data.firstname = e.target.value.toLowerCase()}
                    />
                    <TextField id="lastname" label="lastname" style = {{width: 110}}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <FaceIcon fontSize="small" color="primary"/>
                            </InputAdornment>
                            ),
                        }}
                        type="text" size="small" placeholder={user && user.data.lastname} 
                        onChange={e => user.data.lastname = e.target.value.toLowerCase()}
                    />
                    <br></br>
                    <TextField id="username" label="username" style = {{width: 240}}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <FaceIcon fontSize="small" color="primary"/>
                            </InputAdornment>
                            ),
                        }}
                        type="text" size="small" placeholder={user && user.data.username} 
                        onChange={e => user.data.username = e.target.value.toLowerCase()}
                    />
                    <br></br>
                    <TextField id="email" label="email" style = {{width: 240}}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <MailOutlineIcon fontSize="small" color="primary"/>
                            </InputAdornment>
                            ),
                        }}
                        type="email" size="small"  placeholder={user && user.data.email} 
                        onChange={e => user.data.email = e.target.value.toLowerCase()}
                    />
                    <br></br>
                    <TextField select label="Language" style = {{width: 240}}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <LanguageIcon fontSize="small" color="primary"/>
                            </InputAdornment>
                            ),
                        }}
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        >
                        {languages.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                            {toUpperCase(option.value)}
                            </MenuItem>
                        ))}
                    </TextField>
                    <br></br>
                    <Button type="submit" color="primary">Confirm</Button>
                </form>
            </div>
        </div>
    )
}

export default EditAccount
