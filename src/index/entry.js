require('./index.css');
require('./btn.less');
var angular = require('../utils/angular-1.2.32');
var $ = require('../utils/jquery-1.8.3.js');
var mymath = require('../utils/math.js');

var app = angular.module("app",[]);
app.controller("ctrl",function($scope,$location){
  $scope.team = appInitData.team;
  $scope.getUser = function(){
  	$.ajax({
  		type: "get",
  		url: "index/user",
  		dataType: "json",
  		success: function(res){
	  		console&&console.log("[index/user] res=",res);
	  		$scope.user =  res;
	  		$scope.$digest();
	  	},
	  	error: function(XMLHttpRequest, textStatus, errorThrown) {
		 console&&console.log(XMLHttpRequest.status);
		 console&&console.log(XMLHttpRequest.readyState);
		 console&&console.log(textStatus);
		 console&&console.log(errorThrown);
		}
  	})
  }
});