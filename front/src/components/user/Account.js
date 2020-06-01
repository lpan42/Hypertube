import React,{ useContext, useEffect,useState }  from 'react';
import UserContext from '../../contexts/user/userContext';
import MyAccount from './MyAccount';
import VisitAccount from './VisitAccount';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Spinner from '../layout/Spinner';
import setAuthToken from '../../utils/setAuthToken';

const useStyles = makeStyles(theme => ({
  container: {
    height: "90vh",
    margin: "0",
    padding: "1rem 2rem",
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    display:"flex",
    flexDirection: "row",
    justifyContent:"center",
    alignContent:"center",
  },
}));

const Account = ({match}) => {
  const userContext = useContext(UserContext);
  const classes = useStyles();
  const {user, loadUser, token} = userContext;

  const [accountInfo,setAccountInfo] = useState('');
  const [loading,setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAccount = async (userid) => {
      setAuthToken(localStorage.token);
      try{
          const result =  await axios.get(`/user/account/${userid}`);
          setAccountInfo(result.data.data);
          setLoading(false);
      }catch(err){
          setError(err.response.data.error);
          setLoading(false);
      }
  }
  useEffect(() => {
      loadUser();
      getAccount(match.params.userid);
      //eslint-disable-next-line
  },[]);
  if (loading) return <Spinner />;

  return (
      <div className={classes.container}>
        {match.params.userid === (user && user.data.id) ? 
          <MyAccount /> : 
          <VisitAccount accountInfo={accountInfo}/>
        }
      </div>
  )
}

export default Account
