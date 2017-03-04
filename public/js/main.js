'use strict';

var app = angular.module('app', ['ui.router', 'ui.select', 'ui.grid', 'homeModule', 'studentsModule', 'lessonsModule'])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    });