/**
 * Created by zjj on 2018/02/23.
 * 验证码	https://weiquaninfo.cn/captcha
 */
var express = require('express');
var router = express.Router();
var ccap = require('ccap');
var logger = require('../logs/log4js').logger;

/* GET captcha. */
router.get('/', function(req, res, next) {
	var captcha = ccap();
	var ary = captcha.get();
	//ary[0] is captcha's text,ary[1] is captcha picture buffer.
	var text = ary[0];
	var buffer = ary[1];
	logger.info(text);
	res.end(buffer);
});

module.exports = router;