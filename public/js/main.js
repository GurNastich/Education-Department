'use strict';

var app = angular.module('app', ['ui.router', 'ui.select', 'homeModule', 'studentsModule'])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    });