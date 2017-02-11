'use strict';

var app = angular.module('app', ['ui.router', 'ui.select', 'ui.grid', 'homeModule', 'studentsModule', 'eventsModule'])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    });