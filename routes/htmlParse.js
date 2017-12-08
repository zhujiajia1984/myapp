/**
 * Created by zjj on 2017/7/31.
 */
var express = require('express');
var htmlparser = require("htmlparser2");
var router = express.Router();
var logger = require('../logs/log4js').logger;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 解析html字符串.
router.post('/wxApp', function (req, res, next) {

        // 获取参数
        // var html = req.query.html;
        var html = req.body.html;
        // logger.info(html);

        // 解析html字符串
        var contents = [];
        var item = {};
        var parser = new htmlparser.Parser({
            onopentag: function (name, attribs) {
                item = {};
                if (name === "p") {
                    item.type = "text";
                    // logger.info("p标签开始:" + item.type);
                } else if (name === "img") {
                    item.type = "img";
                    item.src = attribs.src;
                    // logger.info("img标签开始:" + item.type);
                    // logger.info("img标签src：" + item.src);
                }
            },
            ontext: function (text) {
                item.content = "";
                item.content += text;
                // logger.info("内容为：", text);
                // logger.info("content为：", item.content);
            },
            onclosetag: function (tagname) {
                // logger.info(tagname + "标签结束");
                if (tagname === "p" || tagname === "img" && item.length > 0) {
                    contents.push(item);
                    item = {};
                }
            },
            onend: function () {
                // logger.info("最后发送数据为：");
                // logger.info(contents);
                res.send(contents);
            }
        }, {decodeEntities: true});
        parser.write(html);
        parser.end();
    }
);

module.exports = router;