require('./index.css');
require('./btn.less');
var angular = require('../utils/angular-1.2.32');
var mymath = require('../utils/math.js');

var app = angular.module("app",[]);
app.controller("ctrl",function($scope,$location){
  $scope.team = appInitData.team;
});