/**
 * Created by zjj on 2017/4/28.
 * https://www.weiquaninfo.cn/wxWeb/auth
 * https://www.weiquaninfo.cn/wxWeb/getUserInfo
 * https://www.weiquaninfo.cn/wxWeb/login
 * https://www.weiquaninfo.cn/wxWeb/addGoodsToCart
 */
var express = require('express');
var router = express.Router();
var https = require('https');
var redisClient = require('../redis');
var moment = require('moment');
var logger = require('../logs/log4js').logger;

const appid = 'wxaed97ec85f7517ba';
const secret = 'fecd688110e195c4ea0e9f3d97797d44';
const openid = 'oMBhJ0tdCdBtY07FXuzsywkEyU6A';
const unionid = 'oN_tl1gVV5VmBSjvcPMDCqUZTBvk';

/* 获取用户数据*/
router.post('/getUserInfo', function(req, res, next) {
    var token = req.body.token;
    logger.info(token);
    redisClient.get(token, function(error, resData) {
        if (resData) {
            var userInfo = JSON.parse(resData);
            var data = {
                nickname: userInfo.nickname,
                imgUrl: userInfo.imgUrl,
            }
            res.send(JSON.stringify(data));
            return;
        } else {
            res.send('get user info error');
            return;
        }
    });
})

/* 微信网页授权auth2.0. */
router.get('/auth', function(req, res, next) {
    logger.info('go to auth ');
    //
    var strPrefix = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=";
    var str2 = "&redirect_uri=";
    var str3 = "&response_type=code";
    var str4 = "&scope="
    var str5 = "&state=";
    var tail = "#wechat_redirect";
    var urlRe = "https://www.weiquaninfo.cn/h5/mall"
    urlRe = encodeURIComponent(urlRe);
    var scopeType = "snsapi_userinfo"; //snsapi_base 不弹出页面，直接跳转  snsapi_userinfo 弹出页面，获取更多
    var token = moment().format("YYYYMMDDHHmmssSSS");
    var path = strPrefix + appid + str2 + urlRe + str3 + str4 + scopeType + str5 + token + tail;
    // logger.info(path);
    res.redirect(path);
    // res.end(path);
    // res.render('index', {title: 'ejs'});
});

/* 添加商品到购物车*/
router.post('/addGoodsToCart', function(req, res, next) {
    var token = req.body.token;
    var goodsInfo = req.body.goodsInfo;
    logger.info(token);
    logger.info(goodsInfo);
    redisClient.get(token, function(error, resData) {
        if (resData) {
            var userInfo = JSON.parse(resData);
            logger.info(userInfo);
            res.end("success");
            return;
        } else {
            res.end("failed");
            return;
        }
    });
})



module.exports = router;