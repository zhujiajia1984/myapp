/**
 * Created by zjj on 2017/4/28.
 * https://www.weiquaninfo.cn/wxWebMobileTest
 */
var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;

/* GET home page. */
router.get('/', function(req, res, next) {
	// logger.info("wxWeb page");
	res.end("wxWeb page")
	// res.render('index', { title: 'Express' });
});

module.exports = router;