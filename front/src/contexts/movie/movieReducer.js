import {
    FETCH_MOVIES,
    FETCH_ERROR,
    FETCH_NBPAGE
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
        default: {
            return state;
        }
    }
}