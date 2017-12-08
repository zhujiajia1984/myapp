var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').loggerLocation;

/* 保存定位点 */
router.post('/positions', function(req, res, next) {

	// 获取第一个经纬度，最后经纬度，和中间精度<=10的所有经纬度
	var data = [];
	for (var i = 0; i < req.body.data.length; i++) {
		if (i == 0) {
			data.push(req.body.data[i]);
		} else if (i == req.body.data.length - 1) {
			data.push(req.body.data[i]);
		}else{
			if(req.body.data[i].radius <= 10){
				data.push(req.body.data[i]);
			}
		}
	}
	//
	logger.info("景点名称:" + req.body.key + "  景点经纬度:" + JSON.stringify(data));

	// 
	res.json({ code: 1, message: "success" });
});

module.exports = router;