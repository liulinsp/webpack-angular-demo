// app.js
var angular = require('../utils/angular-1.2.32');
var $ = require('../utils/jquery-1.8.3.js');
require('../utils/angular-animate-1.2.32');
require('../utils/angular-ui-router-0.2.13');
require('./style.css');
// create our angular app and inject ngAnimate and ui-router 
// =============================================================================
angular.module('app', ['ngAnimate', 'ui.router'])

// configuring our routes 
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    
        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: 'static/template/form.html',
            controller: 'formController'
        })
        
        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('form.profile', {
            url: '/profile',
            templateUrl: 'static/template/form-profile.html'
        })
        
        // url will be /form/interests
        .state('form.interests', {
            url: '/interests',
            templateUrl: 'static/template/form-interests.html'
        })
        
        // url will be /form/payment
        .state('form.payment', {
            url: '/payment',
            templateUrl: 'static/template/form-payment.html'
        });
        
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/form/profile');
})

// our controller for the form
// =============================================================================

.controller('formController', function($scope) {
    
    // we will store all of our form data in this object
    $scope.formData = appInitData;
    
    /*// function to process the form
    $scope.processForm = function() {
        alert('awesome!');
    };*/

    $scope.processForm = function(){
        $.ajax({
            type: "post",
            url: "index/save",
            data: $scope.formData,
            dataType: "json",
            success: function(res){
                console&&console.log("[index/user] res=",res);
                if(res.code=="1"){
                    alert("OK："+res.msg);
                }else{
                    alert("error："+res.msg);
                }
                
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
             console&&console.log(XMLHttpRequest.status);
             console&&console.log(XMLHttpRequest.readyState);
             console&&console.log(textStatus);
             console&&console.log(errorThrown);
            }
        })
    };
    
});