const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const movieController = require('../controllers/movieController');
const auth = require('../middleware/auth');

router.route('/:imdb_id&:langPrefer').get(auth, movieController.getMovieinfo);
router.route('/watchlater/add/:imdb_id').post(auth, movieController.addWatchLater);
router.route('/watchlater/remove/:imdb_id').post(auth, movieController.removeWatchLater);


module.exports = router;