/**
 * Created by zjj on 2017/6/7
 * 调用心知天气接口        https://weiquaninfo.cn/weather/xinzhi
 */

var express = require('express');
var router = express.Router();
var https = require('https');
var logger = require('../logs/log4js').logger;

// 引入第三方模块
var async = require('async');

// 常量设置
const xinzhiAPIkey = '2idkdhfe9snakc1g';                 // 心知API密钥
var xinzhiUserID = 'UF021ECF94';                        // 心知用户ID

/////////////////////////////////////////////////////////////////////////////////////////////
// 获取心知实时天气
router.get('/xinzhi', function (req, response, next) {
        var location = "beijing";
        var lang = "zh-Hans";
        var unit = "c";
        var pos = {
            long: "121.453536",
            lat: "31.234079"
        }
        // var ul2 = "https://api.seniverse.com/v3/weather/now.json?key=2idkdhfe9snakc1g&location=beijing&language=zh-Hans&unit=c";
        // var url = 'https://api.seniverse.com/v3/weather/now.json?key=' + xinzhiAPIkey +
        //     '&location=' + location + '&language=' + lang + '&unit=' + unit;
        var url = 'https://api.seniverse.com/v3/weather/now.json?key=' + xinzhiAPIkey +
            '&location=' + pos.lat + ':' + pos.long + '&language=' + lang + '&unit=' + unit;
        // var xx = {
        //     "results": [{
        //         "location": {
        //             "id": "C23NB62W20TF",
        //             "name": "西雅图",
        //             "country": "US",
        //             "timezone": "America/Los_Angeles",
        //             "timezone_offset": "-07:00"
        //         },
        //         "now": {
        //             "text": "多云", //天气现象文字
        //             "code": "4", //天气现象代码
        //             "temperature": "14", //温度，单位为c摄氏度或f华氏度
        //             "feels_like": "14", //体感温度，单位为c摄氏度或f华氏度
        //             "pressure": "1018", //气压，单位为mb百帕或in英寸
        //             "humidity": "76", //相对湿度，0~100，单位为百分比
        //             "visibility": "16.09", //能见度，单位为km公里或mi英里
        //             "wind_direction": "西北", //风向文字
        //             "wind_direction_degree": "340", //风向角度，范围0~360，0为正北，90为正东，180为正南，270为正西
        //             "wind_speed": "8.05", //风速，单位为km/h公里每小时或mph英里每小时
        //             "wind_scale": "2", //风力等级，请参考：http://baike.baidu.com/view/465076.htm
        //             "clouds": "90", //云量，范围0~100，天空被云覆盖的百分比 #目前不支持中国城市#
        //             "dew_point": "-12" //露点温度，请参考：http://baike.baidu.com/view/118348.htm #目前不支持中国城市#
        //         },
        //         "last_update": "2015-09-25T22:45:00-07:00" //数据更新时间（该城市的本地时间）
        //     }]
        // }
        // logger.info(xx.results[0].location.id);
        https.get(url, function (res) {
            const statusCode = res.statusCode;
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
            res.on('data', function (chunk) {
                // logger.info('go to data event');
                rawData += chunk;
            });
            res.on('end', function () {
                // logger.info('go to data end');
                var data = JSON.parse(rawData);
                logger.info("心知天气现象文字：" + data.results[0].now.text);
                logger.info("心知天气现象代码：" + data.results[0].now.code);
                logger.info("心知当前温度：" + data.results[0].now.temperature + "度");
                logger.info("心知天气时间：" + data.results[0].last_update);
                response.end(rawData);
                // logger.info(data.access_token);
            });
        }).on('error', function (e) {
            console.error(e);
        })
    }
);


// 输出给app.js使用
module.exports = router;
