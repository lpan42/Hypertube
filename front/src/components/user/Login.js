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
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Typography from '@material-ui/core/Typography';
import Logo42 from '../../icons/42.png';
import LogoGoogle from '../../icons/google.png';
import LogoGithub from '../../icons/github.png';
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
        marginTop: "8%",
        textAlign:"center",
        backgroundColor: fade("#FFFFFF", 0.5),
        height:320,
        minWidth: 250,
        maxWidth:350,
    },
    form: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: "25ch"
          },
    },
    div:{
        display:"flex", 
        alignItems:"center",
        justifyContent:"center",
        margin:"10px",
    },
    logoImg:{
        height:"30px",
        width:"30px",
    }
  }));

const Login = (props) => {
    const userContext = useContext(UserContext);
    const classes = useStyles();
    const { login, error, token, user, success, clearError, clearSuccess} = userContext;
    
    useEffect(() => {
        if(token && user){
            props.history.push('/');
        }
        if(error) {
            toast.error(error);
            clearError();
        }
        if(success) {
            toast.success(success);
            clearSuccess();
        }
        //eslint-disable-next-line
    }, [token, user, props.history, error, success]);
    
    const [loginUser, setLoginUser] = useState({
        username: '',
        password: '',
    })
    const { username, password } = loginUser;
    
    const onChange = e => {
        setLoginUser({ ...loginUser, [e.target.id]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();
        if(username === '' || password === ''){
            toast.warning('All the fields need to be filled');
        }
        else{
           login(username,password);
        }
    }
        
    const authGithub = () => {
        window.location = "http://localhost:8000/auth/github";
    }
    const authGoogle = () => {
        window.location = "http://localhost:8000/auth/google";
    }
    const auth42 = () => {
        window.location = "http://localhost:8000/auth/42";
    }
    return (
        <div className={classes.bg}>
            <Card className={classes.card}>
                <CardContent>
                    <form className={classes.form} onSubmit={onSubmit}>
                        <TextField required id="username" label="username" 
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <FaceIcon fontSize="small" color="primary"/>
                                </InputAdornment>
                                ),
                            }}
                            type="text" size="small" value={username} onChange={onChange}
                        />
                        <TextField required id="password" label="password" 
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyIcon fontSize="small" color="primary"/>
                                </InputAdornment>
                                ),
                            }}
                            type="password" size="small" value={password} onChange={onChange}
                        />
                        <br></br>
                        <Button type="submit" color="primary" variant="contained" style={{margin:"8px"}}>Login</Button>
                    </form>
                    <div className={classes.div}>
                        <Typography variant="subtitle2" color="secondary" component="span">Login with: </Typography>
                        <Button color="primary" onClick={auth42}><img className={classes.logoImg} src={Logo42} alt="42"/></Button>
                        <Button color="primary" onClick={authGoogle}><img className={classes.logoImg} src={LogoGoogle} alt="Google"/></Button>
                        <Button color="primary" onClick={authGithub}><img className={classes.logoImg} src={LogoGithub} alt ="Github"/></Button>
                    </div>
                    <Typography variant="subtitle2" color="secondary">Don't have an account? <Link to='Register'>Register</Link></Typography>
                    <Typography variant="subtitle2" color="secondary">Forget you password? <Link to='resetpwd_request'>Reset My Password</Link></Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login;

