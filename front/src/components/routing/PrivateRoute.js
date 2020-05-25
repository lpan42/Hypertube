//race/
import React, { useContext }from 'react';
import { Route, Redirect } from 'react-router-dom';
import UserContext from '../../contexts/user/userContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const userContext = useContext(UserContext);
    const { token, loading } = userContext;

    return (
        <Route {...rest } 
            render={ props => !token && !loading ? (<Redirect to='/register' />) : (<Component {...props} />)} 
        />
    )
}

export default PrivateRoute
