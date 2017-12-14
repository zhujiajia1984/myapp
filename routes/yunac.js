// https://weiquaninfo.cn/testYunAc/login

var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;
var cors = require('cors');

/* GET yunac page. */
router.get('/', function(req, res, next) {
	// logger.info("yunac home page");
	res.render('index');
});

router.get('/index', function(req, res, next) {
	res.render('index');
});

router.get('/apManage', function(req, res, next) {
	res.render('index');
});

router.get('/groupManage', function(req, res, next) {
	res.render('index');
});

router.get('/apUser', function(req, res, next) {
	res.render('index');
});

router.post('/testYunAc/login', cors(), function(req, res, next) {
	var token = req.body.token;
	logger.info(token);
	res.json({ token: "success123" });
});



module.exports = router;