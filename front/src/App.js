import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./style/App.css";
import PrivateRoute from './components/routing/PrivateRoute';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Index from './components/index/Index';
import Register from './components/user/Register';
import Login from './components/user/Login';
import Account from './components/user/Account';
import OAuthValid from './components/user/OAuthValid';
import Movie from './components/movie/Movie';
import RequestResetPwd from './components/user/RequestResetPwd';
import ResetPwd from "./components/user/ResetPwd";
import NotFound from './components/layout/NotFound';
import UserState from './contexts/user/UserState';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

toast.configure({
	position: "bottom-left",
	autoClose: 3000,
	hideProgressBar: true,
	closeOnClick: true,
	pauseOnHover: false,
	draggable: false,
  });

  const theme = createMuiTheme({
	palette: {
	  primary: {
		main: '#E50914',
		contrastText: '#ffffff',
	  },//red
	  secondary: {
		main: '#000000',
		light:'#808080',//white
		contrastText: '#ffffff',
	  },//black
	  error: {
		main: '#E50914',
		contrastText: '#ffffff',
	  },
	  success: {
		main: '#60A561',
		contrastText: '#ffffff',
	  },
	  warning:  {
		main: '#F6BD60',
		contrastText: '#ffffff',
	  },
	//  info: {
	// 	main: '#000000',
	// 	contrastText: '#ffffff',
	//  },
	},
	typography: {
		fontFamily: "'Source Sans Pro', sans-serif",
		textTransform: "none",
	  }
  });
  

const App = () => {
	return (
		<UserState>
			<Router>
				<ThemeProvider theme={theme}>
					<Fragment>
						<Header title = "HyperTube"/>
						<div style={{minHeight:"100vh"}}>
							<Switch>
							<PrivateRoute exact path='/' component={Index} />
							<PrivateRoute exact path='/account/:userid' component={Account} />
							<PrivateRoute exact path='/movie/:imdb_id' component={Movie} />
							<Route exact path='/oAuthValid/:token' component={OAuthValid} />
							<Route exact path='/register' component={Register} />
							<Route exact path='/login' component={Login} />
							<Route exact path="/resetpwd_request" component={RequestResetPwd} />
							<Route exact path="/resetpwd/:resetpwd_link" component={ResetPwd} />
							<Route component={NotFound} />
							</Switch>
						</div>
						<Footer />
					</Fragment>
				</ThemeProvider>
			</Router>
		</UserState>
	)
}

export default App;