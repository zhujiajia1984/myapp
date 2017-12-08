/**
 * Created by zjj on 2017/4/28.
 * 新增数据库：https://weiquaninfo.cn/mongo/createdb
 * 数据库连接：https://weiquaninfo.cn/mongo/connect
 */
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var logger = require('../logs/log4js').logger;

const username = "dbadmin";
const pwd = "test";
const ip = "127.0.0.1";
const port = "28001";

/* 创建MongoDB数据库 */
router.get('/createdb', function (req, res, next) {
        // 创建数据库
        res.end("empty");
    }
);

/* 连接MongoDB数据库 */
router.get('/connect', function (req, res, next) {
        // 连接数据库
        var url = "mongodb://" + username + ":" +pwd + "@" + ip + ":" + port + "/admin";
        logger.info(url);
        MongoClient.connect(url, function (err, db) {
                // 连接失败
                if (err) {
                    logger.info(err);
                    res.end("connect failed");
                    return;
                }
                // 连接成功
                logger.info("Connected successfully to server");

                // 关闭数据库
                db.close();
            }
        )
        res.end("connect mongodb ok");
    }
);


module.exports = router;
