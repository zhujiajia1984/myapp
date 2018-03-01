var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var logger = require('./logs/log4js').logger;
var cors = require('cors');


// 自定义页面
var index = require('./routes/index');
var yunac = require('./routes/yunac');
var token = require('./routes/token');
var login = require('./routes/login');
var position = require('./routes/position');
var wxPublicAccount = require('./routes/wxPublicAccount');
var wxWeb = require('./routes/wxWeb');
var QRCode = require('./routes/QRCode');
var bmap = require('./routes/bmap');
var wxPay = require('./routes/wxPay');
var weather = require('./routes/weather');
var htmlParse = require('./routes/htmlParse');
var plantRecognize = require('./routes/plantRecognize');
var h5 = require('./routes/h5');
var location = require('./routes/location');
var datav = require('./routes/datav');
var captcha = require('./routes/captcha');
var wxWebMobileTest = require('./routes/wxWebMobileTest');

//
var app = express();

// 跨域
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// http日志服务
app.use(log4js.connectLogger(logger, { level: 'auto' }));

//
app.use(bodyParser.text({ type: 'text/xml' })); // 将请求体中的xml解析为字符串
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //  解析form格式
app.use(cookieParser());

//
app.use(express.static(path.join(__dirname, 'public')));

// 页面跳转
app.use(['/', '/index', '/apManage', '/groupManage', '/apUser', '/testYunAc', '/getwxinfo',
	'/pwdReset', '/peizhi', '/apType', '/tzManage', '/tzType', '/apUser',
	'/version', '/versionType', '/profile', '/editPwd', '/logSystem',
	'/logOperation', '/subClient', '/subRole', '/subAccount', '/account',
	'/hometongji', '/msgCenter', '/apMonitor', './editWxLogin', '/apConfig',
	'/ssidEdit', '/devmap'
], yunac);
app.use('/token', token);
app.use('/login', login);
app.use('/position', position);
app.use('/wxPublicAccount', wxPublicAccount);
app.use('/wxWeb', wxWeb);
app.use('/QRCode', QRCode);
app.use('/bmap', bmap);
app.use('/wxPay', wxPay);
app.use('/weather', weather);
app.use('/htmlParse', htmlParse);
app.use('/plantRecognize', plantRecognize);
app.use('/h5', h5);
app.use('/location', location);
app.use('/datav', datav);
app.use('/captcha', captcha);
app.use('/wxWebMobileTest', wxWebMobileTest);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;