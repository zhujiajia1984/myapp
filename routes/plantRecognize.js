/**
 * Created by zjj on 2017/8/1.
 */
var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var http = require('http');
var querystring = require("querystring");
var router = express.Router();
var logger = require('../logs/log4js').logger;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 花草识别（接收文件并调用阿里云接口）
router.post('/', function (req, res, next) {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';                                //  设置编码
        form.uploadDir = "/home/myapp/public/temp";           //  设置上传目录
        form.keepExtensions = true;                            //  保留文件后缀
        form.maxFieldsSize = 2 * 1024 * 1024;                   // field申请内存控件大小为2MB
        form.parse(req, function (err, fields, files) {
            if(err){
                res.locals.error = err;
                res.end("form parse error");
                return;
            }
            // 判断文件类型
            var extName = '';  //后缀名
            // logger.info(files.plantImage.type);
            switch (files.plantImage.type) {
                case 'image/jpg':
                    extName = 'jpg';
                    break;
                case 'image/jpeg':
                    extName = 'jpg';
                    break;
                case 'image/png':
                    extName = 'png';
                    break;
            }
            if(extName.length == 0){
                res.locals.error = '只支持png和jpg格式图片';
                res.end("only png and jpg image");
                return;
            }
            // 重命名文件
            var myDate = new Date();
            var year = myDate.getFullYear().toString();
            var month = (padNumber((myDate.getMonth() + 1), 2)).toString();
            var date = (padNumber(myDate.getDate(), 2)).toString();
            var hour = (padNumber(myDate.getHours(), 2)).toString();
            var minute = (padNumber(myDate.getMinutes(), 2)).toString();
            var seconds = (padNumber(myDate.getSeconds(), 2)).toString();
            var time = year + month + date + hour + minute + seconds;
            var newPath = form.uploadDir + '/' + time + '.' + extName;
            // logger.info(newPath);
            fs.renameSync(files.plantImage.path, newPath);

            // 转为base64编码
            var data = fs.readFileSync(newPath);
            data = new Buffer(data).toString('base64');
            var base64 = 'data:' + files.plantImage.type + ';base64,' + data;
            fs.unlinkSync(newPath);
            // logger.info(base64);

            // 发送花草识别请求
            var postData = querystring.stringify({"img_base64": base64});
            var authCode = 'APPCODE' + ' ' + 'd24aa2d58f664757bd6f9f10ccce160f';
            const options = {
                hostname: 'plantgw.nongbangzhu.cn',
                port: 80,
                path: '/plant/recognize',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': authCode
                }
            };
            // 发送请求
            var req2 = http.request(options, function (res2) {
                // 监听事件
                var rawData = '';
                res2.setEncoding('utf8');
                res2.on('data', function (chunk) {
                    rawData += chunk;
                });
                res2.on('end', function () {
                    logger.info(rawData);
                });
            })
            req2.on('error', function (e) {
                logger.info("请求遇到问题:%s", e.message);
            });
            // 写入数据到请求主体
            req2.write(postData);
            req2.end();

            // 返回数据给客户端
            res.end("plant recognize end");
        });
    }
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 补0
function padNumber(num, fill) {
    //改自：http://blog.csdn.net/aimingoo/article/details/4492592
    var len = ('' + num).length;
    return (Array(
        fill > len ? fill - len + 1 || 0 : 0
    ).join(0) + num);
}

module.exports = router;