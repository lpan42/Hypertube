import React, { useReducer } from 'react';
import axios from 'axios';
import UserContext from './userContext';
import UserReducer from './userReducer';
import setAuthToken from '../../utils/setAuthToken';

import {
   REGISTER_SUCCESS,
   REGISTER_FAIL,
   CLEAR_SUCCESS,
   CLEAR_ERROR,
   LOGIN_SUCCESS,
   LOGIN_FAIL,
   LOAD_USER,
   AUTH_ERROR,
   LOGOUT,
   EDIT_ACCOUNT_FAIL,
   EDIT_ACCOUNT_SUCCESS,
   NORMAL_ERROR,
} from '../types';

const UserState = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        user: null,
        loading: true,
        error: null,
        success: null,
    }

    const [state, dispatch] = useReducer(UserReducer, initialState);

    const register = async formData =>{
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try{
            const result =  await axios.post('/user/register', formData, config);
            dispatch({
                type: REGISTER_SUCCESS,
                payload: result.data.success
            });
        }catch(err){
            dispatch({
                type: REGISTER_FAIL,
                payload: err.response.data.error
            });
        }
    }
    
    const login = async (username,password) =>{
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try{
            const result =  await axios.post('/user/login', {
                username:username,
                password:password
            }, config);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: result.data
            });
            loadUser();
        }catch(err){
            dispatch({
                type: LOGIN_FAIL,
                payload: err.response.data.error
            });
        }
    }

    const loadUser = async () => {
        setAuthToken(localStorage.token);
        try {
            const result = await axios.get('/user/auth');
            dispatch({
                type: LOAD_USER, 
                payload: result.data
            })
        } catch (err) {
            dispatch({
                type: AUTH_ERROR, 
            })
        }
    }
    
    const logout = async () => {
        setAuthToken(localStorage.token);
        try {
            const result = await axios.get('/user/logout');
            dispatch({
                type: LOGOUT, 
                payload: result.data.success
            })
        } catch (err) {
            dispatch({
                type: NORMAL_ERROR,
                payload: err.response.data.error
            })
        }
    }
    const uploadAvatar = async (formData) => {
        setAuthToken(localStorage.token);
        const config = {
            headers: {'Content-Type': 'multipart/form-data'}
        }
        try{
            await axios.post('/user/modify/avatar', formData, config);
        }catch(err){
            dispatch({
                type: EDIT_ACCOUNT_FAIL,
                payload: err.response.data.error
            });
        }
    }

    const editAccount = async (data) => {
        setAuthToken(localStorage.token);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try{
            const result =  await axios.post('/user/modify/account', data, config);
            dispatch({
                type: EDIT_ACCOUNT_SUCCESS,
                payload: result.data.success
            });
            loadUser();
        }catch(err){
            dispatch({
                type: EDIT_ACCOUNT_FAIL,
                payload: err.response.data.error
            });
        }
    }

    const clearError = () => {
        dispatch({
            type: CLEAR_ERROR,
        });
    }

    const clearSuccess = () => {
        dispatch({
            type: CLEAR_SUCCESS,
        });
    }

    return (
        <UserContext.Provider
            value={{
                token: state.token,
                loading: state.loading,
                user: state.user,
                error: state.error,
                success: state.success,
                register,
                login,
                loadUser,
                logout,
                editAccount,
                uploadAvatar,
                clearError,
                clearSuccess,
            }}
        >
        {props.children}
        </UserContext.Provider>
    )
}

export default UserState;