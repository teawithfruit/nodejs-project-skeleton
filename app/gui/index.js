'use strict';

var Q = require('q');
var handlebars = require('handlebars');
var request = require('request');

var Component = require('./components/Component');

window.onload = function () {
  var source = document.getElementById("person-template").innerHTML;
  var template = handlebars.compile(source);
  var context = {firstname: "John", lastname: "Doe"};
  var output = template(context);

  document.getElementById("content").innerHTML = output;
}