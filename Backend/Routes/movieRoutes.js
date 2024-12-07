const express = require('express');

const { getData } = require('../TMDB/tmdbApi');
const router = express.Router();

router.route('/').get(getData);

module.exports = router;
