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
	res.render('index');
});

router.get('/pwdReset', function(req, res, next) {
	res.render('index');
});

router.get('/peizhi', function(req, res, next) {
	res.render('index');
});

router.get('/apType', function(req, res, next) {
	res.render('index');
});

router.get('/tzManage', function(req, res, next) {
	res.render('index');
});

router.get('/tzType', function(req, res, next) {
	res.render('index');
});

router.get('/apUser', function(req, res, next) {
	res.redirect('index');
});

router.get('/version', function(req, res, next) {
	res.render('index');
});

router.get('/versionType', function(req, res, next) {
	res.render('index');
});

router.get('/logSystem', function(req, res, next) {
	res.render('index');
});

router.get('/logOperation', function(req, res, next) {
	res.render('index');
});

router.get('/subClient', function(req, res, next) {
	res.render('index');
});

router.get('/subRole', function(req, res, next) {
	res.render('index');
});

router.get('/subAccount', function(req, res, next) {
	res.render('index');
});

router.get('/account', function(req, res, next) {
	res.render('index');
});

router.get('/profile', function(req, res, next) {
	res.render('index');
});

router.get('/editPwd', function(req, res, next) {
	res.render('index');
});

// router.get('/*', function(req, res, next) {
// 	res.redirect('index');
// });

router.post('/testYunAc/login', function(req, res, next) {
	logger.info(req.body.token);
	logger.info(req.body.userName);
	logger.info(req.body.password);
	res.json({ code: 100, token: "success123" });
});



module.exports = router;