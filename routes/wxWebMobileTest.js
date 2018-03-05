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
var redisClient = require('../redis');

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
	let signData = {};
	signData.timestamp = moment().unix();
	signData.url = 'https://www.weiquaninfo.cn/wxWebMobileTest';
	new Promise((resolve, reject) => {
		let cmd = 'head -n 80 /dev/urandom | tr -dc A-Za-z0-9 | head -c 16';
		childProc.exec(cmd, (err, stdout, stderr) => {
			if (stderr) {
				return reject(err);
			} else {
				signData.noncestr = stdout;
				return resolve();
			}
		})
	}).then(() => {
		redisClient.get('jsapi_ticket', (error, resData) => {
			if (error) {
				logger.error(error);
				res.sendStatus(500);
			} else {
				signData.jsapi_ticket = JSON.parse(resData);
				res.json(signData);
			}
		});
	}).catch(error => {
		logger.error(error);
		res.sendStatus(500);
	})
});

//


//
module.exports = router;