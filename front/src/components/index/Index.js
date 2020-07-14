import React, { useContext, useEffect } from 'react'
import UserContext from '../../contexts/user/userContext';
import Search from './Search';
import axios from '../../../../back/node_modules/axios';
import MovieContext from '../../contexts/movie/movieContext';

const Index = () => {
    const userContext = useContext(UserContext);
    const movieContext = useContext(MovieContext);

    const { searchPopularMovie, fetchpop } = movieContext;

    const {loadUser} = userContext;
    
    useEffect(() => {
        loadUser();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        const fetchPopular = async() => {
            const popularMovies = await axios.get('https://api.themoviedb.org/3/movie/popular?api_key=84a478cbc28857a10ea66f63b40ecd28');
            popularMovies.data.results.forEach(movie => {
                searchPopularMovie(movie.title)
            });
        }

        if (fetchpop === true){
            fetchPopular()
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className="container">
            <Search/>
        </div>
    )
}

export default Index;
