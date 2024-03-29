let express        = require('express');
let path           = require('path');
let cookieParser   = require('cookie-parser');
const Response     = require('./views/response');
const formData     = require('express-form-data');
let indexRouter    = require('./routes/index');
let usersRouter    = require('./routes/users');
let accountsRouter = require('./routes/accounts');
let storeRouter    = require('./routes/store');
let customerRouter = require('./routes/customers');
let expensesRouter = require('./routes/expenses');
const os           = require('os');
let app            = express();
const cors         = require('cors');
const options      = {
        uploadDir: os.tmpdir(),
        autoClean: true
};
// parse data with connect-multiparty.
app.use(formData.parse(options));
app.use(cors({credentials: true, origin: '*'}));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/binary-store-backend').then(data => {
        console.log('connected to mongo db');
});

// view engine setup
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/accounts', accountsRouter);
app.use('/goods', accountsRouter);
app.use('/store', storeRouter);
app.use('/customers', customerRouter);
app.use('/expenses', expensesRouter);


app.use('/v1/documentation', function (req, res) {
        let path    = require('path');
        let absPath = path.join(__dirname, './apidocs/index.html');
        res.sendFile(absPath);
});
app.use('/v1/', function (req, res) {
        let pathName = req.path;
        let absPath  = path.join(__dirname, './apidocs/' + pathName);

        res.sendFile(absPath);
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
        Response.TERMINATE_SESSION(res);
});

// error handler
app.use(function (err, req, res, next) {
        console.log(err);
        Response.ErrorWithCodeAndMessage(res, -1, err.message);
});

module.exports = app;
