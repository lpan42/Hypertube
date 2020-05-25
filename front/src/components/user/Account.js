import React,{ useContext, useEffect }  from 'react';
import UserContext from '../../contexts/user/userContext';
import MyAccount from './MyAccount';
import VisitAccount from './VisitAccount';
import { makeStyles } from '@material-ui/core/styles';

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

  const {user, loadUser} = userContext;
  const classes = useStyles();

  useEffect(() => {
    loadUser();
      //eslint-disable-next-line
  }, []);

  return (
      <div className={classes.container}>
       {+match.params.userid === (user && user.data.id) ? 
                <MyAccount /> : 
                <VisitAccount userid={+match.params.userid}/>
            }
      </div>
  )
}

export default Account
