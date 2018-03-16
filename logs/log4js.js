/**
 * Created by zjj on 2017/3/30.
 */
// 引入日志模块
var log4js = require("log4js");
log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: { type: 'colored' }
        },
        console: {
            type: 'console',
        },
        log_date: {
            type: 'dateFile',
            filename: '/home/node/myapp/logs/log_date/dateLog',
            alwaysIncludePattern: true,
            pattern: "-yyyy-MM-dd.log",
            keepFileExt: true,
        },
        log_location: {
            type: 'file',
            filename: '/home/node/myapp/logs/log_location/location.log',
            maxLogSize: 4194304, //单位Byte,4MB分割
            keepFileExt: true,
        }
    },
    categories: {
        default: { appenders: ['log_date', 'out'], level: 'ALL' }, //默认
        location: { appenders: ['log_location', 'out'], level: 'info' }
    }
})

// 生成使用对象
var dateLog = log4js.getLogger('default');
var locationLog = log4js.getLogger('location');

// 输出对象
exports.logger = dateLog;
exports.loggerLocation = locationLog;