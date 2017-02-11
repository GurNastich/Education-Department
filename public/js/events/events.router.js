'use strict';

angular.module('eventsModule').config(function($stateProvider) {
	$stateProvider
		.state('events', {
			url: '/events',
			templateUrl: 'js/events/views/events.html',
			controller: 'eventsController'
		});
});