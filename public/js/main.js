'use strict';

var app = angular.module('app', ['ui-router'])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    });

console.log(app);