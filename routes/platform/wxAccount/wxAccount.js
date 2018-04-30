/*
    微信第三方平台开发
    授权回调URL:      https://www.weiquaninfo.cn/platform/wxAccount
*/

var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('auth success');
});

module.exports = router;