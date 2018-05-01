/*
    微信第三方平台开发
    授权成功回调URL:      https://www.weiquaninfo.cn/platform/wxAccount
*/

var express = require('express');
var router = express.Router();
var logger = require('../../../logs/log4js').logger;
var redisClient = require('../../../redis');
var https = require('https');
const MongoClient = require('mongodb').MongoClient;

// const
const component_appid = "wx805ef435fca595d2";

// router
/////////////////////////////////////////////////////////////////////////////////////
// 授权成功回调URL
router.get('/', function(req, res, next) {
    let { auth_code, expires_in } = req.query;
    if (typeof(auth_code) === "undefined" || auth_code === "" ||
        typeof(expires_in) === "undefined" || expires_in === "") {
        logger.error("query need");
        res.status(417).send("query need");
        return;
    }
    // 业务处理
    getComponentAccessToken(auth_code).then((data) => {
        return getAuthorizerToken(data);
    }).then((data) => {
        return saveInfo(data);
    }).then((result) => {
        logger.info("result: ", result);
        res.render('index');
    }).catch((error) => {
        logger.info("error: ", error);
        res.render('index');
    })
});

// function
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// mongodb crud
async function updateByInfo(data) {
    const client = await MongoClient.connect("mongodb://mongodb_mongodb_1:27017");
    const db = client.db("wxPlatform");
    let result = await db.collection('account').updateOne({
        authorizer_appid: data.authorization_info.authorizer_appid,
        component_appid: component_appid
    }, {
        $set: {
            authorizer_refresh_token: data.authorization_info.authorizer_refresh_token,
            func_info: data.authorization_info.func_info
        }
    }, {
        upsert: true
    });
    client.close();
    return result.result;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 数据保存到数据库和redis中
function saveInfo(data) {
    return new Promise((resolve, reject) => {
        updateByInfo(data).then((result) => {
            // 保存mongodb成功
            if (result.n === 1 && result.ok === 1) {
                // 保存redis
                // resolve(`update auth info success: ${JSON.stringify(result)}`);
                let key = `${component_appid}_${data.authorization_info.authorizer_appid}_authorizer_access_token`;
                let { authorizer_access_token, expires_in } = data.authorization_info;
                redisClient.set(key, authorizer_access_token, 'EX', expires_in, (err, reply) => {
                    if (err) return reject(err);
                    resolve(`update auth info success!`);
                })
                // redisClient
            } else {
                throw new Error(`update auth info success but save failed: ${JSON.stringify(result)}`);
            }
        }).catch((error) => {
            reject(error);
        })
    })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 获取component_access_token
function getComponentAccessToken(auth_code) {
    return new Promise((resolve, reject) => {
        redisClient.select(1, () => {
            // 选择db1
            let key = component_appid + "_component_access_token";
            redisClient.get(key, (err, component_access_token) => {
                // 获取token
                if (err) return reject(err);
                if (component_access_token) {
                    resolve({
                        auth_code: auth_code,
                        component_access_token: component_access_token
                    });
                } else {
                    return reject("component_access_token not exist!");
                }
            })
        })
    })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 通过授权码获取authorizer_access_token和authorizer_refresh_token和授权权限
function getAuthorizerToken(data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            component_appid: component_appid,
            authorization_code: data.auth_code
        });
        const options = {
            hostname: "api.weixin.qq.com",
            path: `/cgi-bin/component/api_query_auth?component_access_token=${data.component_access_token}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData, 'utf-8')
            }
        };
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                // 反馈结果
                let result = JSON.parse(rawData);
                resolve(result);
            });
        });
        req.on('error', (e) => {
            reject(`problem with request: ${e.message}`);
        });
        req.write(postData);
        req.end();
    })
}

//
module.exports = router;