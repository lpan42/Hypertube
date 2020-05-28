import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOAD_USER,
    AUTH_ERROR,
    LOGOUT,
    EDIT_ACCOUNT_FAIL,
    EDIT_ACCOUNT_SUCCESS,
    NORMAL_ERROR,
    CLEAR_SUCCESS,
    CLEAR_ERROR
} from '../types';


export default (state, action) => {
    switch (action.type) {
        case LOAD_USER:
            return {
                ...state,
                loading:false,
                user:action.payload
            }
        case REGISTER_SUCCESS:
            return{
                ...state,
                ...action.payload,
                success: action.payload,
                loading: false
            };
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case AUTH_ERROR:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                user: null,
                error: action.payload,
                loading: false
            }
        case LOGOUT:
            localStorage.clear();
            return {
                ...state,
                token: null,
                user: null,
                success: action.payload,
                loading: false
            }
        case NORMAL_ERROR:
            return{
                ...state,
                user: null,
                error: action.payload,
                loading: false
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                loading: false,
            }
        case EDIT_ACCOUNT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload
            }
        case EDIT_ACCOUNT_FAIL:
            return {
                ...state,
                error: action.payload,
                loading: false
            }
        case CLEAR_SUCCESS:
            return {
                ...state,
                success: null,
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null,
            }
        default:
            return state;
    }
}