/**
 * Created by zjj on 2017/4/26.
 */
var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;

/* Set Single Position. */
router.post('/', function (req, res, next) {
        logger.info('go to single position');
        res.end('single position get');
    }
);

module.exports = router;
