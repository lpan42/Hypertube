import React, { useReducer } from 'react';
import axios from 'axios';
import MovieContext from './movieContext';
import MovieReducer from './movieReducer';
import setAuthToken from '../../utils/setAuthToken';
import {    
    FETCH_MOVIES,
    FETCH_ERROR,
    FETCH_NBPAGE,
    POPULAR_MOVIES
} from '../types';


const MovieState = props => {
    const initialState = {
        loading: true,
        movies: [],
        nbpages: null,
        fetchpop: true
    }

    const [state, dispatch] = useReducer(MovieReducer, initialState);

    const searchPopularMovie = async (movieTitle) => {
        setAuthToken(localStorage.token);
        try{
            const config = {
                headers: {'Content-Type': 'application/json'}
            }
            var data = {
                title: movieTitle
            }; 
            const result = await axios.post(`/movie/searchpopular`, data, config);
            dispatch({
                type: POPULAR_MOVIES,
                payload: result.data.data
            })
        } catch (err) {
            dispatch({
                type: FETCH_ERROR, 
                payload: err.response
            })
        }
    }

    const searchByKeyword = async (keyword, genre, yearrange, ratingrange, page, sortBy) => {
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
                page: page,
                sortBy: sortBy,
            }; 
            const result = await axios.post(`/movie/searchmovie`, data, config);
            dispatch({
                type: FETCH_MOVIES,
                payload: result.data.data
            })
            const result_page_nb = await axios.post('/movie/fetchpagenum', data, config);
            dispatch({
                type: FETCH_NBPAGE,
                payload: result_page_nb.data.data
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
                nbpages: Math.ceil(state.nbpages / 30),
                searchByKeyword,
                searchPopularMovie,
                fetchpop: state.fetchpop
            }}
        >
        {props.children}
        </MovieContext.Provider>
    )
}

export default MovieState;