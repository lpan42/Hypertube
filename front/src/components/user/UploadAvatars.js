import React, {useContext, Fragment, useState} from 'react'
import UserContext from '../../contexts/user/userContext';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
    editAvatar:{
      marginTop:"5%",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
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
    input: {
      display: 'none',
    },
  }));
  
const UploadAvatars = () => {
  const userContext = useContext(UserContext);
  const { user } = userContext;
  const classes = useStyles();

  const [pic, setPic] = useState(null);
  const [picName, setPicName] = useState(user.data.avatar ? user.data.avatar : null);
  const [src, setSrc] = useState(user.data.avatar ? `${picName}` : null);

  const checkPic = (file) => {
    const types = ['image/png', 'image/jpeg'];
    if (types.every(type => file.type !== type)){
      toast.error("Only png/jpeg(jpg) is allowed");
    }
    const size = 3000000;
    if (file.size > size){
      toast.error("File is too big");
    }
    return (true);
  }

  const OnChange = (e) => {
    if(checkPic(e.target.files[0])){
      setPic(e.target.files[0]);
      setSrc(URL.createObjectURL(e.target.files[0]));
      setPicName(e.target.files[0].name);
    }
  }
  console.log(pic)
  // const OnSubmit = (e) => {
  //   e.preventDefault();
  //   let formData = new FormData();
  //   formData.append('file', pic);
  //   // updateAvatar(formData);
  // }

  return (
      <div className={classes.editAvatar}>
         <Avatar 
            alt={user&&user.data.username}
            src={src} 
            className={classes.largeAvatar}
        />
        <label htmlFor="contained-button-file">
          <Button color="primary" component="span">
            Upload
          </Button>
        </label>
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file"
          type="file" name="uploadPic" accept=".jpg,.png" onChange={OnChange}
        />
         

        {/* <Modal
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        > */}
          {/* <Fade in={open}>
            <div className={classes.paper}>
                <div>preview</div>
                {picName ? <img className={classes.preview} alt="upload Avatar" src={src}></img> : null}
              <form onSubmit={OnSubmit}>
                  <input type="file" name="uploadPic" accept=".jpg,.png" onChange={OnChange}></input>
                  <br></br>
                  <Button type="submit" color="primary" size="small" variant="contained">Change Avatar</Button>
              </form>
            </div>
          </Fade> */}
        {/* </Modal> */}
      </div>
  );
}

export default UploadAvatars