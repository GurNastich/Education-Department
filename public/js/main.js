'use strict';

var app = angular.module('app', ['ui.router', 'homeModule', 'studentsModule'])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    });