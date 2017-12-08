var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;

// https://weiquaninfo.cn/login/getTableData
/* table data */
router.get('/getTableData', function(req, res, next) {
    // begin
    logger.info('go to getTableData handle');
    logger.info("pageSize:" + req.query.pageSize);
    logger.info("pageNumber:" + req.query.pageNumber);
    logger.info("condition:" + req.query.condition);
    var result = {
        "total": 200,
        "rows": [{
                "phoneMac": 'ed:54:1r:bb:t1:11',
                "findNum": "2",
                "phoneType": "华为",
            },
            {
                "phoneMac": 'ed:54:1r:bb:t1:12',
                "findNum": "3",
                "phoneType": "苹果",
            },
            {
                "phoneMac": 'ed:54:1r:bb:t1:13',
                "findNum": "4",
                "phoneType": "小米",
            },
            {
                "phoneMac": 'ed:54:1r:bb:t1:14',
                "findNum": "4",
                "phoneType": "thinkPad",
            },
            {
                "phoneMac": 'ed:54:1r:bb:t1:15',
                "phoneType": "5",
                "phoneType": "华为",
            }
        ]
    }
    var result2 = { "47:E0:B4:80:EF:0F": { "brand": "其他", "data": [{ "probeMac": "D2:EB:53:10:00:B5", "singal": 2, "dateTime": "2017/12/04 12:54:53" }, { "probeMac": "D1:EB:53:10:00:B5", "singal": 2, "dateTime": "2017/12/04 12:54:57" }] }, "46:E0:B4:80:EF:0F": { "brand": "其他", "data": [{ "probeMac": "D1:EB:53:10:00:B5", "singal": 2, "dateTime": "2017/12/04 12:55:01" }, { "probeMac": "D0:EB:53:10:00:B5", "singal": 1, "dateTime": "2017/12/04 12:55:06" }] } }

    var result3 = { "total": 21, "data": { "00:EC:0A:C8:27:84": { "brand": "小米", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 65, "dateTime": "2017/12/04 20:20:13" }] }, "04:4F:4C:15:39:1F": { "brand": "华为", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 40, "dateTime": "2017/12/04 20:19:26" }] }, "08:11:96:01:CF:28": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 53, "dateTime": "2017/12/04 20:20:30" }] }, "10:0B:A9:22:C8:64": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 47, "dateTime": "2017/12/04 20:19:41" }] }, "18:4F:32:41:D2:83": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 75, "dateTime": "2017/12/04 20:20:38" }] }, "18:4F:32:D6:C1:27": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 45, "dateTime": "2017/12/04 20:20:01" }] }, "30:95:E3:0B:09:17": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 87, "dateTime": "2017/12/04 20:20:35" }] }, "38:71:DE:32:1D:9E": { "brand": "iphone", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 53, "dateTime": "2017/12/04 20:19:06" }] }, "54:13:79:00:FF:95": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 53, "dateTime": "2017/12/04 20:20:36" }] }, "5C:F7:E6:CD:5A:2B": { "brand": "iphone", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 67, "dateTime": "2017/12/04 20:19:45" }] }, "68:94:23:72:4F:A1": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 86, "dateTime": "2017/12/04 20:20:26" }] }, "98:00:C6:92:22:56": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 86, "dateTime": "2017/12/04 20:20:00" }] }, "B0:E2:35:CC:6D:50": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 76, "dateTime": "2017/12/04 20:20:35" }] }, "B0:E2:35:CE:B7:30": { "brand": "小米", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 72, "dateTime": "2017/12/04 20:20:05" }] }, "CC:08:8D:50:9A:08": { "brand": "iphone", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 88, "dateTime": "2017/12/04 20:18:08" }] }, "DA:A1:19:15:00:37": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 87, "dateTime": "2017/12/04 20:18:53" }] }, "DA:A1:19:16:CC:6E": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 88, "dateTime": "2017/12/04 20:19:41" }] }, "DA:A1:19:1F:F2:2F": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 82, "dateTime": "2017/12/04 20:20:55" }] }, "DA:A1:19:E3:93:15": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 88, "dateTime": "2017/12/04 20:18:00" }] }, "E0:B9:4D:09:3D:8B": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 62, "dateTime": "2017/12/04 20:20:58" }] }, "F8:DA:0C:11:84:EC": { "brand": "其他", "data": [{ "probeMac": "66:61:17:00:23:41", "singal": 74, "dateTime": "2017/12/04 20:20:35" }] } } }


    res.json(result3);
});

/* sub table data */
router.post('/getSubTableData', function(req, res, next) {
    // begin
    logger.info('go to getSubTableData handle');
    logger.info("phoneMac:" + req.body.phoneMac);
    var result = [{
        devMac: "11:22:33:44:55:66",
        signal: "-87",
        findTime: "2017-12-01 12:11:12"
    }, {
        devMac: "11:22:33:44:55:77",
        signal: "-83",
        findTime: "2017-12-02 12:11:12"
    }, {
        devMac: "11:22:33:44:55:88",
        signal: "-76",
        findTime: "2017-12-02 12:21:12"
    }];
    res.send(JSON.stringify(result));
});


/* login. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/handle', function(req, res, next) {
    // begin
    logger.info('go to post handle');

    // content
    logger.info(req.body.inputContent);
    logger.info(req.body.inputRadioSex);

    //
    res.end('confirm');
});

router.get('/handle', function(req, res, next) {
    // begin
    logger.info('go to get handle');

    // content
    logger.info(req.query.content);
    logger.info(req.query.address);

    //
    res.end('index');
});

router.get('/getBannerInfo', function(req, res, next) {
    logger.info("go to getBannerInfo")
    var result = {
        urlNames: [{
            route: "/banner",
            pushUrl: "http://www.baidu.com",
            imgUrl: "https://weiquaninfo.cn/images/banner2.jpg"
        }, {
            route: "/banner",
            pushUrl: "http://www.so.com",
            imgUrl: "https://weiquaninfo.cn/images/banner1.jpg"
        }]
    }
    res.end(JSON.stringify(result));
    // setTimeout(function() {
    //     logger.info("go to getBannerInfo")
    //     var result = {
    //         urlNames: [{
    //             pushUrl: "http://www.baidu.com",
    //             imgUrl: "https://weiquaninfo.cn/images/banner2.jpg"
    //         }, {
    //             pushUrl: "http://www.so.com",
    //             imgUrl: "https://weiquaninfo.cn/images/banner1.jpg"
    //         }]
    //     }
    //     res.end(JSON.stringify(result));
    // }, 10000)
});

router.get('/getGoodsDetailImg', function(req, res, next) {
    logger.info("go to getGoodsDetailImg")
    var result = {
        urlNames: [{
            pushUrl: "http://www.baidu.com",
            imgUrl: "https://weiquaninfo.cn/images/567.png"
        }, {
            pushUrl: "http://www.so.com",
            imgUrl: "https://weiquaninfo.cn/images/789.png"
        }]
    }
    res.end(JSON.stringify(result));
    // setTimeout(function() {
    //     logger.info("go to getBannerInfo")
    //     var result = {
    //         urlNames: [{
    //             pushUrl: "http://www.baidu.com",
    //             imgUrl: "https://weiquaninfo.cn/images/banner2.jpg"
    //         }, {
    //             pushUrl: "http://www.so.com",
    //             imgUrl: "https://weiquaninfo.cn/images/banner1.jpg"
    //         }]
    //     }
    //     res.end(JSON.stringify(result));
    // }, 10000)
});



module.exports = router;