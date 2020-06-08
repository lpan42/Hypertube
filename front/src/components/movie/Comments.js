import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
    commentDiv:{
        margin:"20px",
    },
    chatBox: {
        width:'100%',
        display: 'flex',
        alignContent:"center",
		// padding:'10px',
		// justifyContent: 'flex-end',
    },
    textForm: {
        marginRight:'5px',
        width:'90%',
        backgroundColor:theme.palette.secondary.contrastText
    },
    comments: {
        maxHeight: "400px",
        width:"100%",
        overflow:"auto",
    },
    singleComment:{
        color: theme.palette.secondary.contrastText
    }
  }));


const Comments = ({language, imdbId}) => {
    
    const classes = useStyles();
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState('');
    const showComment = [];

    const getAllComments = async () => {
        try{
            const result = await axios.get(`/comment/get/${imdbId}`);
            setComments(result.data.data);
        }catch(err){
            console.log(err.response.data.error);
        }
    }

    useEffect(() => {
        getAllComments();
        //eslint-disable-next-line
    },[]); 

    const addComment = async () => {
        setAuthToken(localStorage.token);
        const config = {headers: { 'Content-Type': 'application/json' }};
        try{
            await axios.post(`/comment/add/${imdbId}`,{ newComment }, config);
        }catch(err){
            console.log(err.response.data.error);
        }
    }

    const sendNewComment =(e) => {
		e.preventDefault();
		if(newComment){
			addComment();
            setNewComment('');
            getAllComments();
		}
    }
    
    comments && comments.map((comment, key) => {
        showComment.push(
            <List key={key} className={classes.singleComment}>
                <Typography variant="body1"><a href={'/account/'+ comment.userId}>{comment.username}</a> @ {moment(comment.time).format("DD-MM-YYYY HH:mm")}</Typography>
                <Typography variant="body2">{comment.comment}</Typography>
            </List>
        )
    })

    return (
        <div>
            <div className={classes.commentDiv}>
                <Typography variant="body1">{language.comment.comments}:</Typography>
                <form className={classes.chatBox}>
					<TextField placeholder={language.comment.leavecomment} className={classes.textForm} variant="outlined"
                        multiline rowsMax={4} value={newComment} onChange={e=>setNewComment(e.target.value)}
					/>
					<IconButton type='submit' color="primary" onClick={(e)=>sendNewComment(e)}>
						<SendIcon />
					</IconButton>
				</form>
                <div className={classes.comments}>
                    {showComment}
                </div>
            </div>
        </div>
    )
}

export default Comments

