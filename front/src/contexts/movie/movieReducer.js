import {
    FETCH_MOVIES,
    FETCH_ERROR,
    FETCH_NBPAGE,
    POPULAR_MOVIES
} from '../types';

export default (state, action) => {
        switch (action.type) {
            case FETCH_MOVIES: 
                return {
                    ...state,
                    loading: false,
                    movies: action.payload,
                }
            case FETCH_ERROR:
                return {
                ...state,
                loading: false
            }
            case FETCH_NBPAGE:
                return {
                    ...state,
                    nbpages: action.payload,
                }
            case POPULAR_MOVIES:
                return {
                    ...state,
                    movies: state.movies.concat(action.payload),
                    loading: false
                }
        default: {
            return state;
        }
    }
}