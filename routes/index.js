var express = require('express');
var router = express.Router();

router.post('/', require('./savePath'));
router.get('/cost/:path', require('./costByPath'));

module.exports = router;
