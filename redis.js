var redis = require('redis');

// RedisClient：连接Redis服务器
var portR = '6379';
var ipR = '127.0.0.1';
var optionR = {auth_pass: 'zjj15202185069'};
var redisClient = redis.createClient(portR, ipR, optionR);

// redis服务器连接成功事件
redisClient.on('ready', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('connect redis server OK');
    }
})

module.exports = redisClient;