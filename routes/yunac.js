// https://weiquaninfo.cn/testYunAc/login

var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;


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

router.get('/getwxinfo', function(req, res, next) {
	res.redirect('/index');
});

router.post('/testYunAc/login', function(req, res, next) {
	logger.info(req.body.token);
	logger.info(req.body.userName);
	logger.info(req.body.password);
	res.json({ code: 100, token: "success123" });
});



module.exports = router;