import React,{ useContext, useEffect }  from 'react';
import UserContext from '../../contexts/user/userContext';
import { useHistory } from "react-router-dom";

const OAuthValid = ({match}) => {
    const userContext = useContext(UserContext);
    const history = useHistory();
    const {user, loadUser, setToken, token, error} = userContext;

    useEffect(() => {
        let newToken = match.params.token;
        setToken(newToken);
        if(token && !user){
            loadUser();
        }
        if(error) {
            history.push('/register');
        }
        if(user && token){
            history.push('/');
        }
          //eslint-disable-next-line
    }, [token, user]);
    return (
        <div></div>
    )
}

export default OAuthValid
