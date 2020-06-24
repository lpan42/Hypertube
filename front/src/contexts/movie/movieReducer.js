import {
    FETCH_MOVIES,
    FETCH_ERROR
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
        default: {
            return state;
        }
    }
}