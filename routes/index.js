var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;

/* GET home page. */
router.get('/', function(req, res, next) {
	logger.info("home page");
	res.render('index', { title: 'Express' });
});

module.exports = router;