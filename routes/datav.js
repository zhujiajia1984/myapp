/**
 * Created by zjj on 2017/12/11.
 * 实时用户	https://weiquaninfo.cn/datav/dp1/user
 * 景点排名	https://weiquaninfo.cn/datav/dp1/science
 * 品牌排名	https://weiquaninfo.cn/datav/dp1/brand
 * 当前在园人数	https://weiquaninfo.cn/datav/dp1/curUser
 * 今日在园人数	https://weiquaninfo.cn/datav/dp1/todayUser
 * 停车位统计	https://weiquaninfo.cn/datav/dp1/park
 */
var express = require('express');
var router = express.Router();
var moment = require('moment');

//
var result = [];

// 实时在园人数折线图数据
router.get('/dp1/user', function(req, res, next) {
	var series1 = 'currentUser';
	var series2 = 'todayUser';
	var xData = moment().format("HH:mm:ss");
	var yData1 = RandomNumBoth(100, 200);
	var yData2 = RandomNumBoth(400, 500);
	result.push({
		x: xData,
		y: yData1,
		s: series1
	});
	result.push({
		x: xData,
		y: yData2,
		s: series2
	});
	if (result.length > 10) {
		result.shift();
		result.shift();
	}
	res.send(JSON.stringify(result));
});

// 实时人气景点排行数据
router.get('/dp1/science', function(req, res, next) {
	var name = ['无量山', '龙湖', '龙城水域', '水磨坊', '穆柯寨', '碧水湾生态小区', '龙城之窗', '县城公园', '水景', '铁扇']
	var data = [{
		value: RandomNumBoth(500, 600).toString(),
		content: name[RandomNumBoth(0,1)]
	}, {
		value: RandomNumBoth(400, 500).toString(),
		content: name[RandomNumBoth(2,3)]
	}, {
		value: RandomNumBoth(300, 400).toString(),
		content: name[RandomNumBoth(4,5)]
	}, {
		value: RandomNumBoth(200, 300).toString(),
		content: name[RandomNumBoth(6,7)]
	}, {
		value: RandomNumBoth(100, 200).toString(),
		content: name[RandomNumBoth(8,9)]
	}]
	res.send(JSON.stringify(data));
});

// 实时终端品牌排行
router.get('/dp1/brand', function(req, res, next) {
	var name = ['小米', 'iphone', '华为', 'oppo', 'vivo']
	var data = [{
		type: name[0],
		value: RandomNumBoth(200, 300).toString(),
	}, {
		type: name[1],
		value: RandomNumBoth(400, 500).toString(),
	}, {
		type: name[2],
		value: RandomNumBoth(500, 600).toString(),
	}, {
		type: name[3],
		value: RandomNumBoth(100, 200).toString(),
	}, {
		type: name[4],
		value: RandomNumBoth(100, 200).toString(),
	}]
	res.send(JSON.stringify(data));
});

// 当前在园人数
router.get('/dp1/curUser', function(req, res, next) {
	var data = [{value: RandomNumBoth(30000, 50000).toString()}]
	res.send(JSON.stringify(data));
});

// 今日入园人数
router.get('/dp1/todayUser', function(req, res, next) {
	var data = [{value: RandomNumBoth(70000, 80000).toString()}]
	res.send(JSON.stringify(data));
});

// 停车位统计
router.get('/dp1/park', function(req, res, next) {
	var data = [{
		x: "无量山",
		y: RandomNumBoth(300, 400).toString(),
		s: '1'
	},{
		x: "龙湖",
		y: RandomNumBoth(200, 300).toString(),
		s: '1'
	},{
		x: "龙城水域",
		y: RandomNumBoth(200, 300).toString(),
		s: '1'
	},{
		x: "水磨坊",
		y: RandomNumBoth(100, 200).toString(),
		s: '1'
	},{
		x: "穆柯寨",
		y: RandomNumBoth(100, 200).toString(),
		s: '1'
	},{
		x: "龙城之窗",
		y: RandomNumBoth(50, 100).toString(),
		s: '1'
	}]
	res.send(JSON.stringify(data));
});




function RandomNumBoth(Min, Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	var num = Min + Math.round(Rand * Range);
	return num;
}


module.exports = router;