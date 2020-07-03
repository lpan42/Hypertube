//rce from es7 react extension
import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';//shortcut impt 
import { Link } from 'react-router-dom';//import from default does not need {}
import UserContext from '../../contexts/user/userContext';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import EN from '../../languages/en.json';
import FR from '../../languages/fr.json';

const useStyles = makeStyles((theme) => ({
    logo: {
        display:"flex",
        flexDirection: "column",
        justifyContent:"flex-start",
        alignContent:"left",
    },
}));

const Header = ({ title }) => {
    const userContext = useContext(UserContext);
    
    const { token, logout, user } = userContext;
    const classes = useStyles();

    const onLogout = () => {
        logout();
    }

    const authLinks = (
        <Fragment>
            <a href={`/account/${user && user.data.id}`}>
                <Avatar 
                    alt={user&&user.data.username}
                    src={user&&user.data.avatar} 
                    className={classes.avatar}
                />
            </a>
            <Button href="#!" onClick={onLogout}>
                {
                    user&&user.data.language==="english" ?
                    EN.header.logout :
                    FR.header.logout
                }
            </Button>
        </Fragment>
    )

    return (
        <nav className='navbar bg-dark'>
            <div className={classes.logo}>
                <Typography variant="h4"><Link to='/'>{title}</Link></Typography>
            </div>
            <ul>{ token && authLinks }</ul>
        </nav>
    )
}

Header.propTypes = {
    title: PropTypes.string.isRequired
};

export default Header
