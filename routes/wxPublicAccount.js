/**
 * Created by zjj on 2017/4/27.
 * 显示access_token   https://weiquaninfo.cn/wxPublicAccount/getAccessToken
 * 显示access_token   https://weiquaninfo.cn/wxPublicAccount/getAccessToke/get
 * 发送客服消息 https://weiquaninfo.cn/wxPublicAccount/getAccessToken/sendWxCustomMessage
 * 发送模板消息 https://weiquaninfo.cn/wxPublicAccount/getAccessToken/sendWxModalMessage
 * 获取用户基本信息 https://weiquaninfo.cn/wxPublicAccount/getUserInfo
 */
var express = require('express');
var router = express.Router();
var https = require('https');
var redisClient = require('../redis');
var querystring = require('querystring');
var iconv = require('iconv-lite');
var logger = require('../logs/log4js').logger;

const appid = 'wxaed97ec85f7517ba';
const screct = 'fecd688110e195c4ea0e9f3d97797d44';
const time = 5400; //1.5小时
const key = 'accessToken';
const openid = 'oMBhJ0tdCdBtY07FXuzsywkEyU6A';

/* 每隔2小时(提前半小时，即5400秒)就去获取微信公众号的access_token，并存储到redis中 */
router.get('/getAccessToken', function(req, res, next) {
    redisClient.get('token', function(error, resData) {
        var data = null;
        if (resData) {
            data = JSON.parse(resData);
            // logger.info(data);
            res.send(data);
            return;
        } else {
            res.send('access_token_error');
            return;
        }
    });
    // 请求access_token
    // var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + screct;
    // logger.info(url);
    // https.get(url, function(res) {
    //     const statusCode = res.statusCode;
    //     const contentType = res.headers['content-type'];
    //     var error = null;
    //     if (statusCode !== 200) {
    //         error = "请求失败。状态码: " + statusCode;
    //     } else if (!/^application\/json/.test(contentType)) {
    //         error = "无效的 content-type";
    //     }
    //     if (error) {
    //         logger.info(error);
    //         // 消耗响应数据以释放内存
    //         res.resume();
    //         return;
    //     }

    //     // 监听事件
    //     var rawData = '';
    //     res.setEncoding('utf8');
    //     res.on('data', function(chunk) {
    //         // logger.info('go to data event');
    //         rawData += chunk;
    //     });
    //     res.on('end', function() {
    //         // logger.info('go to data end');
    //         var data = JSON.parse(rawData);
    //         var strValue = JSON.stringify(data.access_token);
    //         logger.info(strValue);
    //         redisClient.set(key, strValue);
    //         redisClient.expire(key, time); //过期时间设置
    //         // logger.info(data.access_token);
    //     });
    // }).on('error', function(e) {
    //     console.error(e);
    // })

    // // 响应客户端
    // res.end('game over');
})

/* 获取access_token */
router.get('/getAccessToken/get', function(req, res, next) {
    redisClient.get('accessToken', function(error, resData) {
        var data = null;
        if (resData) {
            data = JSON.parse(resData);
            // logger.info(data);
            res.send(data);
            return;
        } else {
            res.send('access_token_error');
            return;
        }
    });
})

/* 发送客服消息 */
router.get('/getAccessToken/sendWxCustomMessage', function(req, res, next) {
    redisClient.get('accessToken', function(error, resData) {
        var access_token = null;
        if (resData) {
            access_token = JSON.parse(resData);
        } else {
            res.send('access_token_error');
            return;
        }

        // 发送微信客服消息
        var path = '/cgi-bin/message/custom/send?access_token=' + access_token;
        logger.info(path);
        // logger.info(path);
        // var postData = querystring.stringify({
        //     "touser": "oMBhJ0tdCdBtY07FXuzsywkEyU6A",
        //     "msgtype": "text",
        //     "text": {
        //         "content": "测试"
        //     }
        // });
        var postData = {
            "touser": "oMBhJ0tdCdBtY07FXuzsywkEyU6A",
            "msgtype": "text",
            "text": {
                "content": "测试方案辅导及佛案件哦"
            }
        }
        var strValue = JSON.stringify(postData);
        logger.info(strValue.length);
        logger.info(Buffer.byteLength(strValue, 'utf8'));
        var options = {
            hostname: 'api.weixin.qq.com',
            port: 443,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(strValue, 'utf8')
                // "Content-Length": strValue.length
                // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            }
        }
        // 发送请求
        var req2 = https.request(options, function(res2) {
            // 监听事件
            var rawData = '';
            res2.setEncoding('utf8');
            res2.on('data', function(chunk) {
                logger.info('go to custom data event');
                rawData += chunk;
            });
            res2.on('end', function() {
                logger.info('go to custom end event');
                logger.info(rawData);
                // logger.info(data.access_token);
            });
        })
        req2.on('error', function(e) {
            logger.info("请求遇到问题:%s", e.message);
        });

        // 写入数据到请求主体
        req2.write(strValue);
        // req2.write(postData);
        req2.end();
        res.end('send over');
    });
})

/* 发送模板消息 */
router.get('/getAccessToken/sendWxModalMessage', function(req, res, next) {

    // 获取access_token
    redisClient.get('accessToken', function(error, resData) {
        var access_token = null;
        if (resData) {
            access_token = JSON.parse(resData);
        } else {
            res.send('access_token_error');
            return;
        }

        // 发送微信模板消息
        var path = '/cgi-bin/message/template/send?access_token=' + access_token;
        // logger.info(path);
        var postData = {
            "touser": "oMBhJ0tdCdBtY07FXuzsywkEyU6A",
            "template_id": "eNsm9QLzxOT0aJF9yMCjQZR2lECZXTD1E_PM8ReUiIo",
            "data": {
                "first": {
                    "value": "系统异常",
                    "color": "#173177"
                },
                "reason": {
                    "value": "tt",
                    "color": "#173177"
                },
                "refund": {
                    "value": "ky",
                    "color": "#173177"
                },
                "remark": {
                    "value": "系统崩溃",
                    "color": "#173177"
                }
            }
        }
        // var postData = {
        //     "touser": "oMBhJ0tdCdBtY07FXuzsywkEyU6A",
        //     "template_id": "JXrSxtCBdP3fJxj6flr992dHucmzVx4XqntheKZkE84",
        //     "data": {
        //         "first": {
        //             "value": "first",
        //             "color": "#173177"
        //         },
        //         "keyword1": {
        //             "value": "tt",
        //             "color": "#173177"
        //         },
        //         "keyword2": {
        //             "value": "ky",
        //             "color": "#173177"
        //         },
        //         "keyword3": {
        //             "value": "fk",
        //             "color": "#173177"
        //         },
        //         "remark": {
        //             "value": "remark",
        //             "color": "#173177"
        //         }
        //     }
        // }
        var strValue = JSON.stringify(postData);
        // logger.info(postData);
        var options = {
            hostname: 'sh.api.weixin.qq.com',
            port: 443,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Content-Length": Buffer.byteLength(strValue, 'utf8')
            }
        };

        // 发送请求
        var req = https.request(options, function(res) {

            // 监听事件
            var rawData = '';
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                logger.info('go to data event');
                rawData += chunk;
            });
            res.on('end', function() {
                logger.info('go to end event');
                logger.info(rawData);
                // logger.info(data.access_token);
            });
        })
        req.on('error', function(e) {
            logger.info("请求遇到问题:%s", e.message);
        });

        // 写入数据到请求主体
        req.write(strValue);
        req.end();
    });

    // 返回客户端
    res.end("over");
})

/*获取用户详细信息*/
router.get('/getUserInfo', function(req, res, next) {
    // 获取access_token
    redisClient.get('accessToken', function(error, resData) {
        var access_token = null;
        if (resData) {
            access_token = JSON.parse(resData);
        } else {
            res.send('access_token_error');
            return;
        }

        // 获取用户基本信息
        var path = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN ';
        https.get(path, function(res) {
            const statusCode = res.statusCode;
            const contentType = res.headers['content-type'];
            var error = null;
            if (statusCode !== 200) {
                error = "请求失败。状态码: " + statusCode;
            }
            if (error) {
                logger.info(error);
                // 消耗响应数据以释放内存
                res.resume();
                return;
            }

            // 监听事件
            var rawData = '';
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                // logger.info('go to data event');
                rawData += chunk;
            });
            res.on('end', function() {
                logger.info(rawData);
                var data = JSON.parse(rawData);
            });
        }).on('error', function(e) {
            console.error(e);
        })
    })
    res.end('the end');
})


module.exports = router;