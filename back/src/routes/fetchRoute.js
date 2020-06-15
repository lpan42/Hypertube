const express = require('express');
const router = express.Router();
const fetchController = require('../controllers/fetchController');

router.route('/yts').get(fetchController.fetchYts);

module.exports = router;