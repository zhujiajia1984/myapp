
/**
 * Created by zjj on 2017/5/26.
 * 显示百度地图   http://weiquaninfo.cn:18000/bmap
 */
var express = require('express');
var router = express.Router();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 普通地图显示
router.get('/', function (req, res, next) {
        res.render('bmap');
    }
);


module.exports = router;
