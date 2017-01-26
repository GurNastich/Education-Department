'use strict';

angular.module('homeModule').config(function($stateProvider) {
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'js/home/views/home.html',
			controller: 'homeController'
		});
});