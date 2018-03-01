/**
 * Created by zjj on 2017/4/28.
 * 页面：https://www.weiquaninfo.cn/wxWebMobileTest
 * 获取config所需的签名接口：https://www.weiquaninfo.cn/wxWebMobileTest/getConfigSign
 */
var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;
var childProc = require('child_process');
var moment = require('moment');

/* page. */
router.get('/', function(req, res, next) {
	// logger.info("wxWeb page");
	res.render('wxWebMobileTest');
});

////////////////////////////////////////////////////
// 获取config所需的签名等信息
router.get('/getConfigSign', function(req, res, next) {
	// var cmd = 'head -n 80 /dev/urandom | tr -dc A-Za-z0-9 | head -c 16';
	// childProc.exec(cmd, function(err, stdout, stderr) {
	// 	res.send(stdout);
	// });
	let timestamp = moment().unix();
	console.log(timestamp);
	res.send("success");
});

module.exports = router;