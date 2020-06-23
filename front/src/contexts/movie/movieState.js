import React, { useReducer } from 'react';
import axios from 'axios';
import MovieContext from './movieContext';
import MovieReducer from './movieReducer';
import setAuthToken from '../../utils/setAuthToken';
import { moviedbAPI_KEY } from '../../components/moviedbAPI_KEY';
import {    
    FETCH_MOVIES,
    FETCH_ERROR
} from '../types';


const MovieState = props => {
    const initialState = {
        loading: true,
        movies: [],
    }

    const [state, dispatch] = useReducer(MovieReducer, initialState);

    const fetchmovie = async (pages) => {
        setAuthToken(localStorage.token);
        try{
            const result = await axios.get(`/movie/getmoviedata`);
            dispatch({
                type: FETCH_MOVIES,
                payload: result.data
            })
        } catch (err) {
            dispatch({
                type: FETCH_ERROR, 
                payload: err.response
            })
        }
    }

    const searchByKeyword = async (keyword, genre, yearrange, ratingrange, page) => {
        setAuthToken(localStorage.token);
        try{
            const config = {
                headers: {'Content-Type': 'application/json'}
            }
            var data = {
                genre: genre,
                keyword: keyword,
                yearrange: yearrange,
                ratingrange: ratingrange,
                page: page
            }; 
            const result = await axios.post(`/movie/searchmovie`, data, config);
            dispatch({
                type: FETCH_MOVIES,
                payload: result.data
            })
        } catch (err) {
            dispatch({
                type: FETCH_ERROR, 
                payload: err.response
            })
        }
    }
    
//need   ERROR handling
    return (
        <MovieContext.Provider
            value={{
                movies: state.movies,
                loading: state.loading,
                pages: state.pages,
                fetchmovie,
                searchByKeyword,
            }}
        >
        {props.children}
        </MovieContext.Provider>
    )
}

export default MovieState;