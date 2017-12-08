/**
 * Created by zjj on 2017/11/12.
 * 
 */
var express = require('express');
var router = express.Router();
var https = require('https');
var redisClient = require('../redis');
var logger = require('../logs/log4js').logger;


const appid = 'wxaed97ec85f7517ba';
const secret = 'fecd688110e195c4ea0e9f3d97797d44';
const openid = 'oMBhJ0tdCdBtY07FXuzsywkEyU6A';
const unionid = 'oN_tl1gVV5VmBSjvcPMDCqUZTBvk';
const expireTime = 2592000; //过期时间30天（单位秒）

/* 返回前端browserhistory路由*/
router.get('/mall', function(req, res, next) {
	logger.info('go to h5/mall');
	if (typeof(req.query.code) == "undefined" ||
		typeof(req.query.state) == "undefined") {
		// res.end("query invailed");
		res.sendFile('/home/myapp/public/h5/mall/index.html');
		return;
	}
	var code = req.query.code;
	var token = req.query.state;
	redisClient.get(token, function(error, resData) {
		if (resData) {
			logger.info("token already exists:" + token);
			res.sendFile('/home/myapp/public/h5/mall/index.html');
			return;
		} else {
			// logger.info(code);
			// logger.info("token：" + state);
			// 获取网页授权access_token
			var path = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + secret + "&code=" +
				code + "&grant_type=authorization_code";
			// logger.info(path);
			var options = {
				hostname: 'api.weixin.qq.com',
				port: 443,
				path: path,
				method: 'POST',
			}
			// 发送请求
			var req2 = https.request(options, function(res2) {
				// 监听事件
				var rawData = '';
				res2.setEncoding('utf8');
				res2.on('data', function(chunk) {
					rawData += chunk;
				});
				res2.on('end', function() {
					// logger.info(rawData);
					var data = JSON.parse(rawData);
					var access_token = data.access_token;
					var openid = data.openid;
					// logger.info("user_access_token：" + access_token);
					// logger.info("openid：" + openid);
					// 获取用户信息
					var url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' +
						openid + '&lang=zh_CN';
					// logger.info(url);
					https.get(url, function(res3) {
						const statusCode = res3.statusCode;
						const contentType = res3.headers['content-type'];
						var error = null;
						if (statusCode !== 200) {
							error = "请求失败。状态码: " + statusCode;
						}
						if (error) {
							logger.error(error);
							res3.resume();
							return;
						}

						// 监听事件
						var rawData = '';
						res3.setEncoding('utf8');
						res3.on('data', function(chunk) {
							// logger.info('go to data event');
							rawData += chunk;
						});
						res3.on('end', function() {
							// logger.info('go to data end');
							// logger.info(rawData);
							var data = JSON.parse(rawData);
							var nickname = data.nickname;
							var imgUrl = data.headimgurl;
							// logger.info("nickname：" + nickname);
							// logger.info("imgUrl：" + imgUrl);

							// 存储数据
							var userData = {
								access_token: access_token,
								openid: openid,
								nickname: nickname,
								imgUrl: imgUrl,
							}
							redisClient.set(token, JSON.stringify(userData));
							redisClient.expire(token, expireTime);

							// 返回页面
							res.sendFile('/home/myapp/public/h5/mall/index.html');
						});
					}).on('error', function(e) {
						console.error(e);
					})
				});
			})
			req2.on('error', function(e) {
				logger.error("请求遇到问题:%s", e.message);
			});
			req2.end();
			// 客户端返回
			// res.end('the end');
			// res.render('index', {title: 'ejs'});
		}
	});

})

module.exports = router;