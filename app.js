let createError  = require('http-errors');
let express      = require('express');
let path         = require('path');
let cookieParser = require('cookie-parser');
const Response = require('./views/response');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let accountsRouter = require('./routes/accounts');
let storeRouter = require('./routes/store');

let app        = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/binary-store-backend').then(data => {
        console.log('connected to mongo db');
});

// view engine setup
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/accounts', accountsRouter);
app.use('/store', storeRouter);

app.use('/v1/documentation', function (req, res) {
        let path = require('path');
        let absPath = path.join(__dirname, './apidocs/index.html');
        res.sendFile(absPath);
});
app.use('/v1/', function (req, res) {
        let pathName = req.path;
        let absPath = path.join(__dirname, './apidocs/' + pathName);

        res.sendFile(absPath);
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
        Response.TERMINATE_SESSION(res);
});

// error handler
app.use(function (err, req, res, next) {
        Response.ErrorWithCodeAndMessage(res, -1, err.message);
});

module.exports = app;
