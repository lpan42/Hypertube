const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const auth = require('../middleware/auth');

router.route('/:imdb_id&:langPrefer').get(auth, movieController.getMovieinfo);
router.route('/single/:imdb_id').get(auth, movieController.getSingleMovie);
router.route('/subtitle/:imdb_id').get(movieController.getSubtitle);
router.route('/stream/:imdb_id&:provider&:quality').get(movieController.streamMovie);

router.route('/watchlater/add/:imdb_id').post(auth, movieController.addWatchLater);
router.route('/watchlater/remove/:imdb_id').post(auth, movieController.removeWatchLater);
router.route('/watched/add/:imdb_id').post(auth, movieController.addToWatched);
router.route('/searchmovie').post(auth, movieController.searchMovie);


module.exports = router;