/**
 * Created by zjj on 2017/4/27.
 * 小程序支付调用接口        https://weiquaninfo.cn/wxPay
 * 查询订单接口              https://weiquaninfo.cn/wxPay/orderSearch?transaction_id="微信订单号"
 */

var express = require('express');
var router = express.Router();
var https = require('https');
var redisClient = require('../redis');
var logger = require('../logs/log4js').logger;

// 引入第三方模块
var async = require('async');
var childProc = require('child_process');
var crypto = require('crypto');
// var fastXmlParser = require('fast-xml-parser');
var XMLMapping = require('xml-mapping');
var childProc = require('child_process');
var xmlreader = require('xmlreader');

// 常量设置
const appid = 'wxc7b32c9521bcc0d5'; // wxc7b32c9521bcc0d5
var secret = '70461d854ba40c6871b2f5ac315cf472'; //70461d854ba40c6871b2f5ac315cf472
var myopenid = 'osbYM0QcwWOo4K61UKwztoZjPzAs';
const expireTime = 120; //过期时间秒

/////////////////////////////////////////////////////////////////////////////////////////////
// wxPay：获取微信支付参数，并给到小程序端
router.get('/', function(req, res, next) {
    // 获取客户端参数
    var code = req.query.code;
    logger.info("client ip = " + req.ip);

    //  获取微信支付参数并返回客户端
    if (code) {
        getWxPayParam(code, res, req.ip);
    } else {
        res.end("can't get code");
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////
// 获取openid 并调用统一下单接口
function getWxPayParam(code, response, clientIP) {
    async.waterfall([
        function(cb) {
            // 生成32位随机数
            var cmd = 'head -n 80 /dev/urandom | tr -dc A-Za-z0-9 | head -c 32';
            childProc.exec(cmd, function(err, stdout, stderr) {
                cb(null, stdout);
            });
        },
        function(nonce_str, cb) {
            // 获取用户的openid
            var url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid +
                "&secret=" + secret + "&js_code=" + code + "&grant_type=authorization_code";
            https.get(url, function(res) {
                res.on('data', function(d) {
                    var data = JSON.parse(d);
                    logger.info("openid = " + data.openid);
                    cb(null, data.openid, nonce_str);
                });
            });
        },
        function(openid, nonce_str, cb) {
            // 计算当前时间
            var myDate = new Date();
            // var orderNum = myDate.getYear().toString() + myDate.getMonth().toString();
            var year = myDate.getFullYear().toString();
            var month = (padNumber((myDate.getMonth() + 1), 2)).toString();
            var date = (padNumber(myDate.getDate(), 2)).toString();
            var hour = (padNumber(myDate.getHours(), 2)).toString();
            var minute = (padNumber(myDate.getMinutes(), 2)).toString();
            var seconds = (padNumber(myDate.getSeconds(), 2)).toString();
            var milliseconds = (padNumber(myDate.getMilliseconds(), 3)).toString();
            var out_trade_no = year + month + date + hour + minute + seconds + milliseconds;
            // 计算sign签名（第一次）
            var rawData = {
                "appid": "wxc7b32c9521bcc0d5",
                "body": "智企云-服务定金",
                "mch_id": "1442452802",
                "nonce_str": nonce_str,
                "notify_url": "http://weiquaninfo.cn:18000/wxPay/payResult",
                "openid": openid,
                "out_trade_no": out_trade_no,
                "spbill_create_ip": clientIP,
                "total_fee": "1",
                "trade_type": "JSAPI"
            };
            var newRawData = sortByJsonName(rawData); // 排序
            var i = 0;
            var stringA = "";
            for (var name in newRawData) { // 组装
                if (i == 0) {
                    var temp = name + "=" + newRawData[name];
                    stringA += temp;
                    i++
                } else {
                    var temp = "&" + name + "=" + newRawData[name];
                    stringA += temp;
                    i++
                }
            }
            var stringSignTemp = stringA + "&key=zhiqiyun1zhiqiyun2zhiqiyun3zhiqi";
            var hash1 = crypto.createHash('md5');
            hash1.update(stringSignTemp);
            var sign = (hash1.digest('hex')).toUpperCase(); // 完成加密并转为大写
            rawData["sign"] = sign;
            var newRawData2 = sortByJsonName(rawData); // 排序
            // logger.info(newRawData2);
            var postXml = parseXMLJSON.parse2xml(newRawData2);
            // logger.info(postXml);
            cb(null, postXml);
        },
        function(postXml, cb) {
            // 调用统一下单接口
            var url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
            var path = "/pay/unifiedorder"
            var options = {
                hostname: 'api.mch.weixin.qq.com',
                port: 443,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/xml',
                    'Content-Length': Buffer.byteLength(postXml, 'utf8')
                }
            }
            // 发送请求
            var req2 = https.request(options, function(res2) {
                // 监听事件
                var rawData = '';
                res2.setEncoding('utf8');
                res2.on('data', function(chunk) {
                    // logger.info('go to custom data event');
                    rawData += chunk;
                });
                res2.on('end', function() {
                    // logger.info('go to custom end event');
                    logger.info("rawData = " + rawData);
                    var json1 = XMLMapping.load(rawData);
                    var json2 = json1.xml;
                    // 判断return code 是否SUCCESS
                    var return_codeTemp = json2.return_code;
                    var return_code = return_codeTemp["$cd"];
                    if (return_code == "FAIL") {
                        // 通信失败
                        cb("return_code Fail", "abc");
                        return;
                    }
                    // 判断result_code 是否SUCCESS
                    var result_codeTemp = json2.result_code;
                    var result_code = result_codeTemp["$cd"];
                    if (result_code == "FAIL") {
                        // 支付失败
                        var err = {};
                        var Temp = json2.err_code;
                        var errorCode = Temp["$cd"];
                        err.errorCode = errorCode;
                        Temp = json2.err_code_des;
                        var errorCodeDes = Temp["$cd"];
                        err.errorCodeDes = errorCodeDes;
                        cb(JSON.stringify(err), "abc");
                        return;
                    }
                    var json3 = json2.prepay_id;
                    var prepay_id = json3['$cd'];
                    cb(null, prepay_id); // 回调
                });
            })
            req2.on('error', function(e) {
                logger.info("请求遇到问题:%s", e.message);
            });
            // 写入数据到请求主体
            req2.write(postXml);
            req2.end();
        }
    ], function(err, results) {
        if (err) {
            // 支付失败并返回
            logger.info(err);
            response.end(err);
            return;
        } else {
            logger.info("prepay_id = " + results);
            // 再次签名
            var timestamp2 = (new Date()).valueOf();
            var timestamp3 = (parseInt(timestamp2 / 1000)).toString(); //转为秒数
            var signData2 = {
                "appId": "wxc7b32c9521bcc0d5",
                "nonceStr": "8K8264ILTKCH16CQ2502SI8ZNMTM67VW",
                "package": "prepay_id=" + results,
                "signType": "MD5",
                "timeStamp": timestamp3
            };
            var newRawData = sortByJsonName(signData2); // 排序
            var i = 0;
            var stringA = "";
            for (var name in newRawData) { // 组装
                if (i == 0) {
                    var temp = name + "=" + newRawData[name];
                    stringA += temp;
                    i++
                } else {
                    var temp = "&" + name + "=" + newRawData[name];
                    stringA += temp;
                    i++
                }
            }
            var stringSignTemp = stringA + "&key=zhiqiyun1zhiqiyun2zhiqiyun3zhiqi";
            var hash1 = crypto.createHash('md5');
            hash1.update(stringSignTemp);
            var sign = (hash1.digest('hex')).toUpperCase(); // 完成加密并转为大写
            signData2["sign"] = sign;
            var newRawData2 = sortByJsonName(signData2); // 排序
            // logger.info(newRawData2);
            // var postXml = parseXMLJSON.parse2xml(newRawData2);
            // logger.info(postXml);

            // 返回客户端数据
            response.send(JSON.stringify(newRawData2));
        }
    });

};

/////////////////////////////////////////////////////////////////////////////////////////////
// 查询订单接口  https://weiquaninfo.cn/wxPay/orderSearch?transaction_id="微信订单号"
router.get('/orderSearch', function(req, res, next) {
    // 获取微信订单号参数
    var transaction_id = req.query.transaction_id;
    logger.info("微信订单号 = " + transaction_id);

    // 计算sign签名
    var signData2 = {
        "appid": "wxc7b32c9521bcc0d5",
        "mch_id": "1442452802",
        "transaction_id": transaction_id,
        "nonce_str": "C380BEC2BFD727A4B6845133519F3AD6",
    };
    var newRawData = sortByJsonName(signData2); // 排序
    var i = 0;
    var stringA = "";
    for (var name in newRawData) { // 组装
        if (i == 0) {
            var temp = name + "=" + newRawData[name];
            stringA += temp;
            i++
        } else {
            var temp = "&" + name + "=" + newRawData[name];
            stringA += temp;
            i++
        }
    }
    var stringSignTemp = stringA + "&key=zhiqiyun1zhiqiyun2zhiqiyun3zhiqi";
    var hash1 = crypto.createHash('md5');
    hash1.update(stringSignTemp);
    var sign = (hash1.digest('hex')).toUpperCase(); // 完成加密并转为大写
    signData2["sign"] = sign;
    var newRawData2 = sortByJsonName(signData2); // 排序
    var postXml = parseXMLJSON.parse2xml(newRawData2);

    // 查询订单接口
    var url = "https://api.mch.weixin.qq.com/pay/orderquery";
    var path = "/pay/orderquery"
    var options = {
        hostname: 'api.mch.weixin.qq.com',
        port: 443,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
            'Content-Length': Buffer.byteLength(postXml, 'utf8')
        }
    }
    // 发送请求
    var req2 = https.request(options, function(res2) {
        // 监听事件
        var rawData = '';
        res2.setEncoding('utf8');
        res2.on('data', function(chunk) {
            // logger.info('go to custom data event');
            rawData += chunk;
        });
        res2.on('end', function() {
            // logger.info('go to custom end event');
            logger.info("rawData = " + rawData);
            xmlreader.read(rawData, function(err, res) {
                if (err) {
                    logger.info(err);
                    return;
                }
                logger.info(res.xml.return_code.text());
                logger.info(res.xml.return_msg.text());
                logger.info(res.xml.appid.text());
                logger.info(res.xml.mch_id.text());
                logger.info(res.xml.nonce_str.text());
            });
        });
    })
    req2.on('error', function(e) {
        logger.info("请求遇到问题:%s", e.message);
    });
    // 写入数据到请求主体
    req2.write(postXml);
    req2.end();

    //  获取微信订单信息
    res.end("ed");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// 测试XML解析 http://weiquaninfo.cn:18000/wxPay/testxml
router.get('/testxml', function(req, res, next) {
    var someXml = '<response id="1" shop="aldi">' +
        '<![CDATA[' + 'This is some other content' + ']]>' + +'<who name="james">James May</who>' +
        '<who name="sam">' +
        'Sam Decrock' +
        '<location>Belgium</location>' +
        '</who>' +
        '<who name="jack">Jack Johnsen</who>' +
        '<games age="6">' +
        '<game>Some great game</game>' +
        '<game>Some other great game</game>' +
        '</games>' +
        '<note>These are some notes</note>' +
        '</response>'
    xmlreader.read(someXml, function(err, res) {
        if (err) {
            return;
        }
        logger.info(res.response);
    });
    res.end(JSON.stringify(someXml));
});

/////////////////////////////////////////////////////////////////////////////////////////////
// 获取微信支付结果通知  http://weiquaninfo.cn:18000/wxPay/payResult
// { accept: '*/*',
//     connection: 'Keep-Alive',
//     pragma: 'no-cache',
//     'content-length': '778',
//     host: 'weiquaninfo.cn',
//     'user-agent': 'Mozilla/4.0',
//     'content-type': 'text/xml' }
router.post('/payResult', function(req, res, next) {
    logger.info(req.headers);
    var contentType = req.header('Content-Type');
    if (contentType == "text/xml") {
        // logger.info(decodeURIComponent(req.body));
        logger.info(req.body);
    }
    res.end("SUCCESS");
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// xml和json互转
var parseXMLJSON = {
    parse2json: function(xmlStr) {
        var root = document.createElement('XMLROOT');
        root.innerHTML = xmlStr;
        return this.parse(root);
    },
    parse: function(node) {
        var result = {};
        for (var i = 0; i < node.childNodes.length; ++i) {
            if (node.childNodes[i].nodeType == 1) {
                result[node.childNodes[i].nodeName.toLowerCase()] = this.parse(node.childNodes[i]);
            } else if (node.childNodes[i].nodeType == 3) {
                return node.childNodes[i].nodeValue;
            }
        }
        return result;
    },
    parse2xml: function(data) {
        var xmldata = '';
        xmldata += '<' + 'xml' + '>';
        for (var i in data) {
            xmldata += '<' + i + '>';
            if (typeof data[i] == 'object') {
                xmldata += this.parse2xml(data[i]);
            } else {
                xmldata += data[i];
            }
            xmldata += '</' + i + '>';
        }
        xmldata += '<' + '/xml' + '>';
        return xmldata;
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////
// jsonName排序
function sortByJsonName(jsonData) {
    var arrNames = [];
    var newData = {};
    var i = 0;
    for (var name in jsonData) {
        arrNames[i++] = name;
    }
    arrNames.sort();
    var field = null;
    for (var i in arrNames) {
        field = arrNames[i];
        newData[field] = jsonData[field];
    }
    return newData;
}

///////////////////////////////////////////////////////////////////////////////////////////////
// json按照参数名ascii码排序：https://weiquaninfo.cn/wxPay/sort
router.get('/sort', function(req, res, next) {
    var data = {
        "trade_type": "JSAPI",
        "appid": "wxc7b32c9521bcc0d5",
        "mch_id": "1442452802",
        "body": "智企云-服务定金"
    };
    var newData = sortByJsonName(data);
    logger.info(newData);
    res.end("over");
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 补0
function padNumber(num, fill) {
    //改自：http://blog.csdn.net/aimingoo/article/details/4492592
    var len = ('' + num).length;
    return (Array(
        fill > len ? fill - len + 1 || 0 : 0
    ).join(0) + num);
}

// 输出给app.js使用
module.exports = router;