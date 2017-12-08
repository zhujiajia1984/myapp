var express = require('express');
var router = express.Router();
var https = require('https');
var redisClient = require('../redis');
var logger = require('../logs/log4js').logger;

// 引入第三方模块
var async = require('async');
var childProc = require('child_process');
var crypto = require('crypto');
var WXBizDataCrypt = require('../WXBizDataCrypt')

// 常量设置
const appid = 'wx8e2b0d02804dc699';                 // wxc7b32c9521bcc0d5, wx8e2b0d02804dc699
var secret = 'af339bfcd902b8b51ccefb8a5f8a53bd';    //70461d854ba40c6871b2f5ac315cf472, af339bfcd902b8b51ccefb8a5f8a53bd
const expireTime = 120;   //过期时间7天（604800秒）

// getToken：获取session_key和openid，并生成3rd_session，进行redis存储后回传客户端
router.get('/', function (req, res, next) {
        // 获取客户端参数
        var code = req.query.code;

        //  根据code 获取token
        if (code) {
            var token = getToken(code, res);
        } else {
            res.end("can't get code");
        }
    }
);

router.get('/data', function (req, res, next) {
        var session_3rd = req.query.token;
        var encryptedData = req.query.encryptedData;
        var iv = req.query.iv;
        var rawData = req.query.rawData;
        var signature = req.query.signature;

        //  根据session获取用户敏感数据
        if (session_3rd) {
            getUserScrectInfo(res, session_3rd, encryptedData, iv, rawData, signature);
        } else {
            res.end("can't get session_3rd");
        }
    }
);

// 返回session_3rd并保存session_key和openid
function getToken(code, response) {
    var url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid +
        "&secret=" + secret + "&js_code=" + code + "&grant_type=authorization_code";

    async.series({
        resKey: function (cb) {
            var cmd = 'head -n 80 /dev/urandom | tr -dc A-Za-z0-9 | head -c 168';
            childProc.exec(cmd, function (err, stdout, stderr) {
                cb(null, stdout);
            });
        },
        resValue: function (cb) {
            var value = null;
            https.get(url, function (res) {
                res.on('data', function (d) {
                    cb(null, JSON.parse(d));
                });
            });
        }
    }, function (err, results) {
        // redis存储
       logger.info(results);
        var strValue = JSON.stringify(results.resValue);
        redisClient.set(results.resKey, strValue);
        redisClient.expire(results.resKey, expireTime); //过期时间120秒

        // 返回客户端3rd_session
        response.send(results.resKey);
    });
}

// 获取用户敏感数据
function getUserScrectInfo(response, session_3rd, encryptedData, iv, rawData, signature) {
    async.waterfall([
        function (cb) {
            // 校验session_3rd并获取session_key和openid
            redisClient.get(session_3rd, function (error, res) {
                var data = null;
                if (res) {
                    data = JSON.parse(res);
                } else {
                    response.send('session_error');
                    return;
                }
                cb(error, data);
            });
        },
        function (arg, cb) {
            // 校验rawData用户数据完整性（校验数据签名）
            var strVerfyData = rawData + arg.session_key;
            var hash = crypto.createHash('sha1');
            hash.update(strVerfyData);
            var signature2 = hash.digest('hex');    // 完成加密
            if (signature !== signature2) {           // 签名对比不同
                response.end('signature error');    // 报错
                return;
            }
            cb(null, arg);
        },
        function (arg, cb) {
            // 解密encryptedData数据
            var pc = new WXBizDataCrypt(appid, arg.session_key);
            var data = pc.decryptData(encryptedData, iv);
            cb(null, data);
        },
        function (arg, cb) {
            // 校验用户敏感数据（校验appid）
            if (arg.watermark.appid != appid) {
                response.end('appid error');    // 报错
                return;
            }
//            logger.info(arg);
            cb(null, arg);  // 传送用户敏感数据
        }
    ], function (err, results) {
        if (err) {
            //           logger.info(err);
            response.end('end error');
            return;
        } else {
            // session中存入unionID
            redisClient.get(session_3rd, function (error, res) {
                var data = null;
                if (res) {
                    data = JSON.parse(res);
                    var allData = {"session_key": data.session_key, "openid": data.openid, "unionid": results.unionId};
                    logger.info(session_3rd);
                    logger.info(allData);
                    var strValue = JSON.stringify(allData);
                    redisClient.set(session_3rd, strValue);
                    redisClient.expire(session_3rd, expireTime); //过期时间120秒

                    // 返回数据
                    response.end('userinfo get OK');
                    return;
                } else {
                    response.send('session_error');
                    return;
                }
            });
        }
    });
}

// 输出给app.js使用
module.exports = router;
