'use strict';

var app = angular.module('app', ['ui.router', 'ui.select', 'ui.grid', 'ui.bootstrap', 'jlareau.pnotify', 'homeModule', 'studentsModule', 'lessonsModule'])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    });