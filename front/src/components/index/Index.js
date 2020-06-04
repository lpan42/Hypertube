import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../contexts/user/userContext';
import setAuthToken from '../../utils/setAuthToken';
import { useHistory } from "react-router-dom";

const Index = () => {
    const userContext = useContext(UserContext);

    const {loadUser, user,token} = userContext;
    const history = useHistory();
    
    useEffect(() => {
        loadUser();
        //eslint-disable-next-line
      }, []);

    return (
        <div className="container">
            index
        </div>
    )
}

export default Index;
