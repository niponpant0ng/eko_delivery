var express = require('express');
var router = express.Router();

router.post('/', require('./savePath'));
router.get('/cost/:path', require('./costByPath'));
router.get('/:path', require('./posiblePath'));
router.get('/:path/limit/:limit', require('./posiblePathWithLimit'));

module.exports = router;
