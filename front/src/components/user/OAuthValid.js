import React,{ useContext, useEffect }  from 'react';
import UserContext from '../../contexts/user/userContext';
import { useHistory } from "react-router-dom";

const OAuthValid = () => {
    const userContext = useContext(UserContext);
    const history = useHistory();
    const {user, loadUser, setToken,token} = userContext;
    useEffect(() => {
        let newToken = document.location.href.split("?token=");
        newToken = newToken[newToken.length - 1];
        setToken(newToken);
        loadUser();
        if(user && token){
            history.push('/');
        }
          //eslint-disable-next-line
    }, [user]);
    return (
        <div>
        </div>
    )
}

export default OAuthValid
