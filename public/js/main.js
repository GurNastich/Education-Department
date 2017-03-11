'use strict';

var app = angular.module('app', ['ui.router', 'ui.select', 'ui.grid', 'ui.bootstrap', 'homeModule', 'studentsModule', 'lessonsModule'])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    });