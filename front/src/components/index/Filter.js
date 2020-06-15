import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

<FormControl style={{float: 'right', backgroundColor: 'white', margin: '2em'}}>
<Select value={genre} onChange={e=>setGenre(e.target.value)}>
    <Button value="action">{language.movietype.Action}</Button>
    <Button value="adventure">{language.movietype.Adventure}</Button>
    <Button value="animation">{language.movietype.Animation}</Button>
    <Button value="biography">{language.movietype.Biography}</Button>
    <Button value="comedy">{language.movietype.Comedy}</Button>
    <Button value="crime">{language.movietype.Crime}</Button>
    <Button value="documentary">{language.movietype.Documentary}</Button>
    <Button value="drama">{language.movietype.Drama}</Button>
    <Button value="family">{language.movietype.Family}</Button>
    <Button value="fantasy">{language.movietype.Fantasy}</Button>
    <Button value="filmnoir">{language.movietype.FilmNoir}</Button>
    <Button value="history">{language.movietype.History}</Button>
    <Button value="horror">{language.movietype.Horror}</Button>
    <Button value="music">{language.movietype.Music}</Button>
    <Button value="musical">{language.movietype.Musical}</Button>
    <Button value="mystery">{language.movietype.Mystery}</Button>
    <Button value="romance">{language.movietype.Romance}</Button>
    <Button value="scifi">{language.movietype.SciFi}</Button>
    <Button value="shortfilm">{language.movietype.ShortFilm}</Button>
    <Button value="sport">{language.movietype.Sport}</Button>
    <Button value="superhero">{language.movietype.Superhero}</Button>
    <Button value="thriller">{language.movietype.Thriller}</Button>
    <Button value="war">{language.movietype.War}</Button>
    <Button value="western">{language.movietype.Western}</Button>
</Select>
</FormControl>

export default Filter;