// https://weiquaninfo.cn/radar

var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;


/* radar page */
router.get('*', function(req, res, next) {
	res.render('radar');
});

module.exports = router;