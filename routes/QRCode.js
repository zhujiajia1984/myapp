/**
 * Created by zjj on 2017/4/28.
 * https://www.weiquaninfo.cn/QRCode/getTempCode
 */
var express = require('express');
var router = express.Router();
var https = require('https');
var redisClient = require('../redis');
var logger = require('../logs/log4js').logger;

const openid = 'oMBhJ0tdCdBtY07FXuzsywkEyU6A';


/* 获取临时二维码 */
router.get('/getTempCode', function (req, res, next) {
        // 获取access_token
        redisClient.get('accessToken', function (error, resData) {
            var access_token = null;
            if (resData) {
                access_token = JSON.parse(resData);
            } else {
                res.send('access_token_error');
                return;
            }

            // 获取ticket
            var postData = {
                "expire_seconds": 86400, /*有效期一天*/
                "action_name": "QR_SCENE", /*临时*/
                "action_info": {
                    "scene": {
                        "scene_id": 111
                    }
                }
            }
            var strValue = JSON.stringify(postData);
            var path = '/cgi-bin/qrcode/create?access_token=' + access_token;
            logger.info(path);
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(strValue, 'utf8')
                }
            }
            // 发送请求
            var req2 = https.request(options, function (res2) {
                // 监听事件
                var rawData = '';
                res2.setEncoding('utf8');
                res2.on('data', function (chunk) {
                    rawData += chunk;
                });
                res2.on('end', function () {
                    logger.info(rawData);
                    var data = JSON.parse(rawData);
                    var ticket = data.ticket;
                    ticket = encodeURIComponent(ticket);

                    // 获取图片
                    var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket;
                    logger.info(url);
                    https.get(url, function (res3) {
                        const statusCode = res3.statusCode;
                        const contentType = res3.headers['content-type'];
                        const contentLength = res3.headers['content-length'];
                        logger.info(contentType);
                        logger.info(contentLength);
                        //
                        var error = null;
                        if (statusCode !== 200) {
                            error = "请求失败。状态码: " + statusCode;
                        }
                        if (error) {
                            logger.info(error);
                            // 消耗响应数据以释放内存
                            res3.resume();
                            return;
                        }
                        // 监听事件
                        var rawData = '';
                        res3.setEncoding('binary');
                        res3.on('data', function (chunk) {
                            rawData += chunk;
                        });
                        res3.on('end', function () {
                            var buf = Buffer.from(rawData, 'binary');
                            res.write(buf, 'binary');
                            res.end();
                        });
                    }).on('error', function (e) {
                        console.error(e);
                    })
                });
            })
            req2.on('error', function (e) {
                logger.info("请求遇到问题:%s", e.message);
            });
            req2.write(strValue);
            req2.end();
        })
    }
);

module.exports = router;
