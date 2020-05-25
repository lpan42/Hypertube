import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import UserContext from '../../contexts/user/userContext';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FaceIcon from '@material-ui/icons/Face';
import InputAdornment from '@material-ui/core/InputAdornment';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Typography from '@material-ui/core/Typography';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { fade } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles(theme => ({
    bg: {
        minHeight: "100vh",
        margin: "0",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        display:"flex",
        flexDirection: "row",
        justifyContent:"center",
        alignContent:"center",
    },
    card: {
        marginTop: "3%",
        textAlign:"center",
        backgroundColor: fade("#FFFFFF", 0.6),
        maxHeight:500,
        minWidth: 275,
        maxWidth:350,
    },
    form: {
        "& .MuiTextField-root": {
            margin: theme.spacing(0.8),
          }
    },
  }));

const Register = (props) => {
    const userContext = useContext(UserContext);

    const [user, setUser] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        re_password:''
    })

    const { register, error, success, token, clearSuccess, clearError } = userContext;
    const classes = useStyles();

    useEffect(() => {
        if(token){
            props.history.push('/');//redirect
        }
        if(error) {
            toast.error(error);
            clearError();
        }
        if(success) {
            toast.success(success);
            clearSuccess();
            props.history.push('login');
        }
        //eslint-disable-next-line
    }, [error, token, props.history, success]);

    const { username, email, firstname, lastname, password, re_password } = user;

    const onChange = e => {
        setUser({ ...user, [e.target.id]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();
        if(username === '' || email === '' || firstname === '' || lastname === '' || password === '' || re_password === ''){
            toast.warning('All the fields need to be filled');
        }
        else if(password !== re_password){
            toast.error('Two passwords unmatched');
        }else{
            register({
                username,
                email,
                firstname,
                lastname,
                password
            });
        }
    }
    
    return (
        <div className={classes.bg}>
            <Card className={classes.card}>
                <CardContent>   
                    <form className={classes.form} onSubmit={onSubmit}>
                        <TextField required id="firstname" label="firstname" style = {{width: 125}}
                            inputProps={{
                                maxLength: 20,
                            }}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <FaceIcon fontSize="small" color="secondary"/>
                                </InputAdornment>
                                ),
                            }}
                            type="text" size="small" value={firstname} onChange={onChange}
                        />
                        <TextField required id="lastname" label="lastname" style = {{width: 125}}
                            inputProps={{
                                maxLength: 20,
                            }}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <FaceIcon fontSize="small" color="secondary"/>
                                </InputAdornment>
                                ),
                            }}
                            type="text" size="small" value={lastname} onChange={onChange}
                        />
                        <TextField required id="username" label="username" style = {{width: 260}}
                            inputProps={{
                                maxLength: 10,
                                pattern:"[a-z0-9]+",
                            }}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <FaceIcon fontSize="small" color="secondary"/>
                                </InputAdornment>
                                ),
                            }}
                            type="text" size="small" 
                            helperText="Max 10 characters, lowercase letters and numbers only."
                            value={username} onChange={onChange}
                        />
                        <TextField required id="email" label="email" style = {{width: 260}}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <MailOutlineIcon fontSize="small" color="secondary"/>
                                </InputAdornment>
                                ),
                            }}
                            type="email" size="small"  value={email} onChange={onChange}
                        />
                        <TextField required id="password" label="password" style = {{width: 260}}
                            // inputProps={{
                            //     minLength: 8,
                            //     pattern:"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}"
                            // }}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyIcon fontSize="small" color="secondary"/>
                                </InputAdornment>
                                ),
                            }}
                            type="password" size="small" 
                            helperText="Min 8 characters, at least one number, and one uppercase and lowercase letter" 
                            value={password} onChange={onChange}
                        />
                        <TextField required id="re_password" label="confirm password" style = {{width: 260}}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyIcon fontSize="small" color="secondary"/>
                                </InputAdornment>
                                ),
                            }}
                            type="password" size="small" value={re_password} onChange={onChange}
                        />
                        <br></br>
                        <Button type="submit" color="primary" variant="contained" style={{margin:"8px"}}>Register</Button>
                    </form>
                    <Typography variant="subtitle2" color="secondary">Have an account? <Link to='Login'>Login</Link></Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default Register;

