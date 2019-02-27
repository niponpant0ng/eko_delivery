var express = require('express');
var router = express.Router();

router.get('/cost/:path', require('./costByPath'));

module.exports = router;
