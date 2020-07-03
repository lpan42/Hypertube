import React,{ useContext, useEffect }  from 'react';
import { Typography } from '@material-ui/core';
import UserContext from '../../contexts/user/userContext';

const NotFound = () => {
    const userContext = useContext(UserContext);
    const {loadUser} = userContext;
    useEffect(() => {
        loadUser();
        //eslint-disable-next-line
    },[]);
    return (
        <div style={{textAlign:"center",backgroundColor:"white"}}>
            <Typography variant="h6" color="primary">Not Found</Typography>
            <Typography variant="h6" color="primary">Page does not exist</Typography>
        </div>
    )
}

export default NotFound;