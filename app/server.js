var koa = require('koa');
var bodyParser = require('koa-body-parser');
var mount = require('koa-mount');
var fs = require('fs');
var path = require('path');
var handlebars = require("koa-handlebars");
var router = require('koa-router');
var serve = require('koa-static');
var fse = require('fs-extra');
var util = require('util');
var app = koa();

var lib = require('./lib/');

app.use(bodyParser());

app.use(handlebars({
  defaultLayout: "index",
  layoutsDir: "app/layouts",
  viewsDir: "app/views",
  partialsDir: "app/partials",
  helpers: {
    json: function (obj) {
            return JSON.stringify(obj);
          }
  }
}));

app.use(router(app));
var pub = new router();

pub.get('/', function *(next) {
  yield this.render("index", {
    title: "Test Page",
    name: "World"
  });
});

pub.post('/', function *(next) {
  return 'Hello World!';  
});

app.use(mount('/static', app.use(serve(__dirname + '/static'))));
app.use(mount('/bower_components', app.use(serve(__dirname + '/bower_components'))));
app.use(mount('/', pub.middleware()));

app.listen(8000);