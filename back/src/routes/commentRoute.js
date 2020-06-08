const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.route('/add/:imdbId').post(auth, commentController.addComment);
router.route('/get/:imdbId').get(auth, commentController.getAllComments);


module.exports = router;