import React, { useContext, useEffect } from 'react'
import UserContext from '../../contexts/user/userContext';

const Index = () => {
    const userContext = useContext(UserContext);

    const {loadUser} = userContext;
    
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
