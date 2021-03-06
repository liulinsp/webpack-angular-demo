require('./css/index.css');
require('./css/btn.less');
var angular = require('angular');
var $ = require('jquery');
var mymath = require('../utils/math.js');

var app = angular.module("app",[]);
app.controller("ctrl",["$scope","$location",function($scope,$location){
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
}]);