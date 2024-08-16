var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var carRouter = require('./routes/car');
var brandRouter = require('./routes/brand');
var homeRouter = require('./routes/home');
var dashboardRouter = require('./routes/dashboard');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('dotenv').config();
require('./db');
app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/users', usersRouter);
app.use('/car', carRouter);
app.use('/brand', brandRouter);
app.use('/dashboard', dashboardRouter);

app.get('/home', (req, res) => {
  res.render('home'); 
});
app.get('/register', (req, res) => {
  res.render('register'); 
});
app.get('/forgetpassword', (req, res) => {
  res.render('forgetpassword'); 
});
app.get('/dashboard', (req, res) => {
  res.render('dashboard'); 
});
app.get('/profile', (req, res) => {
  res.render('profile'); 
});
app.get('/main', (req, res) => {
  res.render('main'); 
});
app.get('/testpage', (req, res) => {
  res.render('testpage'); 
});
app.get('/admin_users', (req, res) => {
  res.render('admin_users'); 
});
app.get('/footer', (req, res) => {
  res.render('footer'); 
});
app.get('/admin_dashboard', (req, res) => {
  res.render('admin_dashboard'); 
});



//car
app.get('/car', (req, res) => {
  res.render('car'); 
});

//CRUD Brand
app.get('/add_brand', (req, res) => {
  res.render('add_brand'); 
});
app.get('/manage_brand', (req, res) => {
  res.render('manage_brand'); 
});

//CRUD Car
app.get('/add_car', (req, res) => {
  res.render('add_car'); 
});
app.get('/manage_car', (req, res) => {
  res.render('manage_car'); 
});

//navbar
app.get('/navbar_user', (req, res) => {
  res.render('navbar_user'); 
});
app.get('/navbar_admin', (req, res) => {
  res.render('navbar_admin'); 
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render('error', { message: err.message });
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
