import React, { useState,useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import TextField from '@material-ui/core/TextField';

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
        maxHeight:200,
        minWidth: 275,
        maxWidth:350,
    },
    form: {
        "& .MuiTextField-root": {
            margin: theme.spacing(2),
          }
    },
  }));

const RequestResetPwd = (props) => {
    const [value, setValue] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const classes = useStyles();

    useEffect(() => {
        if(error) {
            toast.error(error);
            setError(null);
            props.history.push('register');
        }
        if(success) {
            toast.success(success);
            setSuccess(null);
        }
        //eslint-disable-next-line
      }, [error, success]);

    const resetPwd = async () => {
        try{
            const result =  await axios.get(`/user/resetpwd/${value}`);
            setSuccess(result.data.success);
        }catch(err){
            console.log(err.response.data.error)
            setError(err.response.data.error);
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        resetPwd();
    }

    return (
        <div className={classes.bg}>
             <Card className={classes.card}>
                <CardContent>   
                    <Typography variant="h6" color="primary">Reset Your Password </Typography>
                    <form className={classes.form} onSubmit={onSubmit}>
                        <TextField required id="email" label="Enter your username or email" style = {{width: 260}}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <MailOutlineIcon color="primary"/>
                                </InputAdornment>
                                ),
                            }}
                            type="text" size="small"  value={value} onChange={e=>setValue(e.target.value)}
                        />
                        <Button type="submit" color="primary" variant="contained" style={{margin:"8px"}}>Confirm</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
        )
}

export default RequestResetPwd;