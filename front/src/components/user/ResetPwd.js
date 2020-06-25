//rafce
import React, { useState,useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import FaceIcon from '@material-ui/icons/Face';
import InputAdornment from '@material-ui/core/InputAdornment';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
        maxHeight:350,
        minWidth: 275,
        maxWidth:350,
    },
    form: {
        "& .MuiTextField-root": {
            margin: theme.spacing(0.8),
          }
    },
  }));

const ResetPwd = ({ match }) => {
    const [username, setUsername] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [pwd, setPwd] = useState('');
    const [rePwd, setRePwd] = useState('');

    const resetpwd_link = match.params.resetpwd_link;
    const history = useHistory();
    const classes = useStyles();

    const VerifyResetPwdLink = async () => {
        try{
            const result = await axios.get(`/user/verifypwdlink/${resetpwd_link}`);
            setUsername(result.data.data);
            setSuccess(result.data.success);
        }catch(err){
            setError(err.response.data.error);
            history.push(`/resetpwd_request`);
        }
    }

    const updatePwd = async () => {
        const config = {
            headers: {'Content-Type': 'application/json'}
        }
        const data = {
            username:username,
            password:pwd.trim(),
        }
        try{
            const result = await axios.post(`/user/updatepwd`, data, config);
            setSuccess(result.data.success);
            history.push(`/login`);
        }catch(err){
            setError(err.response.data.error);
        }
    }

    useEffect(() => {
        if(!username){
            VerifyResetPwdLink();
        }
        if(error) {
            toast.error(error);
        }
        if(success) {
            toast.success(success);
            // setSuccess('');
        }
        //eslint-disable-next-line
      }, [username, error, success]);

    const onSubmit = (e) => {
        e.preventDefault();
        if(pwd === '' || rePwd === ''){
            toast.warning('All the fields need to be filled');
        }
        else if(pwd !== rePwd){
            toast.error('Two passwords unmatched');
        }else{
            updatePwd();
        }
    }
    
    return (
        <div className={classes.bg}>
            <Card className={classes.card}>
                <CardContent>   
                    <Typography variant="h6" color="primary"> Update Your Password </Typography>
                    <form className={classes.form} onSubmit={onSubmit}>
                        <TextField required id="username" label="username" style = {{width: 260}}
                            inputProps={{
                                readOnly:"true",
                            }}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <FaceIcon fontSize="small" color="primary"/>
                                </InputAdornment>
                                ),
                            }}
                            type="text" size="small" 
                            value={username}
                        />
                        <TextField required id="password" label="password" style = {{width: 260}}
                            inputProps={{
                                minLength: 8,
                                pattern:"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}"
                            }}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyIcon fontSize="small" color="primary"/>
                                </InputAdornment>
                                ),
                            }}
                            type="password" size="small" 
                            helperText="Min 8 characters, at least one number, and one uppercase and lowercase letter" 
                            value={pwd} onChange={e=>setPwd(e.target.value)}
                        />
                        <TextField required id="re_password" label="confirm password" style = {{width: 260}}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyIcon fontSize="small" color="primary"/>
                                </InputAdornment>
                                ),
                            }}
                            type="password" size="small" value={rePwd} onChange={e=>setRePwd(e.target.value)}
                        />
                        <Button type="submit" color="primary" variant="contained" style={{margin:"8px"}}>Confirm</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPwd
